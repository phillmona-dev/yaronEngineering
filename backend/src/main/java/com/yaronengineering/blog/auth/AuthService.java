package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorCode;
import com.yaronengineering.blog.common.ErrorResponse;
import com.yaronengineering.blog.config.AppProperties;
import com.yaronengineering.blog.user.User;
import com.yaronengineering.blog.user.UserDto;
import com.yaronengineering.blog.user.UserRepository;
import com.yaronengineering.blog.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository users;
    private final UserService userService;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final PasswordResetTokenRepository resetTokens;
    private final PasswordResetMailer mailer;
    private final AppProperties props;
    private final Clock clock;

    public AuthService(UserRepository users, UserService userService, PasswordEncoder encoder, JwtService jwt,
                       PasswordResetTokenRepository resetTokens, PasswordResetMailer mailer, AppProperties props, Clock clock) {
        this.users = users;
        this.userService = userService;
        this.encoder = encoder;
        this.jwt = jwt;
        this.resetTokens = resetTokens;
        this.mailer = mailer;
        this.props = props;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest req) {
        User user = users.findByEmailIgnoreCase(req.email()).orElse(null);
        if (user == null || !user.isEnabled() || !encoder.matches(req.password(), user.getPasswordHash())) {
            log.info("auth: failed login for email={}", req.email());
            throw new BadCredentialsException("Invalid credentials");
        }
        log.info("auth: login userId={} role={}", user.getId(), user.getRole());
        return new AuthDtos.LoginResponse(jwt.issue(user), "Bearer", jwt.ttlSeconds(), userService.toDto(user));
    }

    @Transactional(readOnly = true)
    public UserDto me(CurrentUser cu) {
        return userService.toDto(requireUser(cu));
    }

    @Transactional(readOnly = true)
    public AuthDtos.SecurityOverview security(CurrentUser cu) {
        User user = requireUser(cu);
        return new AuthDtos.SecurityOverview(userService.toDto(user), user.getPasswordChangedAt(), jwt.ttlSeconds(),
            PasswordPolicy.MIN_LENGTH, PasswordPolicy.DESCRIPTION, mailer.isEmailEnabled());
    }

    /** Verifies the current password, applies the new one and returns a fresh token (older tokens stop working). */
    @Transactional
    public AuthDtos.LoginResponse changePassword(CurrentUser cu, AuthDtos.ChangePasswordRequest req) {
        User user = requireUser(cu);
        if (!encoder.matches(req.currentPassword(), user.getPasswordHash())) {
            log.info("auth: change-password rejected (wrong current password) userId={}", user.getId());
            throw ApiException.validation("Current password is incorrect",
                List.of(new ErrorResponse.FieldError("currentPassword", "is incorrect")));
        }
        applyNewPassword(user, req.newPassword());
        log.info("auth: password changed userId={}", user.getId());
        return new AuthDtos.LoginResponse(jwt.issue(user), "Bearer", jwt.ttlSeconds(), userService.toDto(user));
    }

    /** Always succeeds from the caller's point of view so the endpoint cannot be used to enumerate accounts. */
    @Transactional
    public void forgotPassword(String email) {
        Instant now = Instant.now(clock);
        User user = users.findByEmailIgnoreCase(email.trim()).filter(User::isEnabled).orElse(null);
        if (user == null) {
            log.info("auth: password reset requested for unknown or disabled account");
            return;
        }
        resetTokens.invalidateAllForUser(user.getId(), now);

        byte[] raw = new byte[32];
        RANDOM.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);

        PasswordResetToken t = new PasswordResetToken();
        t.setUser(user);
        t.setTokenHash(sha256(token));
        t.setExpiresAt(now.plus(Duration.ofMinutes(ttlMinutes())));
        resetTokens.save(t);

        String url = frontendUrl() + "/admin/reset-password?token=" + token;
        try {
            mailer.sendResetLink(user, url, t.getExpiresAt());
        } catch (RuntimeException e) {
            // Do not leak delivery failures to the caller; the admin can request a new link.
            log.error("auth: failed to deliver password reset link userId={}: {}", user.getId(), e.toString());
        }
        log.info("auth: password reset token issued userId={} expiresAt={}", user.getId(), t.getExpiresAt());
    }

    @Transactional
    public void resetPassword(AuthDtos.ResetPasswordRequest req) {
        Instant now = Instant.now(clock);
        PasswordResetToken t = resetTokens.findByTokenHash(sha256(req.token().trim()))
            .filter(x -> x.isUsable(now))
            .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_TOKEN,
                "This reset link is invalid or has expired. Please request a new one."));
        User user = t.getUser();
        if (!user.isEnabled()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_TOKEN, "This account is disabled.");
        }
        applyNewPassword(user, req.newPassword());
        t.setUsedAt(now);
        log.info("auth: password reset completed userId={}", user.getId());
    }

    private void applyNewPassword(User user, String newPassword) {
        PasswordPolicy.require(newPassword, "newPassword");
        if (encoder.matches(newPassword, user.getPasswordHash())) {
            throw ApiException.validation("The new password must be different from the current one",
                List.of(new ErrorResponse.FieldError("newPassword", "must differ from the current password")));
        }
        Instant changedAt = Instant.now(clock).truncatedTo(ChronoUnit.SECONDS); // JWT iat has second precision
        user.setPasswordHash(encoder.encode(newPassword));
        user.setPasswordChangedAt(changedAt);
        resetTokens.invalidateAllForUser(user.getId(), changedAt);
    }

    private User requireUser(CurrentUser cu) {
        return users.findById(cu.id()).orElseThrow(() -> new BadCredentialsException("Unknown user"));
    }

    private long ttlMinutes() {
        AppProperties.PasswordReset pr = props.passwordReset();
        return pr == null || pr.ttlMinutes() <= 0 ? 30 : pr.ttlMinutes();
    }

    private String frontendUrl() {
        AppProperties.PasswordReset pr = props.passwordReset();
        String url = pr == null || pr.frontendUrl() == null || pr.frontendUrl().isBlank() ? "http://localhost:3000" : pr.frontendUrl();
        return url.replaceAll("/+$", "");
    }

    static String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}

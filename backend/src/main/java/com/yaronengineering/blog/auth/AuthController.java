package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorCode;
import com.yaronengineering.blog.user.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService auth;
    private final LoginRateLimiter limiter;

    public AuthController(AuthService auth, LoginRateLimiter limiter) {
        this.auth = auth;
        this.limiter = limiter;
    }

    @PostMapping("/login")
    public AuthDtos.LoginResponse login(@Valid @RequestBody AuthDtos.LoginRequest req, HttpServletRequest http) {
        rateLimit("login", http, "Too many login attempts. Try again in a minute.");
        return auth.login(req);
    }

    @GetMapping("/me")
    public UserDto me() {
        return auth.me(CurrentUser.require());
    }

    @GetMapping("/security")
    public AuthDtos.SecurityOverview security() {
        return auth.security(CurrentUser.require());
    }

    /** Returns a fresh token: tokens issued before the change are rejected from now on. */
    @PostMapping("/change-password")
    public AuthDtos.LoginResponse changePassword(@Valid @RequestBody AuthDtos.ChangePasswordRequest req) {
        return auth.changePassword(CurrentUser.require(), req);
    }

    /** Public. Same response whether or not the account exists. */
    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AuthDtos.Ack forgotPassword(@Valid @RequestBody AuthDtos.ForgotPasswordRequest req, HttpServletRequest http) {
        rateLimit("forgot", http, "Too many reset requests. Try again in a minute.");
        auth.forgotPassword(req.email());
        return new AuthDtos.Ack("If an account exists for that email, a password reset link has been sent.");
    }

    /** Public. Consumes a one-time token from the reset email. */
    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@Valid @RequestBody AuthDtos.ResetPasswordRequest req, HttpServletRequest http) {
        rateLimit("reset", http, "Too many attempts. Try again in a minute.");
        auth.resetPassword(req);
    }

    private void rateLimit(String bucket, HttpServletRequest http, String message) {
        if (!limiter.allow(bucket + ":" + clientIp(http))) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, ErrorCode.RATE_LIMITED, message);
        }
    }

    private static String clientIp(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) return fwd.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}

package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.user.User;
import com.yaronengineering.blog.user.UserRepository;
import com.yaronengineering.blog.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository users;
    private final UserService userService;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, UserService userService, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.userService = userService;
        this.encoder = encoder;
        this.jwt = jwt;
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
    public com.yaronengineering.blog.user.UserDto me(CurrentUser cu) {
        User user = users.findById(cu.id()).orElseThrow(() -> new BadCredentialsException("Unknown user"));
        return userService.toDto(user);
    }
}

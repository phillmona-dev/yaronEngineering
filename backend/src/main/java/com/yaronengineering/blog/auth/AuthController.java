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
        if (!limiter.allow(clientIp(http))) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, ErrorCode.RATE_LIMITED, "Too many login attempts. Try again in a minute.");
        }
        return auth.login(req);
    }

    @GetMapping("/me")
    public UserDto me() {
        return auth.me(CurrentUser.require());
    }

    private static String clientIp(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) return fwd.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}

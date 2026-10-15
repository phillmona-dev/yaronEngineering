package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorCode;
import com.yaronengineering.blog.user.Role;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

/** Authenticated principal stored in the security context. */
public record CurrentUser(UUID id, String email, String name, Role role) {
    public boolean is(Role r) { return role == r; }
    public boolean canPublish() { return role == Role.ADMIN || role == Role.EDITOR; }
    public boolean isAuthorOnly() { return role == Role.AUTHOR; }

    public static Optional<CurrentUser> current() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && a.getPrincipal() instanceof CurrentUser cu) return Optional.of(cu);
        return Optional.empty();
    }

    public static CurrentUser require() {
        return current().orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, "Authentication required"));
    }
}

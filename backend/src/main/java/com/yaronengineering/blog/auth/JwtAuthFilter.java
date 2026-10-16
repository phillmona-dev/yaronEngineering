package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.user.User;
import com.yaronengineering.blog.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwt;
    private final UserRepository users;

    public JwtAuthFilter(JwtService jwt, UserRepository users) {
        this.jwt = jwt;
        this.users = users;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication() == null) {
            jwt.parse(header.substring(7)).ifPresent(p -> users.findById(p.userId()).filter(User::isEnabled).filter(user -> issuedAfterPasswordChange(p, user)).ifPresent(user -> {
                CurrentUser principal = new CurrentUser(user.getId(), user.getEmail(), user.getName(), user.getRole());
                var auth = new UsernamePasswordAuthenticationToken(principal, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }));
        }
        chain.doFilter(req, res);
    }

    /** A password change signs out every session: tokens issued before it (second precision) are ignored. */
    private static boolean issuedAfterPasswordChange(JwtService.Principal p, User user) {
        if (user.getPasswordChangedAt() == null) return true;
        if (p.issuedAt() == null) return false;
        return !p.issuedAt().isBefore(user.getPasswordChangedAt());
    }
}

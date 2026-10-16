package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.config.AppProperties;
import com.yaronengineering.blog.user.Role;
import com.yaronengineering.blog.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class JwtService {
    public record Principal(UUID userId, String email, Role role, Instant issuedAt) {}

    private final SecretKey key;
    private final long ttlSeconds;

    public JwtService(AppProperties props) {
        String secret = props.jwt().secret();
        if (secret == null || secret.length() < 32) {
            // Only reachable under the test profile (JwtSecretValidator fails fast otherwise).
            secret = "test-only-secret-key-that-is-at-least-32-chars";
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlSeconds = props.jwt().ttlSeconds() <= 0 ? 43200 : props.jwt().ttlSeconds();
    }

    public long ttlSeconds() { return ttlSeconds; }

    public String issue(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(user.getId().toString())
            .claim("email", user.getEmail())
            .claim("role", user.getRole().name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(ttlSeconds)))
            .signWith(key)
            .compact();
    }

    public Optional<Principal> parse(String token) {
        try {
            Claims c = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            Instant issuedAt = c.getIssuedAt() == null ? null : c.getIssuedAt().toInstant();
            return Optional.of(new Principal(UUID.fromString(c.getSubject()), c.get("email", String.class), Role.valueOf(c.get("role", String.class)), issuedAt));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}

package com.yaronengineering.blog.config;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/** Fails fast at startup when JWT_SECRET is missing or too short (except under the test profile). */
@Component
public class JwtSecretValidator {
    public JwtSecretValidator(AppProperties props, Environment env) {
        boolean test = Arrays.asList(env.getActiveProfiles()).contains("test");
        String secret = props.jwt().secret();
        if (!test && (secret == null || secret.length() < 32)) {
            throw new IllegalStateException("JWT_SECRET must be set and at least 32 characters long");
        }
    }
}

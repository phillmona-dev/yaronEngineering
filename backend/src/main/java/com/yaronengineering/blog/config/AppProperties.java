package com.yaronengineering.blog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Admin admin, Cors cors, Media media, Revalidate revalidate, Seed seed, PasswordReset passwordReset, Mail mail) {
    public record Jwt(String secret, long ttlSeconds) {}
    public record Admin(String email, String password, String name) {}
    public record Cors(String allowedOrigins) {}
    public record Media(String storagePath, String publicBaseUrl, int maxSizeMb) {}
    public record Revalidate(String url, String secret) {}
    public record Seed(boolean sampleContent) {}
    /** Where reset links point (the Next.js origin) and how long they stay valid. */
    public record PasswordReset(String frontendUrl, long ttlMinutes) {}
    /** Optional SMTP relay. When host is blank, reset links are written to the server log instead. */
    public record Mail(String host, int port, String username, String password, String from, boolean starttls) {}
}

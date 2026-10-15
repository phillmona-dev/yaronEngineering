package com.yaronengineering.blog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Admin admin, Cors cors, Media media, Revalidate revalidate, Seed seed) {
    public record Jwt(String secret, long ttlSeconds) {}
    public record Admin(String email, String password, String name) {}
    public record Cors(String allowedOrigins) {}
    public record Media(String storagePath, String publicBaseUrl, int maxSizeMb) {}
    public record Revalidate(String url, String secret) {}
    public record Seed(boolean sampleContent) {}
}

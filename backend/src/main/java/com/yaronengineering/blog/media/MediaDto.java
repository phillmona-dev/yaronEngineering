package com.yaronengineering.blog.media;

import java.time.Instant;
import java.util.UUID;

public record MediaDto(UUID id, String url, String altText, Integer width, Integer height, String mimeType, long sizeBytes,
                       String originalFilename, Instant createdAt) {
    public static MediaDto from(Media m) {
        if (m == null) return null;
        return new MediaDto(m.getId(), m.getUrl(), m.getAltText(), m.getWidth(), m.getHeight(), m.getMimeType(), m.getSizeBytes(),
            m.getOriginalFilename(), m.getCreatedAt());
    }
}

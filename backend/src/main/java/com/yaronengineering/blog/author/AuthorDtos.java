package com.yaronengineering.blog.author;

import com.yaronengineering.blog.media.MediaDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public final class AuthorDtos {
    private AuthorDtos() {}

    public record AuthorRequest(@NotBlank @Size(max = 160) String name, @Size(max = 180) String slug, @Size(max = 160) String position,
                                String bio, UUID avatarId, @Size(max = 300) String linkedinUrl, UUID userId) {}

    public record AuthorDto(UUID id, String name, String slug, String position, String bio, MediaDto avatar, String linkedinUrl,
                            long articleCount, UUID userId) {}

    public record AuthorRef(UUID id, String name, String slug, String position, MediaDto avatar) {
        public static AuthorRef from(Author a) {
            return a == null ? null : new AuthorRef(a.getId(), a.getName(), a.getSlug(), a.getPosition(), MediaDto.from(a.getAvatar()));
        }
    }
}

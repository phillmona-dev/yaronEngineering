package com.yaronengineering.blog.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public final class TagDtos {
    private TagDtos() {}

    public record TagRequest(@NotBlank @Size(max = 120) String name, @Size(max = 140) String slug) {}

    public record TagDto(UUID id, String name, String slug, long articleCount) {}

    public record TagRef(UUID id, String name, String slug) {
        public static TagRef from(Tag t) {
            return new TagRef(t.getId(), t.getName(), t.getSlug());
        }
    }
}

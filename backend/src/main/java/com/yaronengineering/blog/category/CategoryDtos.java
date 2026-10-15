package com.yaronengineering.blog.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public final class CategoryDtos {
    private CategoryDtos() {}

    public record CategoryRequest(@NotBlank @Size(max = 120) String name, @Size(max = 140) String slug,
                                  String description, @Size(max = 240) String tagline, Integer sortOrder) {}

    public record CategoryDto(UUID id, String name, String slug, String description, String tagline, long articleCount, int sortOrder) {}

    public record CategoryRef(UUID id, String name, String slug) {
        public static CategoryRef from(Category c) {
            return c == null ? null : new CategoryRef(c.getId(), c.getName(), c.getSlug());
        }
    }

    public record CategoryDetail(UUID id, String name, String slug, String description, String tagline, long articleCount, int sortOrder,
                                 List<CategoryDto> related) {}
}

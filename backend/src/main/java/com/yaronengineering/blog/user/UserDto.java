package com.yaronengineering.blog.user;

import java.util.UUID;

public record UserDto(UUID id, String email, String name, Role role, String authorSlug, boolean enabled) {
    public static UserDto from(User u, String authorSlug) {
        return new UserDto(u.getId(), u.getEmail(), u.getName(), u.getRole(), authorSlug, u.isEnabled());
    }
}

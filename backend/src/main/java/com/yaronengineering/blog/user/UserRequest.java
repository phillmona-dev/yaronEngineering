package com.yaronengineering.blog.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank @Email @Size(max = 200) String email,
    @NotBlank @Size(max = 160) String name,
    @NotNull Role role,
    @Size(min = 10, max = 100) String password,
    Boolean enabled
) {}

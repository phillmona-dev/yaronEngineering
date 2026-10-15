package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.user.UserDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record LoginResponse(String accessToken, String tokenType, long expiresIn, UserDto user) {}
}

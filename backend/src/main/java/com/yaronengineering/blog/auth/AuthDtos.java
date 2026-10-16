package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.user.UserDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record LoginResponse(String accessToken, String tokenType, long expiresIn, UserDto user) {}

    public record ChangePasswordRequest(@NotBlank String currentPassword, @NotBlank @Size(max = 256) String newPassword) {}

    public record ForgotPasswordRequest(@NotBlank @Email String email) {}

    public record ResetPasswordRequest(@NotBlank @Size(max = 512) String token, @NotBlank @Size(max = 256) String newPassword) {}

    /** Generic acknowledgement that deliberately reveals nothing about account existence. */
    public record Ack(String message) {}

    /** What the Security page shows about the signed-in account. */
    public record SecurityOverview(UserDto user, Instant passwordChangedAt, long sessionTtlSeconds,
                                   int passwordMinLength, String passwordPolicy, boolean resetEmailEnabled) {}
}

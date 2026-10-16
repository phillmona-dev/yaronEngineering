package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.AbstractIntegrationTest;
import com.yaronengineering.blog.user.Role;
import com.yaronengineering.blog.user.User;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PasswordSecurityIT extends AbstractIntegrationTest {

    @MockitoBean
    PasswordResetMailer mailer;

    @Test
    void changePasswordValidatesAndRotatesToken() throws Exception {
        User u = ensureUser("change-it@test.local", Role.EDITOR);
        String oldToken = bearer(u);

        mvc.perform(post("/api/v1/auth/change-password").header("Authorization", oldToken).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("currentPassword", "wrong", "newPassword", "Brand-new-pass-42"))))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors[0].field").value("currentPassword"));

        mvc.perform(post("/api/v1/auth/change-password").header("Authorization", oldToken).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("currentPassword", "Password123!", "newPassword", "short1"))))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors[0].field").value("newPassword"));

        mvc.perform(post("/api/v1/auth/change-password").header("Authorization", oldToken).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("currentPassword", "Password123!", "newPassword", "Password123!"))))
            .andExpect(status().isBadRequest());

        Thread.sleep(1100); // JWT iat is second precision; make the old token clearly older than the change
        MvcResult ok = mvc.perform(post("/api/v1/auth/change-password").header("Authorization", oldToken).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("currentPassword", "Password123!", "newPassword", "Brand-new-pass-42"))))
            .andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").isString()).andReturn();
        String newToken = "Bearer " + json.readTree(ok.getResponse().getContentAsString()).get("accessToken").asText();

        mvc.perform(get("/api/v1/auth/me").header("Authorization", oldToken)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/auth/me").header("Authorization", newToken)).andExpect(status().isOk());
        mvc.perform(get("/api/v1/auth/security").header("Authorization", newToken)).andExpect(status().isOk())
            .andExpect(jsonPath("$.passwordChangedAt").isString()).andExpect(jsonPath("$.passwordMinLength").value(10));

        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", u.getEmail(), "password", "Brand-new-pass-42"))))
            .andExpect(status().isOk());
    }

    @Test
    void forgotAndResetPasswordFlow() throws Exception {
        User u = ensureUser("reset-it@test.local", Role.AUTHOR);

        mvc.perform(post("/api/v1/auth/forgot-password").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", "nobody@test.local"))))
            .andExpect(status().isAccepted()).andExpect(jsonPath("$.message").isString());
        verify(mailer, never()).sendResetLink(any(), any(), any());

        mvc.perform(post("/api/v1/auth/forgot-password").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", u.getEmail().toUpperCase()))))
            .andExpect(status().isAccepted());
        ArgumentCaptor<String> url = ArgumentCaptor.forClass(String.class);
        verify(mailer).sendResetLink(any(User.class), url.capture(), any(Instant.class));
        assertThat(url.getValue()).startsWith("http://localhost:3000/admin/reset-password?token=");
        String token = url.getValue().substring(url.getValue().indexOf("token=") + 6);

        mvc.perform(post("/api/v1/auth/reset-password").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", "not-a-real-token", "newPassword", "Another-pass-77"))))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("INVALID_TOKEN"));

        mvc.perform(post("/api/v1/auth/reset-password").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token, "newPassword", "weak"))))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        mvc.perform(post("/api/v1/auth/reset-password").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token, "newPassword", "Another-pass-77"))))
            .andExpect(status().isNoContent());

        // one-time use
        mvc.perform(post("/api/v1/auth/reset-password").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("token", token, "newPassword", "Another-pass-78"))))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("INVALID_TOKEN"));

        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", u.getEmail(), "password", "Another-pass-77"))))
            .andExpect(status().isOk());
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", u.getEmail(), "password", "Password123!"))))
            .andExpect(status().isUnauthorized());
        verify(mailer, never()).sendResetLink(eq(null), any(), any());
    }
}

package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthorizationIT extends AbstractIntegrationTest {

    @Test
    void loginIssuesTokenAndRejectsBadPassword() throws Exception {
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", editor.getEmail(), "password", "Password123!"))))
            .andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").isString()).andExpect(jsonPath("$.user.role").value("EDITOR"));
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", editor.getEmail(), "password", "wrong"))))
            .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    void adminEndpointsRequireAuthentication() throws Exception {
        mvc.perform(get("/api/v1/articles")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
        mvc.perform(get("/api/v1/dashboard/stats").header("Authorization", "Bearer not-a-token")).andExpect(status().isUnauthorized());
    }

    @Test
    void authorCannotPublishOrEditOthersArticles() throws Exception {
        MvcResult own = mvc.perform(post("/api/v1/articles").header("Authorization", bearer(author)).contentType(MediaType.APPLICATION_JSON)
                .content(completeArticleJson("Author Owned"))).andExpect(status().isCreated()).andReturn();
        String ownId = json.readTree(own.getResponse().getContentAsString()).get("id").asText();
        mvc.perform(post("/api/v1/articles/" + ownId + "/publish").header("Authorization", bearer(author)))
            .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("FORBIDDEN"));

        MvcResult other = mvc.perform(post("/api/v1/articles").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON)
                .content(completeArticleJson("Editor Owned"))).andExpect(status().isCreated()).andReturn();
        String otherId = json.readTree(other.getResponse().getContentAsString()).get("id").asText();
        mvc.perform(get("/api/v1/articles/" + otherId).header("Authorization", bearer(author))).andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/articles").header("Authorization", bearer(author))).andExpect(status().isOk())
            .andExpect(jsonPath("$.content[?(@.title == 'Editor Owned')]").isEmpty());
        mvc.perform(get("/api/v1/users").header("Authorization", bearer(editor))).andExpect(status().isForbidden());
    }

    @Test
    void publicEndpointsHideDrafts() throws Exception {
        MvcResult r = mvc.perform(post("/api/v1/articles").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON)
                .content(completeArticleJson("Secret Draft"))).andExpect(status().isCreated()).andReturn();
        String slug = json.readTree(r.getResponse().getContentAsString()).get("slug").asText();
        mvc.perform(get("/api/v1/public/articles/" + slug)).andExpect(status().isNotFound());
        mvc.perform(get("/api/v1/public/articles/search").param("q", "Secret Draft")).andExpect(status().isOk())
            .andExpect(jsonPath("$.content[?(@.slug == '" + slug + "')]").isEmpty());
    }
}

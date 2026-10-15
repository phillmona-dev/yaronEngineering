package com.yaronengineering.blog.article;

import com.fasterxml.jackson.databind.JsonNode;
import com.yaronengineering.blog.AbstractIntegrationTest;
import com.yaronengineering.blog.publication.PublicationScheduler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ArticleWorkflowIT extends AbstractIntegrationTest {

    @Autowired ArticleRepository articles;
    @Autowired PublicationScheduler scheduler;

    @Test
    void createsDraftWithUniqueSlugAndSanitizedContent() throws Exception {
        String body = json.writeValueAsString(Map.of("title", "Slug Test Article", "contentHtml", "<p>hi</p><script>x()</script>"));
        MvcResult first = mvc.perform(post("/api/v1/articles").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("DRAFT"))
            .andExpect(jsonPath("$.slug").value("slug-test-article"))
            .andReturn();
        assertThat(first.getResponse().getContentAsString()).doesNotContain("<script>");
        mvc.perform(post("/api/v1/articles").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.slug").value("slug-test-article-2"));
        // explicit duplicate slug is a conflict
        String explicit = json.writeValueAsString(Map.of("title", "Other", "slug", "slug-test-article"));
        mvc.perform(post("/api/v1/articles").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON).content(explicit))
            .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("CONFLICT"));
    }

    @Test
    void publishValidationListsMissingFields() throws Exception {
        String id = create(editor, json.writeValueAsString(Map.of("title", "Incomplete")));
        mvc.perform(post("/api/v1/articles/" + id + "/publish").header("Authorization", bearer(editor)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.errors[*].field").value(org.hamcrest.Matchers.hasItems("excerpt", "categoryId", "authorId", "coverImageId", "seoDescription")));
    }

    @Test
    void stateTransitionsAndRevisions() throws Exception {
        String id = create(editor, completeArticleJson("Lifecycle Article"));
        mvc.perform(post("/api/v1/articles/" + id + "/publish").header("Authorization", bearer(editor)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("PUBLISHED")).andExpect(jsonPath("$.publishedAt").exists());
        mvc.perform(post("/api/v1/articles/" + id + "/publish").header("Authorization", bearer(editor)))
            .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("INVALID_STATE"));
        mvc.perform(get("/api/v1/public/articles/lifecycle-article")).andExpect(status().isOk()).andExpect(jsonPath("$.toc[0].id").value("overview"));

        // update creates a revision; title change visible publicly after update
        String updated = completeArticleJson("Lifecycle Article Updated");
        mvc.perform(put("/api/v1/articles/" + id).header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON).content(updated))
            .andExpect(status().isOk()).andExpect(jsonPath("$.title").value("Lifecycle Article Updated"));
        MvcResult revs = mvc.perform(get("/api/v1/articles/" + id + "/revisions").header("Authorization", bearer(editor)))
            .andExpect(status().isOk()).andReturn();
        JsonNode revisions = json.readTree(revs.getResponse().getContentAsString());
        assertThat(revisions).hasSize(1);
        assertThat(revisions.get(0).get("title").asText()).isEqualTo("Lifecycle Article");
        mvc.perform(post("/api/v1/articles/" + id + "/revisions/" + revisions.get(0).get("id").asText() + "/restore").header("Authorization", bearer(editor)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.title").value("Lifecycle Article"));

        mvc.perform(post("/api/v1/articles/" + id + "/unpublish").header("Authorization", bearer(editor)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("DRAFT"));
        mvc.perform(get("/api/v1/public/articles/lifecycle-article")).andExpect(status().isNotFound());
        mvc.perform(post("/api/v1/articles/" + id + "/archive").header("Authorization", bearer(editor)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ARCHIVED"));
        mvc.perform(post("/api/v1/articles/" + id + "/publish").header("Authorization", bearer(editor)))
            .andExpect(status().isConflict());
        mvc.perform(post("/api/v1/articles/" + id + "/unarchive").header("Authorization", bearer(editor)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("DRAFT"));
        mvc.perform(delete("/api/v1/articles/" + id).header("Authorization", bearer(editor))).andExpect(status().isForbidden());
        mvc.perform(delete("/api/v1/articles/" + id).header("Authorization", bearer(admin))).andExpect(status().isNoContent());
    }

    @Test
    void schedulingPublishesWhenDue() throws Exception {
        String id = create(editor, completeArticleJson("Scheduled Article"));
        mvc.perform(post("/api/v1/articles/" + id + "/schedule").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("scheduledAt", Instant.now().minusSeconds(60).toString()))))
            .andExpect(status().isBadRequest());
        mvc.perform(post("/api/v1/articles/" + id + "/schedule").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("scheduledAt", Instant.now().plusSeconds(2).toString()))))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("SCHEDULED"));
        mvc.perform(get("/api/v1/public/articles/scheduled-article")).andExpect(status().isNotFound());
        scheduler.publishDue();
        assertThat(articles.findById(java.util.UUID.fromString(id)).orElseThrow().getStatus()).isEqualTo(ArticleStatus.SCHEDULED);
        Thread.sleep(2500);
        scheduler.publishDue();
        Article a = articles.findById(java.util.UUID.fromString(id)).orElseThrow();
        assertThat(a.getStatus()).isEqualTo(ArticleStatus.PUBLISHED);
        assertThat(a.getPublishedAt()).isNotNull();
        mvc.perform(get("/api/v1/public/articles/scheduled-article")).andExpect(status().isOk());
    }

    @Test
    void publicListIsPaginatedAndExcludesDrafts() throws Exception {
        for (int i = 0; i < 3; i++) {
            String id = create(editor, completeArticleJson("Paged Article " + i));
            mvc.perform(post("/api/v1/articles/" + id + "/publish").header("Authorization", bearer(editor))).andExpect(status().isOk());
        }
        create(editor, json.writeValueAsString(Map.of("title", "Hidden Draft Article")));
        MvcResult res = mvc.perform(get("/api/v1/public/articles").param("page", "0").param("size", "2"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.size").value(2)).andExpect(jsonPath("$.content.length()").value(2)).andReturn();
        String body = res.getResponse().getContentAsString();
        assertThat(body).doesNotContain("Hidden Draft Article");
        JsonNode page = json.readTree(body);
        assertThat(page.get("totalElements").asLong()).isGreaterThanOrEqualTo(3);
        assertThat(page.get("page").asInt()).isZero();
    }

    private String create(com.yaronengineering.blog.user.User as, String body) throws Exception {
        MvcResult r = mvc.perform(post("/api/v1/articles").header("Authorization", bearer(as)).contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated()).andReturn();
        return json.readTree(r.getResponse().getContentAsString()).get("id").asText();
    }
}

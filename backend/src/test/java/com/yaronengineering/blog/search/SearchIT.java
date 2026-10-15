package com.yaronengineering.blog.search;

import com.yaronengineering.blog.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SearchIT extends AbstractIntegrationTest {

    @Test
    void fullTextSearchFindsPublishedArticlesWithHighlight() throws Exception {
        String body = json.writeValueAsString(Map.of(
            "title", "Zero Trust Segmentation Primer",
            "excerpt", "A primer on segmentation.",
            "contentHtml", "<h2>Intro</h2><p>Microsegmentation isolates workloads so lateral movement is contained across the enterprise fabric.</p>",
            "categoryId", anyCategory().getId(), "authorId", anyAuthor().getId(), "coverImageId", anyMedia().getId(),
            "seoDescription", "seo", "tagIds", List.of()));
        MvcResult r = mvc.perform(post("/api/v1/articles").header("Authorization", bearer(editor)).contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isCreated()).andReturn();
        String id = json.readTree(r.getResponse().getContentAsString()).get("id").asText();
        mvc.perform(post("/api/v1/articles/" + id + "/publish").header("Authorization", bearer(editor))).andExpect(status().isOk());

        mvc.perform(get("/api/v1/public/articles/search").param("q", "lateral movement"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].slug").value("zero-trust-segmentation-primer"))
            .andExpect(jsonPath("$.content[0].highlight").value(org.hamcrest.Matchers.containsString("<mark>")));
        mvc.perform(get("/api/v1/public/articles/search").param("q", "Zero Trust"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
        mvc.perform(get("/api/v1/public/articles/search").param("q", "x")).andExpect(status().isBadRequest());
    }
}

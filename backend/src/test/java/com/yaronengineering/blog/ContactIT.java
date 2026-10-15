package com.yaronengineering.blog;

import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ContactIT extends AbstractIntegrationTest {

    private static final String BODY = """
        {"name":"Abebe Kebede","email":"abebe@example.org","organization":"Example Bank","subject":"Cybersecurity",
         "message":"We would like to discuss a firewall and SIEM deployment for our head office."}
        """;

    @Test
    void publicSubmissionLandsInAdminInboxAsUnread() throws Exception {
        mvc.perform(post("/api/v1/public/contact").contentType("application/json").content(BODY).header("X-Forwarded-For", "203.0.113.7"))
            .andExpect(status().isAccepted())
            .andExpect(jsonPath("$.status").value("RECEIVED"));

        mvc.perform(get("/api/v1/contact-messages/summary").header("Authorization", bearer(editor)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.unread", greaterThanOrEqualTo(1)));

        // unfiltered and status-only listings must work (regression: null text parameter typing on PostgreSQL)
        mvc.perform(get("/api/v1/contact-messages").header("Authorization", bearer(editor))).andExpect(status().isOk()).andExpect(jsonPath("$.content", not(empty())));
        mvc.perform(get("/api/v1/contact-messages").param("status", "NEW").header("Authorization", bearer(editor))).andExpect(status().isOk());

        String list = mvc.perform(get("/api/v1/contact-messages").param("status", "NEW").param("q", "abebe@example.org").header("Authorization", bearer(editor)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].status").value("NEW"))
            .andExpect(jsonPath("$.content[0].email").value("abebe@example.org"))
            .andReturn().getResponse().getContentAsString();
        String id = json.readTree(list).get("content").get(0).get("id").asText();

        mvc.perform(post("/api/v1/contact-messages/" + id + "/read").header("Authorization", bearer(editor)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("READ"))
            .andExpect(jsonPath("$.readAt", notNullValue()));

        mvc.perform(post("/api/v1/contact-messages/" + id + "/replied").header("Authorization", bearer(editor)))
            .andExpect(jsonPath("$.status").value("REPLIED"))
            .andExpect(jsonPath("$.repliedAt", notNullValue()));

        mvc.perform(put("/api/v1/contact-messages/" + id + "/notes").contentType("application/json").content("{\"notes\":\"Called back, proposal due Friday\"}").header("Authorization", bearer(editor)))
            .andExpect(jsonPath("$.notes").value("Called back, proposal due Friday"));

        // AUTHOR cannot see the inbox; EDITOR cannot delete; ADMIN can.
        mvc.perform(get("/api/v1/contact-messages").header("Authorization", bearer(author))).andExpect(status().isForbidden());
        mvc.perform(delete("/api/v1/contact-messages/" + id).header("Authorization", bearer(editor))).andExpect(status().isForbidden());
        mvc.perform(delete("/api/v1/contact-messages/" + id).header("Authorization", bearer(admin))).andExpect(status().isNoContent());
        mvc.perform(get("/api/v1/contact-messages/" + id).header("Authorization", bearer(admin))).andExpect(status().isNotFound());
    }

    @Test
    void publicSubmissionIsValidated() throws Exception {
        mvc.perform(post("/api/v1/public/contact").contentType("application/json").content("{\"name\":\"\",\"email\":\"nope\",\"subject\":\"\",\"message\":\"short\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        mvc.perform(get("/api/v1/contact-messages")).andExpect(status().isUnauthorized());
    }
}

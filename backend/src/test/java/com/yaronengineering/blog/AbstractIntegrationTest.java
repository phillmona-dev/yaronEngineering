package com.yaronengineering.blog;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yaronengineering.blog.auth.JwtService;
import com.yaronengineering.blog.author.Author;
import com.yaronengineering.blog.author.AuthorRepository;
import com.yaronengineering.blog.category.Category;
import com.yaronengineering.blog.category.CategoryRepository;
import com.yaronengineering.blog.media.Media;
import com.yaronengineering.blog.media.MediaRepository;
import com.yaronengineering.blog.user.Role;
import com.yaronengineering.blog.user.User;
import com.yaronengineering.blog.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    /**
     * Singleton container shared by every integration test class. It is started once and reused
     * for the whole JVM so the cached Spring context keeps a valid connection (the @Container
     * lifecycle would stop it after the first class). Ryuk removes it when the JVM exits.
     */
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    static {
        POSTGRES.start();
    }

    @Autowired protected MockMvc mvc;
    @Autowired protected ObjectMapper json;
    @Autowired protected UserRepository users;
    @Autowired protected AuthorRepository authors;
    @Autowired protected CategoryRepository categories;
    @Autowired protected MediaRepository media;
    @Autowired protected PasswordEncoder encoder;
    @Autowired protected JwtService jwt;

    protected User admin;
    protected User editor;
    protected User author;

    @BeforeEach
    void users() {
        admin = ensureUser("admin-it@test.local", Role.ADMIN);
        editor = ensureUser("editor-it@test.local", Role.EDITOR);
        author = ensureUser("author-it@test.local", Role.AUTHOR);
    }

    protected User ensureUser(String email, Role role) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(role.name() + " User");
            u.setRole(role);
            u.setPasswordHash(encoder.encode("Password123!"));
            return users.save(u);
        });
    }

    protected String bearer(User u) {
        return "Bearer " + jwt.issue(u);
    }

    protected Category anyCategory() {
        return categories.findAllByOrderBySortOrderAscNameAsc().get(0);
    }

    protected Author anyAuthor() {
        return authors.findAllByOrderByNameAsc().stream().findFirst().orElseGet(() -> {
            Author a = new Author();
            a.setName("Test Author");
            a.setSlug("test-author-" + UUID.randomUUID());
            return authors.save(a);
        });
    }

    protected Media anyMedia() {
        Media m = new Media();
        m.setUrl("/images/photos/network-patch.jpg");
        m.setAltText("alt");
        m.setMimeType("image/jpeg");
        m.setWidth(2200);
        m.setHeight(1467);
        return media.save(m);
    }

    protected String completeArticleJson(String title) throws Exception {
        return json.writeValueAsString(java.util.Map.of(
            "title", title,
            "excerpt", "An excerpt for " + title,
            "contentHtml", "<h2>Overview</h2><p>Body text for " + title + " with <script>alert(1)</script> enough words.</p><h2>Overview</h2><p>More.</p>",
            "categoryId", anyCategory().getId(),
            "authorId", anyAuthor().getId(),
            "coverImageId", anyMedia().getId(),
            "seoDescription", "SEO description",
            "tagIds", java.util.List.of()));
    }
}

package com.yaronengineering.blog.user;

import com.yaronengineering.blog.author.Author;
import com.yaronengineering.blog.author.AuthorRepository;
import com.yaronengineering.blog.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Creates the first ADMIN from env vars and the editorial-team author when the database is empty. */
@Component
@Order(1)
public class AdminBootstrap implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);
    public static final String EDITORIAL_SLUG = "yaron-engineering-editorial-team";

    private final UserRepository users;
    private final AuthorRepository authors;
    private final PasswordEncoder encoder;
    private final AppProperties props;

    public AdminBootstrap(UserRepository users, AuthorRepository authors, PasswordEncoder encoder, AppProperties props) {
        this.users = users;
        this.authors = authors;
        this.encoder = encoder;
        this.props = props;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (users.count() == 0) {
            String email = props.admin().email();
            String password = props.admin().password();
            if (email == null || email.isBlank() || password == null || password.isBlank()) {
                log.warn("No users exist and ADMIN_EMAIL/ADMIN_PASSWORD are not set — no admin account was created");
            } else {
                User u = new User();
                u.setEmail(email.toLowerCase());
                u.setName(props.admin().name() == null ? "Administrator" : props.admin().name());
                u.setRole(Role.ADMIN);
                u.setPasswordHash(encoder.encode(password));
                users.save(u);
                log.info("Bootstrapped ADMIN user {}", u.getEmail());
            }
        }
        if (!authors.existsBySlug(EDITORIAL_SLUG)) {
            Author a = new Author();
            a.setName("Yaron Engineering Editorial Team");
            a.setSlug(EDITORIAL_SLUG);
            a.setPosition("Editorial");
            a.setBio("Insights from the engineers and consultants of Yaron Engineering PLC on infrastructure, cybersecurity, cloud and enterprise technology.");
            authors.save(a);
            log.info("Created editorial team author");
        }
    }
}

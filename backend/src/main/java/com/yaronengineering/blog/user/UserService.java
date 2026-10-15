package com.yaronengineering.blog.user;

import com.yaronengineering.blog.author.AuthorRepository;
import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository users;
    private final AuthorRepository authors;
    private final PasswordEncoder encoder;

    public UserService(UserRepository users, AuthorRepository authors, PasswordEncoder encoder) {
        this.users = users;
        this.authors = authors;
        this.encoder = encoder;
    }

    @Transactional(readOnly = true)
    public List<UserDto> list() {
        return users.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public UserDto create(UserRequest req) {
        if (req.password() == null || req.password().isBlank()) {
            throw ApiException.validation("Password is required", List.of(new ErrorResponse.FieldError("password", "must not be blank")));
        }
        if (users.existsByEmailIgnoreCase(req.email())) throw ApiException.conflict("A user with this email already exists");
        User u = new User();
        u.setEmail(req.email().toLowerCase());
        u.setName(req.name());
        u.setRole(req.role());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setEnabled(req.enabled() == null || req.enabled());
        u = users.save(u);
        log.info("admin: user created email={} role={}", u.getEmail(), u.getRole());
        return toDto(u);
    }

    @Transactional
    public UserDto update(UUID id, UserRequest req) {
        User u = users.findById(id).orElseThrow(() -> ApiException.notFound("User"));
        if (!u.getEmail().equalsIgnoreCase(req.email()) && users.existsByEmailIgnoreCase(req.email())) {
            throw ApiException.conflict("A user with this email already exists");
        }
        u.setEmail(req.email().toLowerCase());
        u.setName(req.name());
        u.setRole(req.role());
        if (req.enabled() != null) u.setEnabled(req.enabled());
        if (req.password() != null && !req.password().isBlank()) u.setPasswordHash(encoder.encode(req.password()));
        log.info("admin: user updated id={} role={}", u.getId(), u.getRole());
        return toDto(u);
    }

    public UserDto toDto(User u) {
        String slug = authors.findByUserId(u.getId()).map(a -> a.getSlug()).orElse(null);
        return UserDto.from(u, slug);
    }
}

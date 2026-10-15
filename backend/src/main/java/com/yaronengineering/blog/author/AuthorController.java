package com.yaronengineering.blog.author;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/authors")
public class AuthorController {
    private final AuthorService service;

    public AuthorController(AuthorService service) {
        this.service = service;
    }

    @GetMapping
    public List<AuthorDtos.AuthorDto> list() {
        return service.list(false);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public AuthorDtos.AuthorDto create(@Valid @RequestBody AuthorDtos.AuthorRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public AuthorDtos.AuthorDto update(@PathVariable UUID id, @Valid @RequestBody AuthorDtos.AuthorRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

package com.yaronengineering.blog.author;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/authors")
public class PublicAuthorController {
    private final AuthorService service;

    public PublicAuthorController(AuthorService service) {
        this.service = service;
    }

    @GetMapping
    public List<AuthorDtos.AuthorDto> list() {
        return service.list(true);
    }

    @GetMapping("/{slug}")
    public AuthorDtos.AuthorDto get(@PathVariable String slug) {
        return service.get(slug);
    }
}

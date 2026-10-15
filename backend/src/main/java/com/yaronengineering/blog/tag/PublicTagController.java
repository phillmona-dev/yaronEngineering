package com.yaronengineering.blog.tag;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/tags")
public class PublicTagController {
    private final TagService service;

    public PublicTagController(TagService service) {
        this.service = service;
    }

    @GetMapping
    public List<TagDtos.TagDto> list() {
        return service.list(true);
    }

    @GetMapping("/{slug}")
    public TagDtos.TagDto get(@PathVariable String slug) {
        return service.get(slug);
    }
}

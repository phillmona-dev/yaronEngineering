package com.yaronengineering.blog.category;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/categories")
public class PublicCategoryController {
    private final CategoryService service;

    public PublicCategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategoryDtos.CategoryDto> list(@RequestParam(defaultValue = "false") boolean all) {
        return service.list(!all);
    }

    @GetMapping("/{slug}")
    public CategoryDtos.CategoryDetail get(@PathVariable String slug) {
        return service.getPublic(slug);
    }
}

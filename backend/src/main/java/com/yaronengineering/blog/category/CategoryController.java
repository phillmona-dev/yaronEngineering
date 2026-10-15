package com.yaronengineering.blog.category;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategoryDtos.CategoryDto> list() {
        return service.list(false);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public CategoryDtos.CategoryDto create(@Valid @RequestBody CategoryDtos.CategoryRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public CategoryDtos.CategoryDto update(@PathVariable UUID id, @Valid @RequestBody CategoryDtos.CategoryRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

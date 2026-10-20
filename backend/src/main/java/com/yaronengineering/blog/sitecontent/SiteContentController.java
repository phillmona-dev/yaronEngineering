package com.yaronengineering.blog.sitecontent;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Admin API for the editable website sections. Reading is open to all staff; writing is admin-only. */
@RestController
@RequestMapping("/api/v1/site-content")
public class SiteContentController {
    private final SiteContentService service;

    public SiteContentController(SiteContentService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR','AUTHOR')")
    public List<SiteContentDto> list() {
        return service.list();
    }

    @GetMapping("/{section}")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR','AUTHOR')")
    public SiteContentDto get(@PathVariable String section) {
        return service.get(section);
    }

    @PutMapping("/{section}")
    @PreAuthorize("hasRole('ADMIN')")
    public SiteContentDto put(@PathVariable String section, @RequestBody JsonNode data) {
        return service.put(section, data);
    }

    @DeleteMapping("/{section}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void reset(@PathVariable String section) {
        service.reset(section);
    }
}

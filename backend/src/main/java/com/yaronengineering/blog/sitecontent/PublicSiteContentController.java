package com.yaronengineering.blog.sitecontent;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Read by the Next.js server when rendering pages: { section: json, ... } for customised sections only. */
@RestController
@RequestMapping("/api/v1/public/site-content")
public class PublicSiteContentController {
    private final SiteContentService service;

    public PublicSiteContentController(SiteContentService service) {
        this.service = service;
    }

    @GetMapping
    public Map<String, JsonNode> all() {
        return service.publicMap();
    }
}

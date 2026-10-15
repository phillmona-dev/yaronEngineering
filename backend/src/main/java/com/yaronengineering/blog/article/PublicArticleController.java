package com.yaronengineering.blog.article;

import com.yaronengineering.blog.analytics.ViewService;
import com.yaronengineering.blog.common.PageResponse;
import com.yaronengineering.blog.search.SearchService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/articles")
public class PublicArticleController {
    private final ArticleService service;
    private final SearchService search;
    private final ViewService views;

    public PublicArticleController(ArticleService service, SearchService search, ViewService views) {
        this.service = service;
        this.search = search;
        this.views = views;
    }

    @GetMapping
    public PageResponse<ArticleDtos.ArticleSummary> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size,
                                                         @RequestParam(required = false) String category, @RequestParam(required = false) String tag,
                                                         @RequestParam(required = false) String author, @RequestParam(required = false) Boolean featured,
                                                         @RequestParam(required = false) String sort) {
        return service.listPublished(page, size, category, tag, author, featured, sort);
    }

    @GetMapping("/featured")
    public List<ArticleDtos.ArticleSummary> featured(@RequestParam(defaultValue = "1") int limit) {
        return service.featured(limit);
    }

    @GetMapping("/search")
    public PageResponse<ArticleDtos.ArticleSummary> search(@RequestParam String q, @RequestParam(required = false) Integer page,
                                                           @RequestParam(required = false) Integer size) {
        return search.search(q, page, size);
    }

    @GetMapping("/{slug}")
    public ArticleDtos.ArticleDetail get(@PathVariable String slug) {
        return service.getPublished(slug);
    }

    @GetMapping("/{slug}/related")
    public List<ArticleDtos.ArticleSummary> related(@PathVariable String slug, @RequestParam(defaultValue = "3") int limit) {
        return service.relatedPublished(slug, limit);
    }

    @PostMapping("/{slug}/view")
    public ResponseEntity<Void> view(@PathVariable String slug, HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        String ip = fwd != null && !fwd.isBlank() ? fwd.split(",")[0].trim() : req.getRemoteAddr();
        views.record(slug, ip, req.getHeader("User-Agent"));
        return ResponseEntity.noContent().build();
    }
}

package com.yaronengineering.blog.article;

import com.yaronengineering.blog.auth.CurrentUser;
import com.yaronengineering.blog.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/articles")
@PreAuthorize("hasAnyRole('ADMIN','EDITOR','AUTHOR')")
public class ArticleController {
    private final ArticleService service;

    public ArticleController(ArticleService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<ArticleDtos.ArticleSummary> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size,
                                                         @RequestParam(required = false) ArticleStatus status, @RequestParam(required = false) String category,
                                                         @RequestParam(required = false) String author, @RequestParam(required = false) String q,
                                                         @RequestParam(required = false) Boolean featured, @RequestParam(required = false) String sort) {
        return service.listAdmin(CurrentUser.require(), page, size, status, category, author, q, featured, sort);
    }

    @GetMapping("/{id}")
    public ArticleDtos.ArticleDetail get(@PathVariable UUID id) {
        return service.getAdmin(CurrentUser.require(), id);
    }

    @GetMapping("/{id}/preview")
    public ArticleDtos.ArticleDetail preview(@PathVariable UUID id) {
        return service.getAdmin(CurrentUser.require(), id);
    }

    @PostMapping
    public ResponseEntity<ArticleDtos.ArticleDetail> create(@Valid @RequestBody ArticleDtos.ArticleRequest req) {
        ArticleDtos.ArticleDetail created = service.create(CurrentUser.require(), req);
        return ResponseEntity.created(URI.create("/api/v1/articles/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public ArticleDtos.ArticleDetail update(@PathVariable UUID id, @Valid @RequestBody ArticleDtos.ArticleRequest req) {
        return service.update(CurrentUser.require(), id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id, CurrentUser.require());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ArticleDtos.ArticleDetail publish(@PathVariable UUID id) {
        return service.publish(CurrentUser.require(), id);
    }

    @PostMapping("/{id}/unpublish")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ArticleDtos.ArticleDetail unpublish(@PathVariable UUID id) {
        return service.unpublish(CurrentUser.require(), id);
    }

    @PostMapping("/{id}/schedule")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ArticleDtos.ArticleDetail schedule(@PathVariable UUID id, @Valid @RequestBody ArticleDtos.ScheduleRequest req) {
        return service.schedule(CurrentUser.require(), id, req.scheduledAt());
    }

    @PostMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ArticleDtos.ArticleDetail archive(@PathVariable UUID id) {
        return service.archive(CurrentUser.require(), id);
    }

    @PostMapping("/{id}/unarchive")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ArticleDtos.ArticleDetail unarchive(@PathVariable UUID id) {
        return service.unarchive(CurrentUser.require(), id);
    }

    @PostMapping("/{id}/feature")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ArticleDtos.ArticleDetail feature(@PathVariable UUID id, @Valid @RequestBody ArticleDtos.FeatureRequest req) {
        return service.feature(CurrentUser.require(), id, req.featured());
    }

    @GetMapping("/{id}/revisions")
    public List<ArticleDtos.RevisionSummary> revisions(@PathVariable UUID id) {
        return service.revisions(CurrentUser.require(), id);
    }

    @GetMapping("/{id}/revisions/{revisionId}")
    public ArticleDtos.RevisionDetail revision(@PathVariable UUID id, @PathVariable UUID revisionId) {
        return service.revision(CurrentUser.require(), id, revisionId);
    }

    @PostMapping("/{id}/revisions/{revisionId}/restore")
    public ArticleDtos.ArticleDetail restore(@PathVariable UUID id, @PathVariable UUID revisionId) {
        return service.restore(CurrentUser.require(), id, revisionId);
    }
}

package com.yaronengineering.blog.article;

import com.yaronengineering.blog.author.AuthorRepository;
import com.yaronengineering.blog.category.CategoryRepository;
import com.yaronengineering.blog.tag.TagRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/sitemap")
public class PublicSitemapController {
    public record ArticleEntry(String slug, Instant updatedAt) {}
    public record SlugEntry(String slug) {}
    public record Sitemap(List<ArticleEntry> articles, List<SlugEntry> categories, List<SlugEntry> tags, List<SlugEntry> authors) {}

    private final ArticleRepository articles;
    private final CategoryRepository categories;
    private final TagRepository tags;
    private final AuthorRepository authors;

    public PublicSitemapController(ArticleRepository articles, CategoryRepository categories, TagRepository tags, AuthorRepository authors) {
        this.articles = articles;
        this.categories = categories;
        this.tags = tags;
        this.authors = authors;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public Sitemap sitemap() {
        List<Article> published = articles.findByStatusOrderByPublishedAtDesc(ArticleStatus.PUBLISHED);
        Set<UUID> catIds = new HashSet<>();
        Set<UUID> tagIds = new HashSet<>();
        Set<UUID> authorIds = new HashSet<>();
        published.forEach(a -> {
            if (a.getCategory() != null) catIds.add(a.getCategory().getId());
            if (a.getAuthor() != null) authorIds.add(a.getAuthor().getId());
            a.getTags().forEach(t -> tagIds.add(t.getId()));
        });
        return new Sitemap(
            published.stream().map(a -> new ArticleEntry(a.getSlug(), a.getUpdatedAt())).toList(),
            categories.findAll().stream().filter(c -> catIds.contains(c.getId())).map(c -> new SlugEntry(c.getSlug())).toList(),
            tags.findAll().stream().filter(t -> tagIds.contains(t.getId())).map(t -> new SlugEntry(t.getSlug())).toList(),
            authors.findAll().stream().filter(a -> authorIds.contains(a.getId())).map(a -> new SlugEntry(a.getSlug())).toList());
    }
}

package com.yaronengineering.blog.article;

import com.yaronengineering.blog.author.AuthorDtos;
import com.yaronengineering.blog.category.CategoryDtos;
import com.yaronengineering.blog.common.HtmlProcessor;
import com.yaronengineering.blog.media.MediaDto;
import com.yaronengineering.blog.tag.TagDtos;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ArticleMapper {
    private final HtmlProcessor html;

    public ArticleMapper(HtmlProcessor html) {
        this.html = html;
    }

    public ArticleDtos.ArticleSummary summary(Article a) {
        return new ArticleDtos.ArticleSummary(a.getId(), a.getSlug(), a.getTitle(), a.getExcerpt(), MediaDto.from(a.getCoverImage()),
            CategoryDtos.CategoryRef.from(a.getCategory()), a.getTags().stream().map(TagDtos.TagRef::from).toList(),
            AuthorDtos.AuthorRef.from(a.getAuthor()), a.getStatus(), a.isFeatured(), a.getReadingTimeMinutes(), a.getViewCount(),
            a.getPublishedAt(), a.getScheduledAt(), a.getCreatedAt(), a.getUpdatedAt(), null);
    }

    public ArticleDtos.ArticleDetail detail(Article a, List<ArticleDtos.ArticleSummary> related) {
        ArticleDtos.ArticleSummary s = summary(a);
        // toc is derived from the stored (already sanitized) html so ids match exactly what is rendered.
        List<HtmlProcessor.TocEntry> toc = html.process(a.getContentHtml()).toc();
        ArticleDtos.Seo seo = new ArticleDtos.Seo(
            a.getSeoTitle() == null || a.getSeoTitle().isBlank() ? a.getTitle() : a.getSeoTitle(),
            a.getSeoDescription() == null || a.getSeoDescription().isBlank() ? a.getExcerpt() : a.getSeoDescription(),
            a.getCanonicalUrl(), MediaDto.from(a.getOgImage() != null ? a.getOgImage() : a.getCoverImage()), a.isNoIndex());
        return new ArticleDtos.ArticleDetail(s.id(), s.slug(), s.title(), s.excerpt(), s.coverImage(), s.category(), s.tags(), s.author(),
            s.status(), s.featured(), s.readingTimeMinutes(), s.viewCount(), s.publishedAt(), s.scheduledAt(), s.createdAt(), s.updatedAt(),
            a.getContentHtml(), a.getContentJson(), toc, seo, related);
    }

    public ArticleDtos.RevisionSummary revisionSummary(ArticleRevision r) {
        return new ArticleDtos.RevisionSummary(r.getId(), r.getVersion(), r.getTitle(), r.getCreatedAt(), r.getCreatedBy());
    }

    public ArticleDtos.RevisionDetail revisionDetail(ArticleRevision r) {
        return new ArticleDtos.RevisionDetail(r.getId(), r.getVersion(), r.getTitle(), r.getSlug(), r.getExcerpt(), r.getContentHtml(),
            r.getContentJson(), r.getSeoTitle(), r.getSeoDescription(), r.getCreatedAt(), r.getCreatedBy());
    }
}

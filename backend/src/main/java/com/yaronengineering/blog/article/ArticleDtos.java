package com.yaronengineering.blog.article;

import com.yaronengineering.blog.author.AuthorDtos;
import com.yaronengineering.blog.category.CategoryDtos;
import com.yaronengineering.blog.common.HtmlProcessor;
import com.yaronengineering.blog.media.MediaDto;
import com.yaronengineering.blog.tag.TagDtos;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class ArticleDtos {
    private ArticleDtos() {}

    public record ArticleRequest(
        @NotBlank @Size(max = 240) String title,
        @Size(max = 260) String slug,
        @Size(max = 2000) String excerpt,
        String contentHtml,
        Map<String, Object> contentJson,
        UUID coverImageId,
        UUID categoryId,
        List<UUID> tagIds,
        UUID authorId,
        Boolean featured,
        @Size(max = 240) String seoTitle,
        @Size(max = 400) String seoDescription,
        @Size(max = 600) String canonicalUrl,
        UUID ogImageId,
        Boolean noIndex
    ) {}

    public record ScheduleRequest(@NotNull @Future Instant scheduledAt) {}

    public record FeatureRequest(@NotNull Boolean featured) {}

    public record Seo(String title, String description, String canonicalUrl, MediaDto ogImage, boolean noIndex) {}

    public record ArticleSummary(UUID id, String slug, String title, String excerpt, MediaDto coverImage, CategoryDtos.CategoryRef category,
                                 List<TagDtos.TagRef> tags, AuthorDtos.AuthorRef author, ArticleStatus status, boolean featured,
                                 int readingTimeMinutes, long viewCount, Instant publishedAt, Instant scheduledAt, Instant createdAt,
                                 Instant updatedAt, String highlight) {
        public ArticleSummary withHighlight(String h) {
            return new ArticleSummary(id, slug, title, excerpt, coverImage, category, tags, author, status, featured, readingTimeMinutes,
                viewCount, publishedAt, scheduledAt, createdAt, updatedAt, h);
        }
    }

    public record ArticleDetail(UUID id, String slug, String title, String excerpt, MediaDto coverImage, CategoryDtos.CategoryRef category,
                                List<TagDtos.TagRef> tags, AuthorDtos.AuthorRef author, ArticleStatus status, boolean featured,
                                int readingTimeMinutes, long viewCount, Instant publishedAt, Instant scheduledAt, Instant createdAt,
                                Instant updatedAt, String contentHtml, Map<String, Object> contentJson, List<HtmlProcessor.TocEntry> toc,
                                Seo seo, List<ArticleSummary> related) {}

    public record RevisionSummary(UUID id, int version, String title, Instant createdAt, String createdBy) {}

    public record RevisionDetail(UUID id, int version, String title, String slug, String excerpt, String contentHtml,
                                 Map<String, Object> contentJson, String seoTitle, String seoDescription, Instant createdAt, String createdBy) {}
}

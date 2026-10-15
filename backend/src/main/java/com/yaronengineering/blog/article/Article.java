package com.yaronengineering.blog.article;

import com.yaronengineering.blog.author.Author;
import com.yaronengineering.blog.category.Category;
import com.yaronengineering.blog.media.Media;
import com.yaronengineering.blog.tag.Tag;
import com.yaronengineering.blog.user.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false) private String title;
    @Column(nullable = false, unique = true) private String slug;
    private String excerpt;
    @Column(name = "content_html") private String contentHtml;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "content_json") private Map<String, Object> contentJson;
    @Column(name = "content_text") private String contentText;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cover_image_id") private Media coverImage;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_id") private Category category;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "author_id") private Author author;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by") private User createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "article_tags", joinColumns = @JoinColumn(name = "article_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING) @Column(nullable = false) private ArticleStatus status = ArticleStatus.DRAFT;
    @Column(nullable = false) private boolean featured;
    @Column(name = "reading_time_minutes", nullable = false) private int readingTimeMinutes = 1;
    @Column(name = "view_count", nullable = false) private long viewCount;

    @Column(name = "seo_title") private String seoTitle;
    @Column(name = "seo_description") private String seoDescription;
    @Column(name = "canonical_url") private String canonicalUrl;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "og_image_id") private Media ogImage;
    @Column(name = "no_index", nullable = false) private boolean noIndex;

    @Column(name = "published_at") private Instant publishedAt;
    @Column(name = "scheduled_at") private Instant scheduledAt;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
    public String getContentHtml() { return contentHtml; }
    public void setContentHtml(String contentHtml) { this.contentHtml = contentHtml; }
    public Map<String, Object> getContentJson() { return contentJson; }
    public void setContentJson(Map<String, Object> contentJson) { this.contentJson = contentJson; }
    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }
    public Media getCoverImage() { return coverImage; }
    public void setCoverImage(Media coverImage) { this.coverImage = coverImage; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { this.author = author; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) { this.tags = tags; }
    public ArticleStatus getStatus() { return status; }
    public void setStatus(ArticleStatus status) { this.status = status; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public int getReadingTimeMinutes() { return readingTimeMinutes; }
    public void setReadingTimeMinutes(int readingTimeMinutes) { this.readingTimeMinutes = readingTimeMinutes; }
    public long getViewCount() { return viewCount; }
    public void setViewCount(long viewCount) { this.viewCount = viewCount; }
    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }
    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
    public String getCanonicalUrl() { return canonicalUrl; }
    public void setCanonicalUrl(String canonicalUrl) { this.canonicalUrl = canonicalUrl; }
    public Media getOgImage() { return ogImage; }
    public void setOgImage(Media ogImage) { this.ogImage = ogImage; }
    public boolean isNoIndex() { return noIndex; }
    public void setNoIndex(boolean noIndex) { this.noIndex = noIndex; }
    public Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Instant publishedAt) { this.publishedAt = publishedAt; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

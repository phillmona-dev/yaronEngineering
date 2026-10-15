package com.yaronengineering.blog.article;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "article_revisions")
public class ArticleRevision {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "article_id", nullable = false) private UUID articleId;
    @Column(nullable = false) private int version;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String slug;
    private String excerpt;
    @Column(name = "content_html") private String contentHtml;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "content_json") private Map<String, Object> contentJson;
    @Column(name = "seo_title") private String seoTitle;
    @Column(name = "seo_description") private String seoDescription;
    @Column(name = "created_by") private String createdBy;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;

    public static ArticleRevision snapshot(Article a, int version, String createdBy) {
        ArticleRevision r = new ArticleRevision();
        r.articleId = a.getId();
        r.version = version;
        r.title = a.getTitle();
        r.slug = a.getSlug();
        r.excerpt = a.getExcerpt();
        r.contentHtml = a.getContentHtml();
        r.contentJson = a.getContentJson();
        r.seoTitle = a.getSeoTitle();
        r.seoDescription = a.getSeoDescription();
        r.createdBy = createdBy;
        return r;
    }

    public UUID getId() { return id; }
    public UUID getArticleId() { return articleId; }
    public int getVersion() { return version; }
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public String getExcerpt() { return excerpt; }
    public String getContentHtml() { return contentHtml; }
    public Map<String, Object> getContentJson() { return contentJson; }
    public String getSeoTitle() { return seoTitle; }
    public String getSeoDescription() { return seoDescription; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
}

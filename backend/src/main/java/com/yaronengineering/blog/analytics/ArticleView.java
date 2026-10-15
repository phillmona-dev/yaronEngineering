package com.yaronengineering.blog.analytics;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "article_views")
public class ArticleView {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "article_id", nullable = false) private UUID articleId;
    @Column(name = "visitor_hash", nullable = false) private String visitorHash;
    @Column(name = "view_date", nullable = false) private LocalDate viewDate;
    @CreationTimestamp @Column(name = "viewed_at", updatable = false) private Instant viewedAt;

    public static ArticleView of(UUID articleId, String hash, LocalDate date) {
        ArticleView v = new ArticleView();
        v.articleId = articleId;
        v.visitorHash = hash;
        v.viewDate = date;
        return v;
    }
}

package com.yaronengineering.blog.article;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "article_activity")
public class ArticleActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "article_id") private UUID articleId;
    @Column(name = "article_title") private String articleTitle;
    @Column(nullable = false) private String action;
    private String actor;
    @CreationTimestamp @Column(updatable = false) private Instant at;

    public static ArticleActivity of(Article a, String action, String actor) {
        ArticleActivity x = new ArticleActivity();
        x.articleId = a.getId();
        x.articleTitle = a.getTitle();
        x.action = action;
        x.actor = actor;
        return x;
    }

    public UUID getArticleId() { return articleId; }
    public String getArticleTitle() { return articleTitle; }
    public String getAction() { return action; }
    public String getActor() { return actor; }
    public Instant getAt() { return at; }
}

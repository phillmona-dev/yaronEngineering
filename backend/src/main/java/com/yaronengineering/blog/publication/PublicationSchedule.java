package com.yaronengineering.blog.publication;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "publication_schedule")
public class PublicationSchedule {
    public enum Status { PENDING, PUBLISHED, CANCELLED }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "article_id", nullable = false) private UUID articleId;
    @Column(name = "scheduled_at", nullable = false) private Instant scheduledAt;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Status status = Status.PENDING;
    @Column(name = "created_by") private UUID createdBy;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @Column(name = "executed_at") private Instant executedAt;

    public static PublicationSchedule pending(UUID articleId, Instant at, UUID by) {
        PublicationSchedule s = new PublicationSchedule();
        s.articleId = articleId;
        s.scheduledAt = at;
        s.createdBy = by;
        return s;
    }

    public UUID getId() { return id; }
    public UUID getArticleId() { return articleId; }
    public Instant getScheduledAt() { return scheduledAt; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public void setExecutedAt(Instant executedAt) { this.executedAt = executedAt; }
}

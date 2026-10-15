package com.yaronengineering.blog.newsletter;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "newsletter_subscribers")
public class NewsletterSubscriber {
    public enum Status { PENDING, CONFIRMED, UNSUBSCRIBED }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true) private String email;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Status status = Status.PENDING;
    private String source;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}

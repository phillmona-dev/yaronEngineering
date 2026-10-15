package com.yaronengineering.blog.author;

import com.yaronengineering.blog.media.Media;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "authors")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String slug;
    private String position;
    private String bio;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "avatar_id") private Media avatar;
    @Column(name = "linkedin_url") private String linkedinUrl;
    @Column(name = "user_id") private UUID userId;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Media getAvatar() { return avatar; }
    public void setAvatar(Media avatar) { this.avatar = avatar; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}

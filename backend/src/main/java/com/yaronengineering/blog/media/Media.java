package com.yaronengineering.blog.media;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "media")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "storage_key") private String storageKey;
    @Column(nullable = false) private String url;
    @Column(name = "alt_text", nullable = false) private String altText;
    private Integer width;
    private Integer height;
    @Column(name = "mime_type", nullable = false) private String mimeType;
    @Column(name = "size_bytes", nullable = false) private long sizeBytes;
    @Column(name = "original_filename") private String originalFilename;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;

    public UUID getId() { return id; }
    public String getStorageKey() { return storageKey; }
    public void setStorageKey(String storageKey) { this.storageKey = storageKey; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }
    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }
    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }
    public Instant getCreatedAt() { return createdAt; }
}

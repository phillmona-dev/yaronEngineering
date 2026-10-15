package com.yaronengineering.blog.contact;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/** A message submitted through the public contact form. */
@Entity
@Table(name = "contact_messages")
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, length = 120) private String name;
    @Column(nullable = false, length = 200) private String email;
    @Column(length = 160) private String organization;
    @Column(nullable = false, length = 120) private String subject;
    @Column(nullable = false, columnDefinition = "text") private String message;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private ContactStatus status = ContactStatus.NEW;
    @Column(name = "ip_hash", length = 64) private String ipHash;
    @Column(name = "user_agent", length = 300) private String userAgent;
    @Column(length = 60) private String source;
    @Column(columnDefinition = "text") private String notes;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private Instant updatedAt;
    @Column(name = "read_at") private Instant readAt;
    @Column(name = "replied_at") private Instant repliedAt;

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public ContactStatus getStatus() { return status; }
    public void setStatus(ContactStatus status) { this.status = status; }
    public String getIpHash() { return ipHash; }
    public void setIpHash(String ipHash) { this.ipHash = ipHash; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getReadAt() { return readAt; }
    public void setReadAt(Instant readAt) { this.readAt = readAt; }
    public Instant getRepliedAt() { return repliedAt; }
    public void setRepliedAt(Instant repliedAt) { this.repliedAt = repliedAt; }
}

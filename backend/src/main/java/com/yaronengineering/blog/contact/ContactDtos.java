package com.yaronengineering.blog.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public final class ContactDtos {
    private ContactDtos() {}

    public record SubmitRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 200) String email,
        @Size(max = 160) String organization,
        @NotBlank @Size(max = 120) String subject,
        @NotBlank @Size(min = 20, max = 4000) String message,
        @Size(max = 60) String source) {}

    public record MessageDto(UUID id, String name, String email, String organization, String subject, String message,
                             ContactStatus status, String notes, Instant createdAt, Instant updatedAt, Instant readAt, Instant repliedAt) {}

    public record Summary(long unread, long total, long last24h, long replied, long archived) {}

    public record NotesRequest(@Size(max = 4000) String notes) {}

    static MessageDto toDto(ContactMessage m) {
        return new MessageDto(m.getId(), m.getName(), m.getEmail(), m.getOrganization(), m.getSubject(), m.getMessage(),
            m.getStatus(), m.getNotes(), m.getCreatedAt(), m.getUpdatedAt(), m.getReadAt(), m.getRepliedAt());
    }
}

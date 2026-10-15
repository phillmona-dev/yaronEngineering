package com.yaronengineering.blog.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID>, JpaSpecificationExecutor<ContactMessage> {
    long countByStatus(ContactStatus status);
    long countByCreatedAtAfter(Instant since);
    List<ContactMessage> findTop5ByOrderByCreatedAtDesc();
}

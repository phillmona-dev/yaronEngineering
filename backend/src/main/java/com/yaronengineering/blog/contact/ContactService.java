package com.yaronengineering.blog.contact;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.PageResponse;
import com.yaronengineering.blog.common.Paging;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class ContactService {
    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private final ContactMessageRepository messages;
    private final Clock clock;

    public ContactService(ContactMessageRepository messages, Clock clock) {
        this.messages = messages;
        this.clock = clock;
    }

    @Transactional
    public ContactDtos.MessageDto submit(ContactDtos.SubmitRequest req, String ip, String userAgent) {
        ContactMessage m = new ContactMessage();
        m.setName(req.name().trim());
        m.setEmail(req.email().trim().toLowerCase());
        m.setOrganization(blankToNull(req.organization()));
        m.setSubject(req.subject().trim());
        m.setMessage(req.message().trim());
        m.setSource(req.source() == null ? "website" : req.source());
        m.setIpHash(hash(ip));
        m.setUserAgent(userAgent == null ? null : userAgent.substring(0, Math.min(300, userAgent.length())));
        m = messages.save(m);
        log.info("contact: new message id={} subject=\"{}\"", m.getId(), m.getSubject());
        return ContactDtos.toDto(m);
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactDtos.MessageDto> list(ContactStatus status, String q, Integer page, Integer size) {
        Specification<ContactMessage> spec = Specification.where(null);
        if (status != null) spec = spec.and((root, cq, cb) -> cb.equal(root.get("status"), status));
        if (q != null && !q.isBlank()) {
            String pattern = "%" + q.trim().toLowerCase() + "%";
            spec = spec.and((root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("email")), pattern),
                cb.like(cb.lower(root.get("subject")), pattern),
                cb.like(cb.lower(cb.coalesce(root.get("organization"), "")), pattern),
                cb.like(cb.lower(root.get("message")), pattern)));
        }
        return PageResponse.from(messages.findAll(spec, Paging.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))), ContactDtos::toDto);
    }

    @Transactional(readOnly = true)
    public ContactDtos.MessageDto get(UUID id) {
        return ContactDtos.toDto(find(id));
    }

    @Transactional(readOnly = true)
    public ContactDtos.Summary summary() {
        return new ContactDtos.Summary(
            messages.countByStatus(ContactStatus.NEW),
            messages.count(),
            messages.countByCreatedAtAfter(Instant.now(clock).minus(Duration.ofHours(24))),
            messages.countByStatus(ContactStatus.REPLIED),
            messages.countByStatus(ContactStatus.ARCHIVED));
    }

    @Transactional
    public ContactDtos.MessageDto markRead(UUID id) {
        ContactMessage m = find(id);
        if (m.getStatus() == ContactStatus.NEW) {
            m.setStatus(ContactStatus.READ);
            m.setReadAt(Instant.now(clock));
        }
        return ContactDtos.toDto(m);
    }

    @Transactional
    public ContactDtos.MessageDto markUnread(UUID id) {
        ContactMessage m = find(id);
        m.setStatus(ContactStatus.NEW);
        m.setReadAt(null);
        return ContactDtos.toDto(m);
    }

    @Transactional
    public ContactDtos.MessageDto markReplied(UUID id) {
        ContactMessage m = find(id);
        m.setStatus(ContactStatus.REPLIED);
        if (m.getReadAt() == null) m.setReadAt(Instant.now(clock));
        m.setRepliedAt(Instant.now(clock));
        return ContactDtos.toDto(m);
    }

    @Transactional
    public ContactDtos.MessageDto archive(UUID id) {
        ContactMessage m = find(id);
        m.setStatus(ContactStatus.ARCHIVED);
        if (m.getReadAt() == null) m.setReadAt(Instant.now(clock));
        return ContactDtos.toDto(m);
    }

    @Transactional
    public ContactDtos.MessageDto notes(UUID id, String notes) {
        ContactMessage m = find(id);
        m.setNotes(blankToNull(notes));
        return ContactDtos.toDto(m);
    }

    @Transactional
    public void delete(UUID id) {
        messages.delete(find(id));
        log.info("contact: message deleted id={}", id);
    }

    private ContactMessage find(UUID id) {
        return messages.findById(id).orElseThrow(() -> ApiException.notFound("Message"));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private static String hash(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d);
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }
}

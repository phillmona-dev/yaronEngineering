package com.yaronengineering.blog.contact;

import com.yaronengineering.blog.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/** Admin inbox for contact-form messages. EDITOR and ADMIN may review; only ADMIN may delete. */
@RestController
@RequestMapping("/api/v1/contact-messages")
@PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
public class ContactController {
    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<ContactDtos.MessageDto> list(@RequestParam(required = false) ContactStatus status,
                                                     @RequestParam(required = false) String q,
                                                     @RequestParam(required = false) Integer page,
                                                     @RequestParam(required = false) Integer size) {
        return service.list(status, q, page, size);
    }

    @GetMapping("/summary")
    public ContactDtos.Summary summary() {
        return service.summary();
    }

    @GetMapping("/{id}")
    public ContactDtos.MessageDto get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PostMapping("/{id}/read")
    public ContactDtos.MessageDto read(@PathVariable UUID id) { return service.markRead(id); }

    @PostMapping("/{id}/unread")
    public ContactDtos.MessageDto unread(@PathVariable UUID id) { return service.markUnread(id); }

    @PostMapping("/{id}/replied")
    public ContactDtos.MessageDto replied(@PathVariable UUID id) { return service.markReplied(id); }

    @PostMapping("/{id}/archive")
    public ContactDtos.MessageDto archive(@PathVariable UUID id) { return service.archive(id); }

    @PutMapping("/{id}/notes")
    public ContactDtos.MessageDto notes(@PathVariable UUID id, @Valid @RequestBody ContactDtos.NotesRequest req) {
        return service.notes(id, req.notes());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

package com.yaronengineering.blog.newsletter;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/newsletter")
public class PublicNewsletterController {
    public record SubscribeRequest(@NotBlank @Email @Size(max = 200) String email, @Size(max = 120) String source) {}

    private final NewsletterService service;

    public PublicNewsletterController(NewsletterService service) {
        this.service = service;
    }

    @PostMapping("/subscribe")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, String> subscribe(@Valid @RequestBody SubscribeRequest req) {
        return Map.of("status", service.subscribe(req.email(), req.source() == null ? "website" : req.source()).name());
    }
}

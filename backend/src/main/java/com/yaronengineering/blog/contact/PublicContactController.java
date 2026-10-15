package com.yaronengineering.blog.contact;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public/contact")
public class PublicContactController {
    private final ContactService service;
    private final ContactRateLimiter limiter;

    public PublicContactController(ContactService service, ContactRateLimiter limiter) {
        this.service = service;
        this.limiter = limiter;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, String> submit(@Valid @RequestBody ContactDtos.SubmitRequest req, HttpServletRequest http) {
        String ip = clientIp(http);
        if (!limiter.allow(ip)) throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, ErrorCode.RATE_LIMITED, "Too many messages. Please try again later.");
        ContactDtos.MessageDto saved = service.submit(req, ip, http.getHeader("User-Agent"));
        return Map.of("status", "RECEIVED", "id", saved.id().toString());
    }

    private static String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}

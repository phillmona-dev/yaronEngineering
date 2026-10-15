package com.yaronengineering.blog.newsletter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsletterService {
    private final NewsletterSubscriberRepository subscribers;
    private final NewsletterProvider provider;

    public NewsletterService(NewsletterSubscriberRepository subscribers, NewsletterProvider provider) {
        this.subscribers = subscribers;
        this.provider = provider;
    }

    @Transactional
    public NewsletterSubscriber.Status subscribe(String email, String source) {
        String normalized = email.trim().toLowerCase();
        NewsletterSubscriber s = subscribers.findByEmailIgnoreCase(normalized).orElseGet(() -> {
            NewsletterSubscriber n = new NewsletterSubscriber();
            n.setEmail(normalized);
            n.setSource(source);
            return subscribers.save(n);
        });
        if (s.getStatus() == NewsletterSubscriber.Status.UNSUBSCRIBED) s.setStatus(NewsletterSubscriber.Status.PENDING);
        provider.subscribe(normalized, source);
        return s.getStatus();
    }
}

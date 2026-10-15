package com.yaronengineering.blog.newsletter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(value = NewsletterProvider.class, ignored = NoopNewsletterProvider.class)
public class NoopNewsletterProvider implements NewsletterProvider {
    private static final Logger log = LoggerFactory.getLogger(NoopNewsletterProvider.class);

    @Override
    public void subscribe(String email, String source) {
        log.info("newsletter: subscription stored locally (no provider configured) source={}", source);
    }
}

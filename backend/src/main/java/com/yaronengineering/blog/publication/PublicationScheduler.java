package com.yaronengineering.blog.publication;

import com.yaronengineering.blog.article.ArticleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Publishes SCHEDULED articles whose time has come. Runs every 60 s on this instance.
 * Single-instance deployment is assumed; add a distributed lock (e.g. ShedLock) before scaling horizontally.
 */
@Component
public class PublicationScheduler {
    private static final Logger log = LoggerFactory.getLogger(PublicationScheduler.class);
    private final ArticleService articles;

    public PublicationScheduler(ArticleService articles) {
        this.articles = articles;
    }

    @Scheduled(fixedDelay = 60_000, initialDelay = 15_000)
    public void publishDue() {
        int n = articles.publishDueArticles();
        if (n > 0) log.info("scheduler: published {} due article(s)", n);
    }
}

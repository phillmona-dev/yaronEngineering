package com.yaronengineering.blog.analytics;

import com.yaronengineering.blog.article.Article;
import com.yaronengineering.blog.article.ArticleRepository;
import com.yaronengineering.blog.article.ArticleStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.HexFormat;

/** Counts one view per visitor (SHA-256 of IP + user agent) per article per day. */
@Service
public class ViewService {
    private final ArticleViewRepository views;
    private final ArticleRepository articles;
    private final Clock clock;

    public ViewService(ArticleViewRepository views, ArticleRepository articles, Clock clock) {
        this.views = views;
        this.articles = articles;
        this.clock = clock;
    }

    @Transactional
    public void record(String slug, String ip, String userAgent) {
        Article a = articles.findBySlugAndStatus(slug, ArticleStatus.PUBLISHED).orElse(null);
        if (a == null) return;
        String hash = hash((ip == null ? "" : ip) + "|" + (userAgent == null ? "" : userAgent));
        LocalDate today = LocalDate.now(clock);
        if (views.existsByArticleIdAndVisitorHashAndViewDate(a.getId(), hash, today)) return;
        try {
            views.save(ArticleView.of(a.getId(), hash, today));
            articles.incrementViews(a.getId());
        } catch (DataIntegrityViolationException ignored) {
            // concurrent duplicate — already counted
        }
    }

    static String hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}

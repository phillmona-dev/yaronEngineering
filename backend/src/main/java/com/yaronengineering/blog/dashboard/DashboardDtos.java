package com.yaronengineering.blog.dashboard;

import com.yaronengineering.blog.article.ArticleDtos;
import com.yaronengineering.blog.contact.ContactDtos;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public final class DashboardDtos {
    private DashboardDtos() {}

    public record DailyViews(LocalDate date, long views) {}
    public record Activity(Instant at, String actor, String action, String articleTitle, UUID articleId) {}
    public record Stats(long totalArticles, long published, long drafts, long scheduled, long archived, long totalViews,
                        List<DailyViews> viewsLast30Days, List<ArticleDtos.ArticleSummary> mostRead,
                        List<ArticleDtos.ArticleSummary> recent, List<Activity> recentActivity,
                        long unreadMessages, List<ContactDtos.MessageDto> recentMessages) {}
}

package com.yaronengineering.blog.dashboard;

import com.yaronengineering.blog.analytics.ArticleViewRepository;
import com.yaronengineering.blog.article.ArticleActivityRepository;
import com.yaronengineering.blog.article.ArticleMapper;
import com.yaronengineering.blog.article.ArticleRepository;
import com.yaronengineering.blog.article.ArticleStatus;
import com.yaronengineering.blog.contact.ContactMessageRepository;
import com.yaronengineering.blog.contact.ContactService;
import com.yaronengineering.blog.contact.ContactStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final ArticleRepository articles;
    private final ArticleViewRepository views;
    private final ArticleActivityRepository activity;
    private final ArticleMapper mapper;
    private final Clock clock;
    private final ContactMessageRepository contactMessages;
    private final ContactService contact;

    public DashboardService(ArticleRepository articles, ArticleViewRepository views, ArticleActivityRepository activity, ArticleMapper mapper, Clock clock,
                            ContactMessageRepository contactMessages, ContactService contact) {
        this.contactMessages = contactMessages;
        this.contact = contact;
        this.articles = articles;
        this.views = views;
        this.activity = activity;
        this.mapper = mapper;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public DashboardDtos.Stats stats() {
        LocalDate today = LocalDate.now(clock);
        LocalDate from = today.minusDays(29);
        Map<LocalDate, Long> daily = new HashMap<>();
        for (Object[] row : views.dailyViewsSince(from)) daily.put((LocalDate) row[0], (Long) row[1]);
        List<DashboardDtos.DailyViews> series = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(today); d = d.plusDays(1)) series.add(new DashboardDtos.DailyViews(d, daily.getOrDefault(d, 0L)));

        return new DashboardDtos.Stats(
            articles.count(),
            articles.countByStatus(ArticleStatus.PUBLISHED),
            articles.countByStatus(ArticleStatus.DRAFT),
            articles.countByStatus(ArticleStatus.SCHEDULED),
            articles.countByStatus(ArticleStatus.ARCHIVED),
            articles.totalViews(),
            series,
            articles.findTop5ByStatusOrderByViewCountDesc(ArticleStatus.PUBLISHED).stream().map(mapper::summary).toList(),
            articles.findTop8ByOrderByUpdatedAtDesc().stream().map(mapper::summary).toList(),
            activity.findTop15ByOrderByAtDesc().stream()
                .map(a -> new DashboardDtos.Activity(a.getAt(), a.getActor(), a.getAction(), a.getArticleTitle(), a.getArticleId())).toList(),
            contactMessages.countByStatus(ContactStatus.NEW),
            contactMessages.findTop5ByOrderByCreatedAtDesc().stream().map(m -> contact.get(m.getId())).toList());
    }
}

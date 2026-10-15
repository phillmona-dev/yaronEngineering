package com.yaronengineering.blog.analytics;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ArticleViewRepository extends JpaRepository<ArticleView, UUID> {
    boolean existsByArticleIdAndVisitorHashAndViewDate(UUID articleId, String hash, LocalDate date);

    @Query("select v.viewDate, count(v) from ArticleView v where v.viewDate >= :from group by v.viewDate order by v.viewDate")
    List<Object[]> dailyViewsSince(@Param("from") LocalDate from);
}

package com.yaronengineering.blog.search;

import com.yaronengineering.blog.article.Article;
import com.yaronengineering.blog.article.ArticleDtos;
import com.yaronengineering.blog.article.ArticleMapper;
import com.yaronengineering.blog.article.ArticleRepository;
import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorResponse;
import com.yaronengineering.blog.common.PageResponse;
import com.yaronengineering.blog.common.Paging;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Full-text search over published articles (PostgreSQL tsvector) with ILIKE fallbacks and highlighted snippets. */
@Service
public class SearchService {
    private final ArticleRepository articles;
    private final ArticleMapper mapper;

    public SearchService(ArticleRepository articles, ArticleMapper mapper) {
        this.articles = articles;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<ArticleDtos.ArticleSummary> search(String q, Integer page, Integer size) {
        String query = q == null ? "" : q.trim();
        if (query.length() < 2) {
            throw ApiException.validation("Search query must be at least 2 characters", List.of(new ErrorResponse.FieldError("q", "too short")));
        }
        String like = "%" + query.replace("%", "\\%").replace("_", "\\_") + "%";
        Page<Article> result = articles.search(query, like, Paging.of(page, size, null));
        Map<UUID, String> highlights = new HashMap<>();
        List<UUID> ids = result.getContent().stream().map(Article::getId).toList();
        if (!ids.isEmpty()) {
            for (Object[] row : articles.headlines(query, ids)) highlights.put(UUID.fromString((String) row[0]), (String) row[1]);
        }
        List<ArticleDtos.ArticleSummary> content = result.getContent().stream()
            .map(a -> mapper.summary(a).withHighlight(highlights.getOrDefault(a.getId(), a.getExcerpt()))).toList();
        return PageResponse.of(content, result);
    }
}

package com.yaronengineering.blog.article;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRevisionRepository extends JpaRepository<ArticleRevision, UUID> {
    List<ArticleRevision> findByArticleIdOrderByVersionDesc(UUID articleId);
    Optional<ArticleRevision> findTopByArticleIdOrderByVersionDesc(UUID articleId);
    Optional<ArticleRevision> findByIdAndArticleId(UUID id, UUID articleId);
}

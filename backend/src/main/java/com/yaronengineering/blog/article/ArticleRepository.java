package com.yaronengineering.blog.article;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID>, JpaSpecificationExecutor<Article> {
    Optional<Article> findBySlug(String slug);
    Optional<Article> findBySlugAndStatus(String slug, ArticleStatus status);
    boolean existsBySlug(String slug);
    long countByCategoryId(UUID categoryId);
    long countByAuthorId(UUID authorId);
    long countByStatus(ArticleStatus status);
    List<Article> findByStatusAndScheduledAtLessThanEqual(ArticleStatus status, Instant now);
    List<Article> findTop5ByStatusOrderByViewCountDesc(ArticleStatus status);
    List<Article> findTop8ByOrderByUpdatedAtDesc();
    List<Article> findByStatusOrderByPublishedAtDesc(ArticleStatus status);

    @Query("select coalesce(sum(a.viewCount), 0) from Article a")
    long totalViews();

    @Modifying
    @Query("update Article a set a.viewCount = a.viewCount + 1 where a.id = :id")
    void incrementViews(UUID id);

    @Query("""
        select a from Article a where a.status = com.yaronengineering.blog.article.ArticleStatus.PUBLISHED and a.id <> :id
        order by case when a.category.id = :categoryId then 0 else 1 end, a.publishedAt desc
        """)
    List<Article> relatedCandidates(@Param("id") UUID id, @Param("categoryId") UUID categoryId, Pageable pageable);

    @Query(value = """
        SELECT a.* FROM articles a
        LEFT JOIN categories c ON c.id = a.category_id
        LEFT JOIN authors au ON au.id = a.author_id
        WHERE a.status = 'PUBLISHED' AND (
          a.search_vector @@ plainto_tsquery('english', :q)
          OR a.title ILIKE :like OR c.name ILIKE :like OR au.name ILIKE :like
          OR EXISTS (SELECT 1 FROM article_tags at JOIN tags t ON t.id = at.tag_id WHERE at.article_id = a.id AND t.name ILIKE :like))
        ORDER BY ts_rank(a.search_vector, plainto_tsquery('english', :q)) DESC, a.published_at DESC
        """,
        countQuery = """
        SELECT count(*) FROM articles a
        LEFT JOIN categories c ON c.id = a.category_id
        LEFT JOIN authors au ON au.id = a.author_id
        WHERE a.status = 'PUBLISHED' AND (
          a.search_vector @@ plainto_tsquery('english', :q)
          OR a.title ILIKE :like OR c.name ILIKE :like OR au.name ILIKE :like
          OR EXISTS (SELECT 1 FROM article_tags at JOIN tags t ON t.id = at.tag_id WHERE at.article_id = a.id AND t.name ILIKE :like))
        """, nativeQuery = true)
    Page<Article> search(@Param("q") String q, @Param("like") String like, Pageable pageable);

    @Query(value = """
        SELECT a.id::text, ts_headline('english', coalesce(a.content_text, a.excerpt, ''), plainto_tsquery('english', :q),
          'MaxWords=32, MinWords=16, StartSel=<mark>, StopSel=</mark>, MaxFragments=1')
        FROM articles a WHERE a.id IN (:ids)
        """, nativeQuery = true)
    List<Object[]> headlines(@Param("q") String q, @Param("ids") List<UUID> ids);
}

package com.yaronengineering.blog.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    Optional<Tag> findBySlug(String slug);
    Optional<Tag> findByNameIgnoreCase(String name);
    boolean existsBySlug(String slug);
    List<Tag> findAllByOrderByNameAsc();

    @Query("select t.id, count(a) from Tag t left join com.yaronengineering.blog.article.Article a on t member of a.tags and a.status = com.yaronengineering.blog.article.ArticleStatus.PUBLISHED group by t.id")
    List<Object[]> publishedCounts();

    @Query("select count(a) from com.yaronengineering.blog.article.Article a join a.tags t where t.id = :tagId")
    long countArticles(UUID tagId);
}

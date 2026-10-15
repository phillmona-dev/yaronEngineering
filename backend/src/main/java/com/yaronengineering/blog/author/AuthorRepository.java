package com.yaronengineering.blog.author;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuthorRepository extends JpaRepository<Author, UUID> {
    Optional<Author> findBySlug(String slug);
    Optional<Author> findByUserId(UUID userId);
    boolean existsBySlug(String slug);
    List<Author> findAllByOrderByNameAsc();

    @Query("select a.id, count(ar) from Author a left join com.yaronengineering.blog.article.Article ar on ar.author = a and ar.status = com.yaronengineering.blog.article.ArticleStatus.PUBLISHED group by a.id")
    List<Object[]> publishedCounts();
}

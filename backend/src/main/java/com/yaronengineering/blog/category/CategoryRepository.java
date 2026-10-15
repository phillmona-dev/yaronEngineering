package com.yaronengineering.blog.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Category> findAllByOrderBySortOrderAscNameAsc();

    @Query("select c.id, count(a) from Category c left join com.yaronengineering.blog.article.Article a on a.category = c and a.status = com.yaronengineering.blog.article.ArticleStatus.PUBLISHED group by c.id")
    List<Object[]> publishedCounts();
}

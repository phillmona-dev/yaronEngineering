package com.yaronengineering.blog.article;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArticleActivityRepository extends JpaRepository<ArticleActivity, UUID> {
    List<ArticleActivity> findTop15ByOrderByAtDesc();
}

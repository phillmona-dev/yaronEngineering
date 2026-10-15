package com.yaronengineering.blog.media;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface MediaRepository extends JpaRepository<Media, UUID> {
    Page<Media> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Media> findByAltTextContainingIgnoreCaseOrOriginalFilenameContainingIgnoreCaseOrderByCreatedAtDesc(String alt, String name, Pageable pageable);

    @Query("select (count(a) > 0) from com.yaronengineering.blog.article.Article a where a.coverImage.id = :id or a.ogImage.id = :id")
    boolean referencedByArticles(UUID id);

    @Query("select (count(a) > 0) from com.yaronengineering.blog.author.Author a where a.avatar.id = :id")
    boolean referencedByAuthors(UUID id);
}

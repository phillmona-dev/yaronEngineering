package com.yaronengineering.blog.author;

import com.yaronengineering.blog.article.ArticleRepository;
import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.SlugUtil;
import com.yaronengineering.blog.media.MediaDto;
import com.yaronengineering.blog.media.MediaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthorService {
    private static final Logger log = LoggerFactory.getLogger(AuthorService.class);
    private final AuthorRepository authors;
    private final ArticleRepository articles;
    private final MediaRepository media;

    public AuthorService(AuthorRepository authors, ArticleRepository articles, MediaRepository media) {
        this.authors = authors;
        this.articles = articles;
        this.media = media;
    }

    @Transactional(readOnly = true)
    public List<AuthorDtos.AuthorDto> list(boolean onlyWithPublished) {
        Map<UUID, Long> counts = counts();
        return authors.findAllByOrderByNameAsc().stream().map(a -> toDto(a, counts.getOrDefault(a.getId(), 0L)))
            .filter(d -> !onlyWithPublished || d.articleCount() > 0).toList();
    }

    @Transactional(readOnly = true)
    public AuthorDtos.AuthorDto get(String slug) {
        Author a = authors.findBySlug(slug).orElseThrow(() -> ApiException.notFound("Author"));
        return toDto(a, counts().getOrDefault(a.getId(), 0L));
    }

    @Transactional
    public AuthorDtos.AuthorDto create(AuthorDtos.AuthorRequest req) {
        Author a = new Author();
        apply(a, req, true);
        a = authors.save(a);
        log.info("admin: author created slug={}", a.getSlug());
        return toDto(a, 0);
    }

    @Transactional
    public AuthorDtos.AuthorDto update(UUID id, AuthorDtos.AuthorRequest req) {
        Author a = authors.findById(id).orElseThrow(() -> ApiException.notFound("Author"));
        apply(a, req, false);
        log.info("admin: author updated id={}", id);
        return toDto(a, counts().getOrDefault(id, 0L));
    }

    @Transactional
    public void delete(UUID id) {
        Author a = authors.findById(id).orElseThrow(() -> ApiException.notFound("Author"));
        if (articles.countByAuthorId(id) > 0) throw ApiException.conflict("Author is still referenced by articles");
        authors.delete(a);
        log.info("admin: author deleted id={}", id);
    }

    private void apply(Author a, AuthorDtos.AuthorRequest req, boolean isNew) {
        String base = req.slug() == null || req.slug().isBlank() ? SlugUtil.slugify(req.name()) : SlugUtil.slugify(req.slug());
        if (isNew || !base.equals(a.getSlug())) {
            String slug = isNew ? SlugUtil.unique(base, authors::existsBySlug) : base;
            if (!isNew && authors.existsBySlug(slug)) throw ApiException.conflict("An author with slug '" + slug + "' already exists");
            a.setSlug(slug);
        }
        a.setName(req.name().trim());
        a.setPosition(req.position());
        a.setBio(req.bio());
        a.setLinkedinUrl(req.linkedinUrl());
        a.setUserId(req.userId());
        a.setAvatar(req.avatarId() == null ? null : media.findById(req.avatarId()).orElseThrow(() -> ApiException.notFound("Avatar media")));
    }

    private Map<UUID, Long> counts() {
        Map<UUID, Long> m = new HashMap<>();
        for (Object[] row : authors.publishedCounts()) m.put((UUID) row[0], (Long) row[1]);
        return m;
    }

    private AuthorDtos.AuthorDto toDto(Author a, long count) {
        return new AuthorDtos.AuthorDto(a.getId(), a.getName(), a.getSlug(), a.getPosition(), a.getBio(), MediaDto.from(a.getAvatar()),
            a.getLinkedinUrl(), count, a.getUserId());
    }
}

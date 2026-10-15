package com.yaronengineering.blog.tag;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.SlugUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TagService {
    private static final Logger log = LoggerFactory.getLogger(TagService.class);
    private final TagRepository tags;

    public TagService(TagRepository tags) {
        this.tags = tags;
    }

    @Transactional(readOnly = true)
    public List<TagDtos.TagDto> list(boolean onlyWithPublished) {
        Map<UUID, Long> counts = counts();
        return tags.findAllByOrderByNameAsc().stream().map(t -> new TagDtos.TagDto(t.getId(), t.getName(), t.getSlug(), counts.getOrDefault(t.getId(), 0L)))
            .filter(d -> !onlyWithPublished || d.articleCount() > 0).toList();
    }

    @Transactional(readOnly = true)
    public TagDtos.TagDto get(String slug) {
        Tag t = tags.findBySlug(slug).orElseThrow(() -> ApiException.notFound("Tag"));
        return new TagDtos.TagDto(t.getId(), t.getName(), t.getSlug(), counts().getOrDefault(t.getId(), 0L));
    }

    @Transactional
    public TagDtos.TagDto create(TagDtos.TagRequest req) {
        Tag t = new Tag();
        apply(t, req, true);
        t = tags.save(t);
        log.info("admin: tag created slug={}", t.getSlug());
        return new TagDtos.TagDto(t.getId(), t.getName(), t.getSlug(), 0);
    }

    @Transactional
    public TagDtos.TagDto update(UUID id, TagDtos.TagRequest req) {
        Tag t = tags.findById(id).orElseThrow(() -> ApiException.notFound("Tag"));
        apply(t, req, false);
        return new TagDtos.TagDto(t.getId(), t.getName(), t.getSlug(), counts().getOrDefault(id, 0L));
    }

    @Transactional
    public void delete(UUID id) {
        Tag t = tags.findById(id).orElseThrow(() -> ApiException.notFound("Tag"));
        tags.delete(t);
        log.info("admin: tag deleted id={}", id);
    }

    private void apply(Tag t, TagDtos.TagRequest req, boolean isNew) {
        String base = req.slug() == null || req.slug().isBlank() ? SlugUtil.slugify(req.name()) : SlugUtil.slugify(req.slug());
        if (isNew || !base.equals(t.getSlug())) {
            if (tags.existsBySlug(base)) throw ApiException.conflict("A tag with slug '" + base + "' already exists");
            t.setSlug(base);
        }
        t.setName(req.name().trim());
    }

    private Map<UUID, Long> counts() {
        Map<UUID, Long> m = new HashMap<>();
        for (Object[] row : tags.publishedCounts()) m.put((UUID) row[0], (Long) row[1]);
        return m;
    }
}

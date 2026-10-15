package com.yaronengineering.blog.category;

import com.yaronengineering.blog.article.ArticleRepository;
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
public class CategoryService {
    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categories;
    private final ArticleRepository articles;

    public CategoryService(CategoryRepository categories, ArticleRepository articles) {
        this.categories = categories;
        this.articles = articles;
    }

    @Transactional(readOnly = true)
    public List<CategoryDtos.CategoryDto> list(boolean onlyWithPublished) {
        Map<UUID, Long> counts = counts();
        return categories.findAllByOrderBySortOrderAscNameAsc().stream()
            .map(c -> toDto(c, counts.getOrDefault(c.getId(), 0L)))
            .filter(d -> !onlyWithPublished || d.articleCount() > 0)
            .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDtos.CategoryDetail getPublic(String slug) {
        Category c = categories.findBySlug(slug).orElseThrow(() -> ApiException.notFound("Category"));
        Map<UUID, Long> counts = counts();
        List<CategoryDtos.CategoryDto> related = categories.findAllByOrderBySortOrderAscNameAsc().stream()
            .filter(o -> !o.getId().equals(c.getId()) && counts.getOrDefault(o.getId(), 0L) > 0)
            .limit(4).map(o -> toDto(o, counts.get(o.getId()))).toList();
        return new CategoryDtos.CategoryDetail(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getTagline(),
            counts.getOrDefault(c.getId(), 0L), c.getSortOrder(), related);
    }

    @Transactional
    public CategoryDtos.CategoryDto create(CategoryDtos.CategoryRequest req) {
        Category c = new Category();
        apply(c, req, true);
        c = categories.save(c);
        log.info("admin: category created slug={}", c.getSlug());
        return toDto(c, 0);
    }

    @Transactional
    public CategoryDtos.CategoryDto update(UUID id, CategoryDtos.CategoryRequest req) {
        Category c = categories.findById(id).orElseThrow(() -> ApiException.notFound("Category"));
        apply(c, req, false);
        log.info("admin: category updated id={}", id);
        return toDto(c, counts().getOrDefault(id, 0L));
    }

    @Transactional
    public void delete(UUID id) {
        Category c = categories.findById(id).orElseThrow(() -> ApiException.notFound("Category"));
        if (articles.countByCategoryId(id) > 0) throw ApiException.conflict("Category is still referenced by articles");
        categories.delete(c);
        log.info("admin: category deleted id={}", id);
    }

    private void apply(Category c, CategoryDtos.CategoryRequest req, boolean isNew) {
        String base = req.slug() == null || req.slug().isBlank() ? SlugUtil.slugify(req.name()) : SlugUtil.slugify(req.slug());
        if (isNew || !base.equals(c.getSlug())) {
            if (categories.existsBySlug(base)) throw ApiException.conflict("A category with slug '" + base + "' already exists");
            c.setSlug(base);
        }
        c.setName(req.name().trim());
        c.setDescription(req.description());
        c.setTagline(req.tagline());
        c.setSortOrder(req.sortOrder() == null ? c.getSortOrder() : req.sortOrder());
    }

    private Map<UUID, Long> counts() {
        Map<UUID, Long> m = new HashMap<>();
        for (Object[] row : categories.publishedCounts()) m.put((UUID) row[0], (Long) row[1]);
        return m;
    }

    private CategoryDtos.CategoryDto toDto(Category c, long count) {
        return new CategoryDtos.CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getTagline(), count, c.getSortOrder());
    }
}

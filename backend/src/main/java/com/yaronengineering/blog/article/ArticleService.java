package com.yaronengineering.blog.article;

import com.yaronengineering.blog.auth.CurrentUser;
import com.yaronengineering.blog.author.AuthorRepository;
import com.yaronengineering.blog.category.CategoryRepository;
import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorResponse;
import com.yaronengineering.blog.common.HtmlProcessor;
import com.yaronengineering.blog.common.PageResponse;
import com.yaronengineering.blog.common.Paging;
import com.yaronengineering.blog.common.SlugUtil;
import com.yaronengineering.blog.media.MediaRepository;
import com.yaronengineering.blog.publication.PublicationSchedule;
import com.yaronengineering.blog.publication.PublicationScheduleRepository;
import com.yaronengineering.blog.publication.RevalidationClient;
import com.yaronengineering.blog.tag.TagRepository;
import com.yaronengineering.blog.user.Role;
import com.yaronengineering.blog.user.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.*;

@Service
public class ArticleService {
    private static final Logger log = LoggerFactory.getLogger(ArticleService.class);

    private final ArticleRepository articles;
    private final ArticleRevisionRepository revisions;
    private final ArticleActivityRepository activity;
    private final CategoryRepository categories;
    private final TagRepository tags;
    private final AuthorRepository authors;
    private final MediaRepository media;
    private final UserRepository users;
    private final PublicationScheduleRepository schedules;
    private final HtmlProcessor html;
    private final ArticleMapper mapper;
    private final RevalidationClient revalidation;
    private final Clock clock;

    public ArticleService(ArticleRepository articles, ArticleRevisionRepository revisions, ArticleActivityRepository activity,
                          CategoryRepository categories, TagRepository tags, AuthorRepository authors, MediaRepository media,
                          UserRepository users, PublicationScheduleRepository schedules, HtmlProcessor html, ArticleMapper mapper,
                          RevalidationClient revalidation, Clock clock) {
        this.articles = articles;
        this.revisions = revisions;
        this.activity = activity;
        this.categories = categories;
        this.tags = tags;
        this.authors = authors;
        this.media = media;
        this.users = users;
        this.schedules = schedules;
        this.html = html;
        this.mapper = mapper;
        this.revalidation = revalidation;
        this.clock = clock;
    }

    // ------------------------------------------------------------------ public reads

    @Transactional(readOnly = true)
    public PageResponse<ArticleDtos.ArticleSummary> listPublished(Integer page, Integer size, String category, String tag, String author,
                                                                  Boolean featured, String sort) {
        Sort s = "popular".equalsIgnoreCase(sort) ? Sort.by(Sort.Direction.DESC, "viewCount", "publishedAt") : Sort.by(Sort.Direction.DESC, "publishedAt");
        Specification<Article> spec = (root, q, cb) -> {
            List<Predicate> p = new ArrayList<>();
            p.add(cb.equal(root.get("status"), ArticleStatus.PUBLISHED));
            if (category != null && !category.isBlank()) p.add(cb.equal(root.get("category").get("slug"), category));
            if (author != null && !author.isBlank()) p.add(cb.equal(root.get("author").get("slug"), author));
            if (tag != null && !tag.isBlank()) p.add(cb.equal(root.join("tags").get("slug"), tag));
            if (featured != null) p.add(cb.equal(root.get("featured"), featured));
            if (q != null) q.distinct(true);
            return cb.and(p.toArray(Predicate[]::new));
        };
        return PageResponse.from(articles.findAll(spec, Paging.of(page, size, s)), mapper::summary);
    }

    @Transactional(readOnly = true)
    public List<ArticleDtos.ArticleSummary> featured(int limit) {
        int n = Math.max(1, Math.min(limit, 3));
        Specification<Article> featuredSpec = (root, q, cb) -> cb.and(cb.equal(root.get("status"), ArticleStatus.PUBLISHED), cb.isTrue(root.get("featured")));
        List<Article> list = new ArrayList<>(articles.findAll(featuredSpec, PageRequest.of(0, n, Sort.by(Sort.Direction.DESC, "publishedAt"))).getContent());
        if (list.size() < n) {
            Set<UUID> have = new HashSet<>();
            list.forEach(a -> have.add(a.getId()));
            Specification<Article> newest = (root, q, cb) -> cb.equal(root.get("status"), ArticleStatus.PUBLISHED);
            for (Article a : articles.findAll(newest, PageRequest.of(0, n + 3, Sort.by(Sort.Direction.DESC, "publishedAt"))).getContent()) {
                if (list.size() >= n) break;
                if (!have.contains(a.getId())) list.add(a);
            }
        }
        return list.stream().map(mapper::summary).toList();
    }

    @Transactional(readOnly = true)
    public ArticleDtos.ArticleDetail getPublished(String slug) {
        Article a = articles.findBySlugAndStatus(slug, ArticleStatus.PUBLISHED).orElseThrow(() -> ApiException.notFound("Article"));
        return mapper.detail(a, related(a, 3));
    }

    @Transactional(readOnly = true)
    public List<ArticleDtos.ArticleSummary> relatedPublished(String slug, int limit) {
        Article a = articles.findBySlugAndStatus(slug, ArticleStatus.PUBLISHED).orElseThrow(() -> ApiException.notFound("Article"));
        return related(a, Math.max(1, Math.min(limit, 6)));
    }

    /** Same category first, then shared tags, then newest. */
    private List<ArticleDtos.ArticleSummary> related(Article a, int limit) {
        UUID categoryId = a.getCategory() == null ? new UUID(0, 0) : a.getCategory().getId();
        List<Article> candidates = articles.relatedCandidates(a.getId(), categoryId, PageRequest.of(0, 40));
        Set<UUID> myTags = new HashSet<>();
        a.getTags().forEach(t -> myTags.add(t.getId()));
        return candidates.stream()
            .sorted(Comparator
                .comparingInt((Article c) -> c.getCategory() != null && c.getCategory().getId().equals(categoryId) ? 0 : 1)
                .thenComparingLong(c -> -c.getTags().stream().filter(t -> myTags.contains(t.getId())).count())
                .thenComparing(c -> c.getPublishedAt() == null ? Instant.EPOCH : c.getPublishedAt(), Comparator.reverseOrder()))
            .limit(limit).map(mapper::summary).toList();
    }

    // ------------------------------------------------------------------ admin reads

    @Transactional(readOnly = true)
    public PageResponse<ArticleDtos.ArticleSummary> listAdmin(CurrentUser cu, Integer page, Integer size, ArticleStatus status, String category,
                                                              String author, String q, Boolean featured, String sort) {
        Sort s = switch (sort == null ? "updated" : sort) {
            case "published" -> Sort.by(Sort.Direction.DESC, "publishedAt");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCount");
            case "title" -> Sort.by(Sort.Direction.ASC, "title");
            default -> Sort.by(Sort.Direction.DESC, "updatedAt");
        };
        Specification<Article> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (cu.isAuthorOnly()) p.add(cb.equal(root.get("createdBy").get("id"), cu.id()));
            if (status != null) p.add(cb.equal(root.get("status"), status));
            if (category != null && !category.isBlank()) p.add(cb.equal(root.get("category").get("slug"), category));
            if (author != null && !author.isBlank()) p.add(cb.equal(root.get("author").get("slug"), author));
            if (featured != null) p.add(cb.equal(root.get("featured"), featured));
            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                p.add(cb.or(cb.like(cb.lower(root.get("title")), like), cb.like(cb.lower(root.get("slug")), like)));
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
        return PageResponse.from(articles.findAll(spec, Paging.of(page, size, s)), mapper::summary);
    }

    @Transactional(readOnly = true)
    public ArticleDtos.ArticleDetail getAdmin(CurrentUser cu, UUID id) {
        Article a = load(id);
        assertCanRead(cu, a);
        return mapper.detail(a, related(a, 3));
    }

    // ------------------------------------------------------------------ writes

    @Transactional
    public ArticleDtos.ArticleDetail create(CurrentUser cu, ArticleDtos.ArticleRequest req) {
        Article a = new Article();
        a.setCreatedBy(users.findById(cu.id()).orElse(null));
        a.setStatus(ArticleStatus.DRAFT);
        String base = req.slug() == null || req.slug().isBlank() ? SlugUtil.slugify(req.title()) : SlugUtil.slugify(req.slug());
        if (req.slug() != null && !req.slug().isBlank() && articles.existsBySlug(base)) throw ApiException.conflict("Slug '" + base + "' is already in use");
        a.setSlug(SlugUtil.unique(base, articles::existsBySlug));
        apply(cu, a, req);
        a = articles.save(a);
        activity.save(ArticleActivity.of(a, "CREATED", cu.email()));
        log.info("admin: article created id={} slug={} by={}", a.getId(), a.getSlug(), cu.email());
        return mapper.detail(a, List.of());
    }

    @Transactional
    public ArticleDtos.ArticleDetail update(CurrentUser cu, UUID id, ArticleDtos.ArticleRequest req) {
        Article a = load(id);
        assertCanEdit(cu, a);
        saveRevision(a, cu.email());
        if (req.slug() != null && !req.slug().isBlank()) {
            String slug = SlugUtil.slugify(req.slug());
            if (!slug.equals(a.getSlug())) {
                if (articles.existsBySlug(slug)) throw ApiException.conflict("Slug '" + slug + "' is already in use");
                a.setSlug(slug);
            }
        }
        apply(cu, a, req);
        activity.save(ArticleActivity.of(a, "UPDATED", cu.email()));
        log.info("admin: article updated id={} by={}", id, cu.email());
        if (a.getStatus() == ArticleStatus.PUBLISHED) notify(a);
        return mapper.detail(a, related(a, 3));
    }

    @Transactional
    public void delete(UUID id, CurrentUser cu) {
        Article a = load(id);
        articles.delete(a);
        log.info("admin: article deleted id={} by={}", id, cu.email());
        notify(a);
    }

    @Transactional
    public ArticleDtos.ArticleDetail publish(CurrentUser cu, UUID id) {
        Article a = load(id);
        requirePublisher(cu);
        if (a.getStatus() == ArticleStatus.PUBLISHED) throw ApiException.invalidState("Article is already published");
        if (a.getStatus() == ArticleStatus.ARCHIVED) throw ApiException.invalidState("Archived articles must be unarchived before publishing");
        validateForPublish(a);
        cancelPendingSchedules(a);
        a.setStatus(ArticleStatus.PUBLISHED);
        a.setScheduledAt(null);
        if (a.getPublishedAt() == null) a.setPublishedAt(Instant.now(clock));
        activity.save(ArticleActivity.of(a, "PUBLISHED", cu.email()));
        log.info("publish: article published id={} slug={} by={}", id, a.getSlug(), cu.email());
        notify(a);
        return mapper.detail(a, related(a, 3));
    }

    @Transactional
    public ArticleDtos.ArticleDetail unpublish(CurrentUser cu, UUID id) {
        Article a = load(id);
        requirePublisher(cu);
        if (a.getStatus() != ArticleStatus.PUBLISHED && a.getStatus() != ArticleStatus.SCHEDULED) {
            throw ApiException.invalidState("Only published or scheduled articles can be unpublished");
        }
        cancelPendingSchedules(a);
        a.setStatus(ArticleStatus.DRAFT);
        a.setScheduledAt(null);
        activity.save(ArticleActivity.of(a, "UNPUBLISHED", cu.email()));
        log.info("publish: article unpublished id={} by={}", id, cu.email());
        notify(a);
        return mapper.detail(a, List.of());
    }

    @Transactional
    public ArticleDtos.ArticleDetail schedule(CurrentUser cu, UUID id, Instant at) {
        Article a = load(id);
        requirePublisher(cu);
        if (at == null || !at.isAfter(Instant.now(clock))) {
            throw ApiException.validation("Scheduled time must be in the future", List.of(new ErrorResponse.FieldError("scheduledAt", "must be in the future")));
        }
        if (a.getStatus() == ArticleStatus.PUBLISHED) throw ApiException.invalidState("Article is already published");
        if (a.getStatus() == ArticleStatus.ARCHIVED) throw ApiException.invalidState("Archived articles must be unarchived before scheduling");
        validateForPublish(a);
        cancelPendingSchedules(a);
        a.setStatus(ArticleStatus.SCHEDULED);
        a.setScheduledAt(at);
        schedules.save(PublicationSchedule.pending(a.getId(), at, cu.id()));
        activity.save(ArticleActivity.of(a, "SCHEDULED", cu.email()));
        log.info("publish: article scheduled id={} at={} by={}", id, at, cu.email());
        return mapper.detail(a, List.of());
    }

    @Transactional
    public ArticleDtos.ArticleDetail archive(CurrentUser cu, UUID id) {
        Article a = load(id);
        requirePublisher(cu);
        if (a.getStatus() == ArticleStatus.ARCHIVED) throw ApiException.invalidState("Article is already archived");
        boolean wasPublic = a.getStatus() == ArticleStatus.PUBLISHED;
        cancelPendingSchedules(a);
        a.setStatus(ArticleStatus.ARCHIVED);
        a.setScheduledAt(null);
        activity.save(ArticleActivity.of(a, "ARCHIVED", cu.email()));
        log.info("publish: article archived id={} by={}", id, cu.email());
        if (wasPublic) notify(a);
        return mapper.detail(a, List.of());
    }

    @Transactional
    public ArticleDtos.ArticleDetail unarchive(CurrentUser cu, UUID id) {
        Article a = load(id);
        requirePublisher(cu);
        if (a.getStatus() != ArticleStatus.ARCHIVED) throw ApiException.invalidState("Article is not archived");
        a.setStatus(ArticleStatus.DRAFT);
        activity.save(ArticleActivity.of(a, "UNARCHIVED", cu.email()));
        return mapper.detail(a, List.of());
    }

    @Transactional
    public ArticleDtos.ArticleDetail feature(CurrentUser cu, UUID id, boolean featured) {
        Article a = load(id);
        requirePublisher(cu);
        a.setFeatured(featured);
        activity.save(ArticleActivity.of(a, featured ? "FEATURED" : "UNFEATURED", cu.email()));
        if (a.getStatus() == ArticleStatus.PUBLISHED) notify(a);
        return mapper.detail(a, related(a, 3));
    }

    /** Called by the scheduler. Returns number of articles published. */
    @Transactional
    public int publishDueArticles() {
        Instant now = Instant.now(clock);
        int count = 0;
        for (Article a : articles.findByStatusAndScheduledAtLessThanEqual(ArticleStatus.SCHEDULED, now)) {
            a.setStatus(ArticleStatus.PUBLISHED);
            if (a.getPublishedAt() == null) a.setPublishedAt(a.getScheduledAt() != null ? a.getScheduledAt() : now);
            a.setScheduledAt(null);
            for (PublicationSchedule s : schedules.findByArticleIdAndStatus(a.getId(), PublicationSchedule.Status.PENDING)) {
                s.setStatus(PublicationSchedule.Status.PUBLISHED);
                s.setExecutedAt(now);
            }
            activity.save(ArticleActivity.of(a, "PUBLISHED", "scheduler"));
            log.info("publish: scheduled article published id={} slug={}", a.getId(), a.getSlug());
            notify(a);
            count++;
        }
        return count;
    }

    // ------------------------------------------------------------------ revisions

    @Transactional(readOnly = true)
    public List<ArticleDtos.RevisionSummary> revisions(CurrentUser cu, UUID id) {
        Article a = load(id);
        assertCanRead(cu, a);
        return revisions.findByArticleIdOrderByVersionDesc(id).stream().map(mapper::revisionSummary).toList();
    }

    @Transactional(readOnly = true)
    public ArticleDtos.RevisionDetail revision(CurrentUser cu, UUID id, UUID revisionId) {
        Article a = load(id);
        assertCanRead(cu, a);
        return mapper.revisionDetail(revisions.findByIdAndArticleId(revisionId, id).orElseThrow(() -> ApiException.notFound("Revision")));
    }

    @Transactional
    public ArticleDtos.ArticleDetail restore(CurrentUser cu, UUID id, UUID revisionId) {
        Article a = load(id);
        assertCanEdit(cu, a);
        ArticleRevision r = revisions.findByIdAndArticleId(revisionId, id).orElseThrow(() -> ApiException.notFound("Revision"));
        saveRevision(a, cu.email());
        a.setTitle(r.getTitle());
        a.setExcerpt(r.getExcerpt());
        a.setSeoTitle(r.getSeoTitle());
        a.setSeoDescription(r.getSeoDescription());
        setContent(a, r.getContentHtml(), r.getContentJson());
        activity.save(ArticleActivity.of(a, "RESTORED", cu.email()));
        log.info("admin: article restored id={} revision={} by={}", id, r.getVersion(), cu.email());
        if (a.getStatus() == ArticleStatus.PUBLISHED) notify(a);
        return mapper.detail(a, related(a, 3));
    }

    // ------------------------------------------------------------------ helpers

    private Article load(UUID id) {
        return articles.findById(id).orElseThrow(() -> ApiException.notFound("Article"));
    }

    private void apply(CurrentUser cu, Article a, ArticleDtos.ArticleRequest req) {
        a.setTitle(req.title().trim());
        a.setExcerpt(req.excerpt() == null ? null : req.excerpt().trim());
        setContent(a, req.contentHtml(), req.contentJson());
        a.setCoverImage(req.coverImageId() == null ? null : media.findById(req.coverImageId()).orElseThrow(() -> ApiException.notFound("Cover image")));
        a.setOgImage(req.ogImageId() == null ? null : media.findById(req.ogImageId()).orElseThrow(() -> ApiException.notFound("OG image")));
        a.setCategory(req.categoryId() == null ? null : categories.findById(req.categoryId()).orElseThrow(() -> ApiException.notFound("Category")));
        a.setAuthor(req.authorId() == null ? null : authors.findById(req.authorId()).orElseThrow(() -> ApiException.notFound("Author")));
        a.getTags().clear();
        if (req.tagIds() != null) {
            for (UUID tagId : new LinkedHashSet<>(req.tagIds())) {
                a.getTags().add(tags.findById(tagId).orElseThrow(() -> ApiException.notFound("Tag")));
            }
        }
        if (req.featured() != null && cu.canPublish()) a.setFeatured(req.featured());
        a.setSeoTitle(req.seoTitle());
        a.setSeoDescription(req.seoDescription());
        a.setCanonicalUrl(req.canonicalUrl());
        a.setNoIndex(req.noIndex() != null && req.noIndex());
    }

    private void setContent(Article a, String rawHtml, Map<String, Object> json) {
        HtmlProcessor.Processed p = html.process(rawHtml);
        a.setContentHtml(p.html());
        a.setContentText(p.text());
        a.setReadingTimeMinutes(p.readingTimeMinutes());
        a.setContentJson(json);
    }

    private void saveRevision(Article a, String by) {
        int next = revisions.findTopByArticleIdOrderByVersionDesc(a.getId()).map(r -> r.getVersion() + 1).orElse(1);
        revisions.save(ArticleRevision.snapshot(a, next, by));
    }

    private void validateForPublish(Article a) {
        List<ErrorResponse.FieldError> errors = new ArrayList<>();
        if (blank(a.getTitle())) errors.add(new ErrorResponse.FieldError("title", "is required"));
        if (blank(a.getSlug())) errors.add(new ErrorResponse.FieldError("slug", "is required"));
        if (blank(a.getExcerpt())) errors.add(new ErrorResponse.FieldError("excerpt", "is required"));
        if (blank(a.getContentText())) errors.add(new ErrorResponse.FieldError("contentHtml", "is required"));
        if (a.getCategory() == null) errors.add(new ErrorResponse.FieldError("categoryId", "is required"));
        if (a.getAuthor() == null) errors.add(new ErrorResponse.FieldError("authorId", "is required"));
        if (a.getCoverImage() == null) errors.add(new ErrorResponse.FieldError("coverImageId", "is required"));
        if (blank(a.getSeoDescription())) errors.add(new ErrorResponse.FieldError("seoDescription", "is required"));
        if (!errors.isEmpty()) throw ApiException.validation("Article is not ready to publish", errors);
    }

    private void cancelPendingSchedules(Article a) {
        for (PublicationSchedule s : schedules.findByArticleIdAndStatus(a.getId(), PublicationSchedule.Status.PENDING)) {
            s.setStatus(PublicationSchedule.Status.CANCELLED);
            s.setExecutedAt(Instant.now(clock));
        }
    }

    private void notify(Article a) {
        List<String> tags = new ArrayList<>(List.of("articles", "article:" + a.getSlug()));
        if (a.getCategory() != null) tags.add("category:" + a.getCategory().getSlug());
        if (a.getAuthor() != null) tags.add("author:" + a.getAuthor().getSlug());
        revalidation.revalidate(tags);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private void requirePublisher(CurrentUser cu) {
        if (!cu.canPublish()) throw ApiException.forbidden("Only editors and admins can change publication state");
    }

    private void assertCanRead(CurrentUser cu, Article a) {
        if (cu.isAuthorOnly() && !owns(cu, a)) throw ApiException.forbidden("You can only access your own articles");
    }

    private void assertCanEdit(CurrentUser cu, Article a) {
        if (cu.role() == Role.AUTHOR && !owns(cu, a)) throw ApiException.forbidden("You can only edit your own articles");
    }

    private static boolean owns(CurrentUser cu, Article a) {
        return a.getCreatedBy() != null && a.getCreatedBy().getId().equals(cu.id());
    }
}

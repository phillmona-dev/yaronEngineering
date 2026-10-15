package com.yaronengineering.blog.seed;

import com.yaronengineering.blog.article.Article;
import com.yaronengineering.blog.article.ArticleRepository;
import com.yaronengineering.blog.article.ArticleStatus;
import com.yaronengineering.blog.author.AuthorRepository;
import com.yaronengineering.blog.category.CategoryRepository;
import com.yaronengineering.blog.common.HtmlProcessor;
import com.yaronengineering.blog.config.AppProperties;
import com.yaronengineering.blog.media.Media;
import com.yaronengineering.blog.media.MediaRepository;
import com.yaronengineering.blog.tag.Tag;
import com.yaronengineering.blog.tag.TagRepository;
import com.yaronengineering.blog.user.AdminBootstrap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * DEVELOPMENT ONLY. Inserts five clearly labelled sample articles when SEED_SAMPLE_CONTENT=true and no articles exist.
 * Content is generic engineering guidance — it makes no claims about clients, projects or results.
 */
@Component
@Order(2)
public class SampleContentSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(SampleContentSeeder.class);
    private static final String PREFIX = "[Sample article for development] ";

    private final AppProperties props;
    private final ArticleRepository articles;
    private final CategoryRepository categories;
    private final TagRepository tags;
    private final AuthorRepository authors;
    private final MediaRepository media;
    private final HtmlProcessor html;

    public SampleContentSeeder(AppProperties props, ArticleRepository articles, CategoryRepository categories, TagRepository tags,
                               AuthorRepository authors, MediaRepository media, HtmlProcessor html) {
        this.props = props;
        this.articles = articles;
        this.categories = categories;
        this.tags = tags;
        this.authors = authors;
        this.media = media;
        this.html = html;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!props.seed().sampleContent() || articles.count() > 0) return;
        var author = authors.findBySlug(AdminBootstrap.EDITORIAL_SLUG).orElse(null);
        if (author == null) return;
        Tag sample = tags.findBySlug("sample-content").orElseGet(() -> {
            Tag t = new Tag();
            t.setName("Sample Content");
            t.setSlug("sample-content");
            return tags.save(t);
        });

        List<Sample> samples = SampleArticles.all();
        Instant now = Instant.now();
        int i = 0;
        for (Sample s : samples) {
            var category = categories.findBySlug(s.categorySlug()).orElse(null);
            Media cover = new Media();
            cover.setUrl(s.coverPath());
            cover.setAltText(s.coverAlt());
            cover.setMimeType("image/jpeg");
            cover.setWidth(2200);
            cover.setHeight(1467);
            cover.setSizeBytes(0);
            cover.setOriginalFilename(s.coverPath().substring(s.coverPath().lastIndexOf('/') + 1));
            cover = media.save(cover);

            Tag topic = tags.findBySlug(s.tagSlug()).orElseGet(() -> {
                Tag t = new Tag();
                t.setName(s.tagName());
                t.setSlug(s.tagSlug());
                return tags.save(t);
            });

            HtmlProcessor.Processed p = html.process(s.html());
            Article a = new Article();
            a.setTitle(s.title());
            a.setSlug(s.slug());
            a.setExcerpt(PREFIX + s.excerpt());
            a.setContentHtml(p.html());
            a.setContentText(p.text());
            a.setReadingTimeMinutes(p.readingTimeMinutes());
            a.setCoverImage(cover);
            a.setCategory(category);
            a.setAuthor(author);
            a.setTags(new LinkedHashSet<>(List.of(sample, topic)));
            a.setStatus(ArticleStatus.PUBLISHED);
            a.setFeatured(i == 0);
            a.setSeoTitle(s.title());
            a.setSeoDescription(s.excerpt());
            a.setPublishedAt(now.minus(2L + i * 6L, ChronoUnit.DAYS));
            articles.save(a);
            i++;
        }
        log.info("Seeded {} sample articles (SEED_SAMPLE_CONTENT=true)", samples.size());
    }

    record Sample(String title, String slug, String excerpt, String categorySlug, String tagName, String tagSlug,
                  String coverPath, String coverAlt, String html) {}
}

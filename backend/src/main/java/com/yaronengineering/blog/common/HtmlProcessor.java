package com.yaronengineering.blog.common;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Sanitizes editor HTML (OWASP policy), assigns stable ids to h2/h3, extracts the table of contents,
 * plain text and reading time. The editor output is never trusted.
 */
@Component
public class HtmlProcessor {

    public record TocEntry(String id, String text, int level) {}
    public record Processed(String html, String text, List<TocEntry> toc, int readingTimeMinutes) {}

    private static final Pattern SAFE_URL = Pattern.compile("^(https?://|mailto:|/|#)[^\\s]*$", Pattern.CASE_INSENSITIVE);
    private static final Pattern SAFE_IMG = Pattern.compile("^(https?://|/)[^\\s]*$", Pattern.CASE_INSENSITIVE);
    private static final Set<String> CALLOUT_TYPES = Set.of("info", "warning", "success", "note");

    private static final PolicyFactory POLICY = new HtmlPolicyBuilder()
        .allowElements("h1", "h2", "h3", "h4", "p", "br", "ul", "ol", "li", "blockquote", "pre", "code", "strong", "b", "em", "i",
            "u", "s", "a", "img", "table", "thead", "tbody", "tr", "th", "td", "hr", "figure", "figcaption", "div", "span", "sup", "sub")
        .allowAttributes("href").matching(SAFE_URL).onElements("a")
        .allowAttributes("target").matching(true, "_blank").onElements("a")
        .allowAttributes("rel").matching(true, "noopener", "noreferrer", "noopener noreferrer").onElements("a")
        .allowAttributes("src").matching(SAFE_IMG).onElements("img")
        .allowAttributes("alt", "title", "width", "height").onElements("img")
        .allowAttributes("class").matching(true, "callout", "language-java", "language-js", "language-ts", "language-bash",
            "language-sql", "language-json", "language-yaml", "language-xml", "language-html", "language-css", "language-python", "language-text").onElements("div", "pre", "code")
        .allowAttributes("data-type").matching(true, CALLOUT_TYPES.toArray(String[]::new)).onElements("div")
        .allowAttributes("colspan", "rowspan").matching(Pattern.compile("^[0-9]{1,2}$")).onElements("td", "th")
        .allowAttributes("start").matching(Pattern.compile("^[0-9]{1,5}$")).onElements("ol")
        .allowAttributes("id").matching(Pattern.compile("^[a-z0-9-]{1,120}$")).onElements("h2", "h3")
        .allowStandardUrlProtocols()
        .requireRelNofollowOnLinks()
        .toFactory();

    public Processed process(String rawHtml) {
        String sanitized = POLICY.sanitize(rawHtml == null ? "" : rawHtml);
        Document doc = Jsoup.parseBodyFragment(sanitized);
        doc.outputSettings().prettyPrint(false);

        // Links: open external links safely.
        for (Element a : doc.select("a[href]")) {
            String href = a.attr("href");
            if (href.startsWith("http")) {
                a.attr("target", "_blank");
                a.attr("rel", "noopener noreferrer nofollow");
            }
        }
        // Divs are only allowed as callouts.
        for (Element div : doc.select("div")) {
            if (!div.hasClass("callout")) div.unwrap();
        }

        List<TocEntry> toc = new ArrayList<>();
        Set<String> used = new HashSet<>();
        for (Element h : doc.select("h2, h3")) {
            String text = h.text().trim();
            if (text.isEmpty()) continue;
            String id = SlugUtil.unique(SlugUtil.slugify(text), used::contains);
            used.add(id);
            h.attr("id", id);
            toc.add(new TocEntry(id, text, h.tagName().equals("h2") ? 2 : 3));
        }

        String text = doc.body().text().trim();
        int words = text.isEmpty() ? 0 : text.split("\\s+").length;
        int minutes = Math.max(1, (int) Math.ceil(words / 220.0));
        return new Processed(doc.body().html(), text, toc, minutes);
    }
}

package com.yaronengineering.blog.common;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class HtmlProcessorTest {
    private final HtmlProcessor processor = new HtmlProcessor();

    @Test
    void stripsScriptsAndEventHandlers() {
        var p = processor.process("<p onclick=\"evil()\">Hi</p><script>alert(1)</script><img src=\"javascript:alert(1)\"><a href=\"https://x.io\">x</a>");
        assertThat(p.html()).doesNotContain("script").doesNotContain("onclick").doesNotContain("javascript:");
        assertThat(p.html()).contains("rel=\"noopener noreferrer nofollow\"");
    }

    @Test
    void assignsStableHeadingIdsAndToc() {
        var p = processor.process("<h2>Why it matters</h2><h3>Why it matters</h3><h2>Next</h2>");
        assertThat(p.toc()).extracting(HtmlProcessor.TocEntry::id).containsExactly("why-it-matters", "why-it-matters-2", "next");
        assertThat(p.html()).contains("id=\"why-it-matters-2\"");
    }

    @Test
    void keepsCalloutsAndTables() {
        var p = processor.process("<div class=\"callout\" data-type=\"info\"><p>Note</p></div><div><p>plain</p></div><table><tr><td>1</td></tr></table>");
        assertThat(p.html()).contains("class=\"callout\"").contains("data-type=\"info\"").contains("<table>");
        assertThat(p.html()).doesNotContain("<div><p>plain");
    }

    @Test
    void computesReadingTime() {
        String words = "word ".repeat(660);
        assertThat(processor.process("<p>" + words + "</p>").readingTimeMinutes()).isEqualTo(3);
        assertThat(processor.process("<p>short</p>").readingTimeMinutes()).isEqualTo(1);
    }
}

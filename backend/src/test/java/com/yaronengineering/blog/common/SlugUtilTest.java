package com.yaronengineering.blog.common;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SlugUtilTest {
    @Test
    void slugifies() {
        assertThat(SlugUtil.slugify("Building Resilient Enterprise Networks")).isEqualTo("building-resilient-enterprise-networks");
        assertThat(SlugUtil.slugify("  Café & Résumé — 2026! ")).isEqualTo("cafe-resume-2026");
        assertThat(SlugUtil.slugify("!!!")).isEqualTo("item");
    }

    @Test
    void uniqueAppendsSuffix() {
        Set<String> existing = Set.of("a", "a-2");
        assertThat(SlugUtil.unique("a", existing::contains)).isEqualTo("a-3");
        assertThat(SlugUtil.unique("b", existing::contains)).isEqualTo("b");
    }
}

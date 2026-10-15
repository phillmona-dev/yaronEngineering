package com.yaronengineering.blog.common;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;

public final class SlugUtil {
    private SlugUtil() {}

    /** ASCII, lowercase, hyphen-separated slug. Returns "item" for inputs with no usable characters. */
    public static String slugify(String input) {
        if (input == null) return "item";
        String s = Normalizer.normalize(input, Normalizer.Form.NFKD).replaceAll("\\p{M}", "");
        s = s.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-+|-+$)", "");
        if (s.length() > 200) s = s.substring(0, 200).replaceAll("-+$", "");
        return s.isEmpty() ? "item" : s;
    }

    /** Appends -2, -3, … until {@code exists} returns false. */
    public static String unique(String base, Predicate<String> exists) {
        if (!exists.test(base)) return base;
        for (int i = 2; i < 10_000; i++) {
            String candidate = base + "-" + i;
            if (!exists.test(candidate)) return candidate;
        }
        return base + "-" + System.currentTimeMillis();
    }
}

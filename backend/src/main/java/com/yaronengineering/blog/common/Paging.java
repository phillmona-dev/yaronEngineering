package com.yaronengineering.blog.common;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class Paging {
    public static final int MAX_SIZE = 50;

    private Paging() {}

    public static Pageable of(Integer page, Integer size, Sort sort) {
        int p = page == null || page < 0 ? 0 : page;
        int s = size == null || size < 1 ? 12 : Math.min(size, MAX_SIZE);
        return sort == null ? PageRequest.of(p, s) : PageRequest.of(p, s, sort);
    }
}

package com.yaronengineering.blog.auth;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** In-memory sliding window: 10 login attempts per IP per minute. Sufficient for a single instance. */
@Component
public class LoginRateLimiter {
    private static final int LIMIT = 10;
    private static final long WINDOW_SECONDS = 60;
    private final Map<String, Deque<Instant>> attempts = new ConcurrentHashMap<>();

    public boolean allow(String ip) {
        Instant now = Instant.now();
        Deque<Instant> q = attempts.computeIfAbsent(ip, k -> new ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && q.peekFirst().isBefore(now.minusSeconds(WINDOW_SECONDS))) q.pollFirst();
            if (q.size() >= LIMIT) return false;
            q.addLast(now);
            return true;
        }
    }
}

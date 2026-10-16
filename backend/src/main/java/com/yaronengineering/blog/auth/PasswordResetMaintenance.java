package com.yaronengineering.blog.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

/** Purges reset tokens a day after they expire so the table stays small. */
@Component
public class PasswordResetMaintenance {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetMaintenance.class);
    private final PasswordResetTokenRepository tokens;
    private final Clock clock;

    public PasswordResetMaintenance(PasswordResetTokenRepository tokens, Clock clock) {
        this.tokens = tokens;
        this.clock = clock;
    }

    @Scheduled(fixedDelay = 6 * 60 * 60 * 1000L, initialDelay = 60_000)
    @Transactional
    public void purgeExpired() {
        int n = tokens.deleteExpiredBefore(Instant.now(clock).minus(Duration.ofDays(1)));
        if (n > 0) log.info("auth: purged {} expired password reset tokens", n);
    }
}

package com.yaronengineering.blog.publication;

import com.yaronengineering.blog.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;

import java.util.List;
import java.util.Map;

/** Notifies the Next.js frontend to revalidate cached pages. Best effort: never throws, never blocks editorial actions. */
@Component
public class RevalidationClient {
    private static final Logger log = LoggerFactory.getLogger(RevalidationClient.class);
    private final AppProperties props;
    // HTTP/1.1 explicitly: the JDK client's default h2c upgrade is rejected by Node-based frontends.
    private final RestClient client = RestClient.builder()
        .requestFactory(new JdkClientHttpRequestFactory(HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(5))
            .build()))
        .build();

    public RevalidationClient(AppProperties props) {
        this.props = props;
    }

    @Async
    public void revalidate(List<String> tags) {
        String url = props.revalidate().url();
        if (url == null || url.isBlank()) return;
        try {
            client.post().uri(url).body(Map.of("secret", props.revalidate().secret() == null ? "" : props.revalidate().secret(), "tags", tags))
                .retrieve().toBodilessEntity();
            log.info("revalidate: notified frontend tags={}", tags);
        } catch (Exception e) {
            log.warn("revalidate: frontend notification failed ({}): {}", url, e.getMessage());
        }
    }
}

package com.yaronengineering.blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

/** Serves locally stored media at /media/files/** with immutable one-year caching. */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AppProperties props;

    public WebConfig(AppProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String root = Path.of(props.media().storagePath()).toAbsolutePath().normalize().toUri().toString();
        if (!root.endsWith("/")) root = root + "/";
        registry.addResourceHandler("/media/files/**")
            .addResourceLocations(root)
            .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable());
    }
}

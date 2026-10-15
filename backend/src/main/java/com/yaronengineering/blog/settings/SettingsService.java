package com.yaronengineering.blog.settings;

import com.yaronengineering.blog.media.MediaDto;
import com.yaronengineering.blog.media.MediaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class SettingsService {
    private static final Logger log = LoggerFactory.getLogger(SettingsService.class);
    private static final Map<String, String> DEFAULTS = Map.of(
        "siteTitle", "Yaron Engineering PLC",
        "blogTitle", "Knowledge Hub",
        "blogTagline", "Perspectives from Yaron Engineering on infrastructure, cybersecurity, cloud, enterprise technology and digital transformation.",
        "newsletterHeading", "Stay ahead of the technology curve",
        "newsletterText", "Receive Yaron Engineering's latest insights on infrastructure, cybersecurity, cloud and enterprise technology."
    );

    private final SettingRepository settings;
    private final MediaRepository media;

    public SettingsService(SettingRepository settings, MediaRepository media) {
        this.settings = settings;
        this.media = media;
    }

    @Transactional(readOnly = true)
    public SettingsDto get() {
        Map<String, String> m = new HashMap<>(DEFAULTS);
        settings.findAll().forEach(s -> { if (s.getValue() != null) m.put(s.getKey(), s.getValue()); });
        MediaDto og = null;
        UUID ogId = null;
        if (m.containsKey("defaultOgImageId")) {
            try {
                ogId = UUID.fromString(m.get("defaultOgImageId"));
                og = media.findById(ogId).map(MediaDto::from).orElse(null);
            } catch (IllegalArgumentException ignored) { /* stale value */ }
        }
        return new SettingsDto(m.get("siteTitle"), m.get("blogTitle"), m.get("blogTagline"), m.get("newsletterHeading"), m.get("newsletterText"), og, ogId);
    }

    @Transactional
    public SettingsDto update(SettingsDto dto) {
        put("siteTitle", dto.siteTitle());
        put("blogTitle", dto.blogTitle());
        put("blogTagline", dto.blogTagline());
        put("newsletterHeading", dto.newsletterHeading());
        put("newsletterText", dto.newsletterText());
        put("defaultOgImageId", dto.defaultOgImageId() == null ? null : dto.defaultOgImageId().toString());
        log.info("admin: settings updated");
        return get();
    }

    private void put(String key, String value) {
        if (value == null) {
            settings.deleteById(key);
            return;
        }
        settings.findById(key).ifPresentOrElse(s -> s.setValue(value), () -> settings.save(Setting.of(key, value)));
    }
}

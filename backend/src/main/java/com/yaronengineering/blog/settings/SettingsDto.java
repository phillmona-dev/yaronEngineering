package com.yaronengineering.blog.settings;

import com.yaronengineering.blog.media.MediaDto;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record SettingsDto(@Size(max = 160) String siteTitle, @Size(max = 160) String blogTitle, @Size(max = 300) String blogTagline,
                          @Size(max = 160) String newsletterHeading, @Size(max = 400) String newsletterText, MediaDto defaultOgImage,
                          UUID defaultOgImageId) {}

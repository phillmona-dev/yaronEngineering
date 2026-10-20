package com.yaronengineering.blog.sitecontent;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yaronengineering.blog.auth.CurrentUser;
import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorCode;
import com.yaronengineering.blog.publication.RevalidationClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class SiteContentService {
    private static final Logger log = LoggerFactory.getLogger(SiteContentService.class);
    private static final Pattern SECTION = Pattern.compile("^[a-z][a-z0-9-]{1,59}$");
    /** Generous ceiling: the largest built-in section (projects) is ~40 KB. */
    private static final int MAX_BYTES = 512 * 1024;
    public static final String REVALIDATE_TAG = "site-content";

    private final SiteContentRepository repo;
    private final ObjectMapper mapper;
    private final RevalidationClient revalidation;
    private final Clock clock;

    public SiteContentService(SiteContentRepository repo, ObjectMapper mapper, RevalidationClient revalidation, Clock clock) {
        this.repo = repo;
        this.mapper = mapper;
        this.revalidation = revalidation;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<SiteContentDto> list() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    /** Public shape: { section: data, ... } — only what the site needs to merge. */
    @Transactional(readOnly = true)
    public Map<String, JsonNode> publicMap() {
        Map<String, JsonNode> out = new LinkedHashMap<>();
        for (SiteContent c : repo.findAll()) out.put(c.getSection(), parse(c.getData()));
        return out;
    }

    @Transactional(readOnly = true)
    public SiteContentDto get(String section) {
        validateSection(section);
        return repo.findById(section).map(this::toDto).orElseThrow(() -> ApiException.notFound("Content section"));
    }

    @Transactional
    public SiteContentDto put(String section, JsonNode data) {
        validateSection(section);
        if (data == null || !data.isObject())
            throw new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Content must be a JSON object");
        String json;
        try {
            json = mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Content is not valid JSON");
        }
        if (json.length() > MAX_BYTES)
            throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, ErrorCode.PAYLOAD_TOO_LARGE, "Content section is too large");
        String by = CurrentUser.current().map(CurrentUser::email).orElse(null);
        Instant now = Instant.now(clock);
        SiteContent row = repo.findById(section)
            .map(c -> { c.update(json, by, now); return c; })
            .orElseGet(() -> repo.save(SiteContent.of(section, json, by, now)));
        log.info("admin: site content '{}' updated by {}", section, by);
        revalidation.revalidate(List.of(REVALIDATE_TAG));
        return toDto(row);
    }

    /** Removing the row makes the site fall back to its built-in content for that section. */
    @Transactional
    public void reset(String section) {
        validateSection(section);
        if (!repo.existsById(section)) throw ApiException.notFound("Content section");
        repo.deleteById(section);
        log.info("admin: site content '{}' reset to defaults", section);
        revalidation.revalidate(List.of(REVALIDATE_TAG));
    }

    private void validateSection(String section) {
        if (section == null || !SECTION.matcher(section).matches())
            throw new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Invalid content section name");
    }

    private SiteContentDto toDto(SiteContent c) {
        return new SiteContentDto(c.getSection(), parse(c.getData()), c.getUpdatedAt(), c.getUpdatedBy());
    }

    private JsonNode parse(String json) {
        try {
            return mapper.readTree(json);
        } catch (JsonProcessingException e) {
            log.warn("site content: stored JSON is unreadable, treating as empty: {}", e.getMessage());
            return mapper.createObjectNode();
        }
    }
}

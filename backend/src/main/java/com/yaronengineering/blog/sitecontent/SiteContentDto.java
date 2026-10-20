package com.yaronengineering.blog.sitecontent;

import com.fasterxml.jackson.databind.JsonNode;

import java.time.Instant;

/** A section document plus its audit trail. `data` is the raw JSON the frontend merges over its defaults. */
public record SiteContentDto(String section, JsonNode data, Instant updatedAt, String updatedBy) {}

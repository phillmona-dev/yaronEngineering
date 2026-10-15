package com.yaronengineering.blog.common;

import java.time.Instant;
import java.util.List;

public record ErrorResponse(Instant timestamp, int status, ErrorCode code, String message, List<FieldError> errors) {
    public record FieldError(String field, String message) {}

    public static ErrorResponse of(int status, ErrorCode code, String message, List<FieldError> errors) {
        return new ErrorResponse(Instant.now(), status, code, message, errors == null ? List.of() : errors);
    }
}

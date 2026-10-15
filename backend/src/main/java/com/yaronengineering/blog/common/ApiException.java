package com.yaronengineering.blog.common;

import org.springframework.http.HttpStatus;

import java.util.List;

public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final ErrorCode code;
    private final List<ErrorResponse.FieldError> errors;

    public ApiException(HttpStatus status, ErrorCode code, String message) {
        this(status, code, message, List.of());
    }

    public ApiException(HttpStatus status, ErrorCode code, String message, List<ErrorResponse.FieldError> errors) {
        super(message);
        this.status = status;
        this.code = code;
        this.errors = errors;
    }

    public HttpStatus getStatus() { return status; }
    public ErrorCode getCode() { return code; }
    public List<ErrorResponse.FieldError> getErrors() { return errors; }

    public static ApiException notFound(String what) {
        return new ApiException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, what + " not found");
    }

    public static ApiException conflict(String message) {
        return new ApiException(HttpStatus.CONFLICT, ErrorCode.CONFLICT, message);
    }

    public static ApiException invalidState(String message) {
        return new ApiException(HttpStatus.CONFLICT, ErrorCode.INVALID_STATE, message);
    }

    public static ApiException forbidden(String message) {
        return new ApiException(HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, message);
    }

    public static ApiException validation(String message, List<ErrorResponse.FieldError> errors) {
        return new ApiException(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, message, errors);
    }
}

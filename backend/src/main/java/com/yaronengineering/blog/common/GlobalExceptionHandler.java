package com.yaronengineering.blog.common;

import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> api(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ErrorResponse.of(ex.getStatus().value(), ex.getCode(), ex.getMessage(), ex.getErrors()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex) {
        List<ErrorResponse.FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(f -> new ErrorResponse.FieldError(f.getField(), f.getDefaultMessage())).toList();
        return bad("Invalid request data", errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> constraint(ConstraintViolationException ex) {
        List<ErrorResponse.FieldError> errors = ex.getConstraintViolations().stream()
            .map(v -> new ErrorResponse.FieldError(v.getPropertyPath().toString(), v.getMessage())).toList();
        return bad("Invalid request data", errors);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MissingServletRequestParameterException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErrorResponse> unreadable(Exception ex) {
        return bad("Malformed request", List.of());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> badCredentials() {
        return ResponseEntity.status(401).body(ErrorResponse.of(401, ErrorCode.INVALID_CREDENTIALS, "Invalid email or password", List.of()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> denied() {
        return ResponseEntity.status(403).body(ErrorResponse.of(403, ErrorCode.FORBIDDEN, "You do not have permission to perform this action", List.of()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> tooLarge() {
        return ResponseEntity.status(413).body(ErrorResponse.of(413, ErrorCode.PAYLOAD_TOO_LARGE, "File exceeds the maximum allowed size", List.of()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> noResource() {
        return ResponseEntity.status(404).body(ErrorResponse.of(404, ErrorCode.NOT_FOUND, "Resource not found", List.of()));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> method() {
        return ResponseEntity.status(405).body(ErrorResponse.of(405, ErrorCode.VALIDATION_ERROR, "Method not allowed", List.of()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> generic(Exception ex) {
        log.error("Unhandled error: {}", ex.toString(), ex);
        return ResponseEntity.status(500).body(ErrorResponse.of(500, ErrorCode.INTERNAL_ERROR, "An unexpected error occurred", List.of()));
    }

    private ResponseEntity<ErrorResponse> bad(String message, List<ErrorResponse.FieldError> errors) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.of(400, ErrorCode.VALIDATION_ERROR, message, errors));
    }
}

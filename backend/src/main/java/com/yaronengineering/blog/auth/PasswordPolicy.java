package com.yaronengineering.blog.auth;

import com.yaronengineering.blog.common.ApiException;
import com.yaronengineering.blog.common.ErrorResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/** Shared rules for new passwords (change + reset). Kept deliberately simple and explainable in the UI. */
public final class PasswordPolicy {
    public static final int MIN_LENGTH = 10;
    public static final int MAX_LENGTH = 128;
    public static final String DESCRIPTION = "At least " + MIN_LENGTH + " characters, including a letter and a number.";

    private static final Set<String> DENYLIST = Set.of(
        "password123", "password1234", "changeme123", "qwerty12345", "admin123456", "1234567890", "letmein1234", "welcome123");

    private PasswordPolicy() {}

    /** @throws ApiException 400 VALIDATION_ERROR with a field error on {@code field} when the password is too weak. */
    public static void require(String password, String field) {
        List<String> problems = problems(password);
        if (problems.isEmpty()) return;
        List<ErrorResponse.FieldError> errors = new ArrayList<>();
        for (String p : problems) errors.add(new ErrorResponse.FieldError(field, p));
        throw ApiException.validation("The new password does not meet the password policy", errors);
    }

    public static List<String> problems(String password) {
        List<String> out = new ArrayList<>();
        if (password == null || password.isBlank()) {
            out.add("must not be blank");
            return out;
        }
        if (password.length() < MIN_LENGTH) out.add("must be at least " + MIN_LENGTH + " characters");
        if (password.length() > MAX_LENGTH) out.add("must be at most " + MAX_LENGTH + " characters");
        if (!password.chars().anyMatch(Character::isLetter)) out.add("must contain a letter");
        if (!password.chars().anyMatch(Character::isDigit)) out.add("must contain a number");
        if (DENYLIST.contains(password.toLowerCase())) out.add("is too common");
        return out;
    }
}

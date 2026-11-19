package com.sms.util;

import java.sql.Date;
import java.util.regex.Pattern;

/**
 * Utility class providing validation routines for form inputs.
 * Demonstrates:
 * - Regular Expressions in Java
 * - Defensive Programming
 * - Clean Code & Helper utilities
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^[+]?[0-9\\s-]{8,20}$");

    private static final Pattern STUDENT_ID_PATTERN =
            Pattern.compile("^[A-Za-z0-9_-]{3,20}$");

    private ValidationUtil() {}

    public static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public static boolean isValidEmail(String email) {
        if (!isNotEmpty(email)) return false;
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidPhone(String phone) {
        if (!isNotEmpty(phone)) return false;
        return PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    public static boolean isValidStudentId(String studentId) {
        if (!isNotEmpty(studentId)) return false;
        return STUDENT_ID_PATTERN.matcher(studentId.trim()).matches();
    }

    public static Date parseSqlDate(String dateStr) {
        if (!isNotEmpty(dateStr)) return null;
        try {
            return Date.valueOf(dateStr.trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}


package com.sms.util;

import com.sms.model.Student;

import java.util.List;
import java.util.Map;

/**
 * Built-in Lightweight JSON Serializer utility.
 * Eliminates external third-party JAR dependencies so this project runs
 * seamlessly in standard Tomcat or any college lab without configuration issues.
 */
public class JsonUtil {

    private JsonUtil() {}

    /**
     * Escapes special characters for JSON strings.
     */
    public static String escapeJson(String str) {
        if (str == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < ' ') {
                        String hex = Integer.toHexString(c);
                        sb.append("\\u");
                        for (int k = 0; k < 4 - hex.length(); k++) sb.append('0');
                        sb.append(hex);
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }

    /**
     * Serializes a Student object to a JSON string.
     */
    public static String studentToJson(Student s) {
        if (s == null) return "null";
        return "{" +
                "\"id\":" + s.getId() + "," +
                "\"studentId\":\"" + escapeJson(s.getStudentId()) + "\"," +
                "\"name\":\"" + escapeJson(s.getName()) + "\"," +
                "\"registerNo\":\"" + escapeJson(s.getRegisterNo()) + "\"," +
                "\"dob\":\"" + (s.getDob() != null ? s.getDob().toString() : "") + "\"," +
                "\"gender\":\"" + escapeJson(s.getGender()) + "\"," +
                "\"department\":\"" + escapeJson(s.getDepartment()) + "\"," +
                "\"year\":\"" + escapeJson(s.getYear()) + "\"," +
                "\"email\":\"" + escapeJson(s.getEmail()) + "\"," +
                "\"phone\":\"" + escapeJson(s.getPhone()) + "\"," +
                "\"address\":\"" + escapeJson(s.getAddress()) + "\"," +
                "\"status\":\"" + escapeJson(s.getStatus()) + "\"," +
                "\"createdAt\":\"" + (s.getCreatedAt() != null ? s.getCreatedAt().toString() : "") + "\"" +
                "}";
    }

    /**
     * Serializes a list of students to JSON array.
     */
    public static String studentListToJson(List<Student> list) {
        if (list == null) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append(studentToJson(list.get(i)));
            if (i < list.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Serializes dashboard statistics map to JSON.
     */
    @SuppressWarnings("unchecked")
    public static String dashboardStatsToJson(Map<String, Object> stats) {
        if (stats == null) return "{}";
        StringBuilder sb = new StringBuilder("{");

        sb.append("\"totalStudents\":").append(stats.getOrDefault("totalStudents", 0)).append(",");
        sb.append("\"activeStudents\":").append(stats.getOrDefault("activeStudents", 0)).append(",");
        sb.append("\"inactiveStudents\":").append(stats.getOrDefault("inactiveStudents", 0)).append(",");
        sb.append("\"graduatedStudents\":").append(stats.getOrDefault("graduatedStudents", 0)).append(",");
        sb.append("\"departmentCount\":").append(stats.getOrDefault("departmentCount", 0)).append(",");

        // Department distribution map
        sb.append("\"departmentDistribution\":{");
        Object deptDistObj = stats.get("departmentDistribution");
        if (deptDistObj instanceof Map) {
            Map<String, Integer> dist = (Map<String, Integer>) deptDistObj;
            int count = 0;
            for (Map.Entry<String, Integer> entry : dist.entrySet()) {
                if (count++ > 0) sb.append(",");
                sb.append("\"").append(escapeJson(entry.getKey())).append("\":").append(entry.getValue());
            }
        }
        sb.append("},");

        // Recent students
        sb.append("\"recentStudents\":");
        Object recentObj = stats.get("recentStudents");
        if (recentObj instanceof List) {
            sb.append(studentListToJson((List<Student>) recentObj));
        } else {
            sb.append("[]");
        }

        sb.append("}");
        return sb.toString();
    }

    /**
     * Generates a standard JSON response for API operations.
     */
    public static String responseJson(boolean success, String message, String dataJson) {
        return "{" +
                "\"success\":" + success + "," +
                "\"message\":\"" + escapeJson(message) + "\"" +
                (dataJson != null ? ",\"data\":" + dataJson : "") +
                "}";
    }
}


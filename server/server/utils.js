"use strict";
/**
 * Utility functions for the server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomId = generateRandomId;
exports.formatRelativeTime = formatRelativeTime;
/**
 * Generate a random ID for entities
 * @returns A random integer ID
 */
function generateRandomId() {
    return Math.floor(Math.random() * 10000) + 1;
}
/**
 * Format a date as a relative time string (e.g., "5 minutes ago")
 * @param date The date to format
 * @returns A human-readable relative time string
 */
function formatRelativeTime(date) {
    var now = new Date();
    var diffMs = now.getTime() - date.getTime();
    var diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1)
        return "just now";
    if (diffMins === 1)
        return "1 minute ago";
    if (diffMins < 60)
        return "".concat(diffMins, " minutes ago");
    var diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1)
        return "1 hour ago";
    if (diffHours < 24)
        return "".concat(diffHours, " hours ago");
    var diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1)
        return "yesterday";
    if (diffDays < 30)
        return "".concat(diffDays, " days ago");
    return date.toLocaleDateString();
}

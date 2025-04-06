/**
 * Utility functions for the server
 */

/**
 * Generate a random ID for entities
 * @returns A random integer ID
 */
export function generateRandomId(): number {
  return Math.floor(Math.random() * 10000) + 1;
}

/**
 * Format a date as a relative time string (e.g., "5 minutes ago")
 * @param date The date to format
 * @returns A human-readable relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins === 1) return "1 minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}
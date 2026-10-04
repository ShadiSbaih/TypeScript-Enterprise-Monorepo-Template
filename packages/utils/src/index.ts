import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { nanoid } from "nanoid";

/**
 * Merges Tailwind and conditional class names safely
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates prefixed unique entity IDs
 */
export function createId(prefix = "id"): string {
  return `${prefix}_${nanoid(16)}`;
}

/**
 * Formats a Date object or ISO string to standard human-readable format
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), "PPP");
}

/**
 * Formats relative time (e.g., '3 days ago')
 */
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Sleep helper for async retry loops and backoff
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

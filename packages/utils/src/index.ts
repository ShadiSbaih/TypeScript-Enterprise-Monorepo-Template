import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { nanoid } from "nanoid";
import type { TaskPriority, TaskStatus, Subtask } from "@repo/types";

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
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch {
    return String(date);
  }
}

/**
 * Formats relative time (e.g., '3 hours ago')
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Formats duration from minutes to human-readable string (e.g. '1h 30m')
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

/**
 * Returns color classes and styles for Task priorities
 */
export function getPriorityTheme(priority: TaskPriority): {
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
} {
  switch (priority) {
    case "urgent":
      return {
        label: "Urgent",
        bg: "bg-rose-500/10 dark:bg-rose-500/20",
        border: "border-rose-500/30",
        text: "text-rose-600 dark:text-rose-400",
        dot: "bg-rose-500"
      };
    case "high":
      return {
        label: "High",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        border: "border-amber-500/30",
        text: "text-amber-600 dark:text-amber-400",
        dot: "bg-amber-500"
      };
    case "medium":
      return {
        label: "Medium",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        border: "border-blue-500/30",
        text: "text-blue-600 dark:text-blue-400",
        dot: "bg-blue-500"
      };
    case "low":
    default:
      return {
        label: "Low",
        bg: "bg-slate-500/10 dark:bg-slate-500/20",
        border: "border-slate-500/30",
        text: "text-slate-600 dark:text-slate-400",
        dot: "bg-slate-400"
      };
  }
}

/**
 * Calculates completion percentage across subtasks
 */
export function calculateTaskProgress(subtasks: Subtask[]): number {
  if (!subtasks || subtasks.length === 0) return 0;
  const done = subtasks.filter((s) => s.completed).length;
  return Math.round((done / subtasks.length) * 100);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Formats large numbers: 1200 -> "1.2k"
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return count.toString();
}

// Safely serializes Server Action responses to avoid Next.js serialization errors
export function parseServerActionResponse<T>(response: T): T {
  return JSON.parse(JSON.stringify(response));
}

// Truncates text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
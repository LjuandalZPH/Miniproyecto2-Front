/**
 * Resolve a media URL (video or subtitle) that may be absolute or relative to the backend.
 *
 * Behavior:
 * - Absolute http/https URLs are returned as-is.
 * - Relative URLs are prefixed with VITE_API_URL.
 * - Empty values return an empty string (let the caller decide the fallback).
 *
 * @param url Optional media URL.
 * @returns Resolved absolute URL or an empty string.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url || url.trim() === "") return "";
  if (/^https?:\/\//i.test(url)) return url;

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const path = url.replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
}
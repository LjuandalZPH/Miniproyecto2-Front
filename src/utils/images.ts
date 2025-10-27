/**
 * Resolve an image URL that may be absolute or relative to the backend.
 *
 * Behavior:
 * - If the URL is absolute (http/https), return as-is.
 * - If the URL is relative, prefix it with VITE_API_URL.
 * - If the input is empty/invalid, return a local fallback image from /public.
 *
 * @param image Optional image URL (absolute or relative).
 * @returns A usable URL for <img src="...">.
 */
export function resolveImageUrl(image?: string | null): string {
  const fallback = `${import.meta.env.BASE_URL}MoovieNormal.png`;

  if (!image || image.trim() === "") return fallback;

  // Absolute URL
  if (/^https?:\/\//i.test(image)) return image;

  // Relative path -> prefix with backend base
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const path = image.replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
}
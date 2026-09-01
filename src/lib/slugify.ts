/**
 * Normalizes text into a clean URL-friendly slug.
 * Pure string utility function (client & server safe, zero node/DB dependencies).
 */
export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-post";
}

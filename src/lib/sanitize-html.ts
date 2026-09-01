import DOMPurify from "isomorphic-dompurify";

/**
 * Configuration options for HTML sanitization using DOMPurify.
 * Allows standard rich text elements and safe attributes while stripping scripts, iframes, inline event handlers, etc.
 */
const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong",
    "em",
    "u",
    "s",
    "strike",
    "sub",
    "sup",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "a",
    "img",
    "br",
    "hr",
    "span",
    "div",
    "figure",
    "figcaption",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "src",
    "alt",
    "title",
    "class",
    "width",
    "height",
    "align",
  ],
  ADD_ATTR: ["target"], // Ensure links open safely
};

/**
 * Sanitizes HTML content using isomorphic-dompurify to prevent XSS vulnerabilities.
 * Can be run safely on both client and server environments.
 *
 * @param html Dirty HTML string from editor or storage
 * @returns Clean, sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }
  return DOMPurify.sanitize(html, SANITIZE_OPTIONS);
}

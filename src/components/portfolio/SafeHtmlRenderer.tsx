import React from "react";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface SafeHtmlRendererProps {
  content: string;
  className?: string;
}

/**
 * SafeHtmlRenderer renders HTML content safely by sanitizing it at render time with DOMPurify.
 * This provides defense-in-depth on top of server-side sanitization on save.
 */
export function SafeHtmlRenderer({ content, className = "" }: SafeHtmlRendererProps) {
  if (!content) return null;

  // Render-time sanitization (defense-in-depth)
  const sanitizedHtml = sanitizeHtml(content);

  return (
    <div
      className={`prose prose-invert max-w-none text-zinc-300 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

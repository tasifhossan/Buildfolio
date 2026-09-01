import { prisma } from "@/lib/prisma";

/**
 * Normalizes text into a clean URL-friendly slug.
 */
export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-post";
}

/**
 * Generates a unique slug for a blog post within a specific portfolio.
 * Appends numerical suffixes (-1, -2, etc.) if a collision exists for that portfolio.
 *
 * @param portfolioId Portfolio ID
 * @param baseText Raw title or candidate slug string
 * @param excludePostId Optional post ID to exclude (used during updates)
 */
export async function getUniqueBlogPostSlug(
  portfolioId: string,
  baseText: string,
  excludePostId?: string
): Promise<string> {
  const baseSlug = slugify(baseText);
  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        portfolioId,
        slug: candidateSlug,
        ...(excludePostId ? { NOT: { id: excludePostId } } : {}),
      },
    });

    if (!existing) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }
}

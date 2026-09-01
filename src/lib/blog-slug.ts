import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export { slugify };

/**
 * Generates a unique slug for a blog post within a specific portfolio.
 * Appends numerical suffixes (-1, -2, etc.) if a collision exists for that portfolio.
 * Server-only database helper.
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

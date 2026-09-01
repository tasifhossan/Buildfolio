import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { getUniqueBlogPostSlug } from "@/lib/blog-slug";
import { revalidatePath } from "next/cache";

const createBlogPostSchema = z.object({
  title: z.string().optional().default("Untitled Post"),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  contentHtml: z.string().optional().default(""),
  coverImageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().optional().default(false),
});

/**
 * GET /api/portfolio/blog
 * Fetch all blog posts for the currently authenticated user's portfolio.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const posts = await prisma.blogPost.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portfolio/blog
 * Create a new draft or published blog post for the current user's portfolio.
 */
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const parseResult = createBlogPostSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      title,
      slug: customSlug,
      excerpt,
      contentHtml,
      coverImageUrl,
      isPublished,
    } = parseResult.data;

    // Retrieve portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Generate unique slug per portfolio
    const baseText = customSlug && customSlug.trim() ? customSlug : title;
    const finalSlug = await getUniqueBlogPostSlug(portfolio.id, baseText);

    // Sanitize HTML content server-side with DOMPurify
    const sanitizedContent = sanitizeHtml(contentHtml);

    // Handle publishedAt timestamp
    const publishedAt = isPublished ? new Date() : null;

    const newPost = await prisma.blogPost.create({
      data: {
        portfolioId: portfolio.id,
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        contentHtml: sanitizedContent,
        coverImageUrl: coverImageUrl || null,
        isPublished,
        publishedAt,
      },
    });

    revalidatePath(`/${portfolio.slug}`);
    revalidatePath(`/${portfolio.slug}/blog`);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

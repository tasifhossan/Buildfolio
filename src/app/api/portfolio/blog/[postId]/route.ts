import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { getUniqueBlogPostSlug } from "@/lib/blog-slug";
import { revalidatePath } from "next/cache";

const updateBlogPostSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  contentHtml: z.string().optional(),
  coverImageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ postId: string }>;
}

/**
 * PATCH /api/portfolio/blog/[postId]
 * Update an existing blog post (title, content, cover, published status).
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { postId } = await params;

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required" },
      { status: 400 }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parseResult = updateBlogPostSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    // Retrieve user's portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Verify ownership of the target post
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        portfolioId: portfolio.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found or unauthorized" },
        { status: 404 }
      );
    }

    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      contentHtml?: string;
      coverImageUrl?: string | null;
      isPublished?: boolean;
      publishedAt?: Date | null;
    } = {};

    const {
      title,
      slug,
      excerpt,
      contentHtml,
      coverImageUrl,
      isPublished,
    } = parseResult.data;

    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;

    // Handle slug update & uniqueness check per portfolio
    if (slug !== undefined && slug.trim() !== existingPost.slug) {
      updateData.slug = await getUniqueBlogPostSlug(
        portfolio.id,
        slug,
        existingPost.id
      );
    } else if (title !== undefined && !existingPost.slug) {
      updateData.slug = await getUniqueBlogPostSlug(
        portfolio.id,
        title,
        existingPost.id
      );
    }

    // Server-side HTML sanitization with DOMPurify on every save
    if (contentHtml !== undefined) {
      updateData.contentHtml = sanitizeHtml(contentHtml);
    }

    // Handle isPublished & publishedAt transition rules
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;

      // On publish (isPublished transitioning to true), set publishedAt to now if not already set
      if (isPublished && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: updateData,
    });

    revalidatePath(`/${portfolio.slug}`);
    revalidatePath(`/${portfolio.slug}/blog`);
    if (updatedPost.slug) {
      revalidatePath(`/${portfolio.slug}/blog/${updatedPost.slug}`);
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/portfolio/blog/[postId]
 * Delete a blog post owned by the current user's portfolio.
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { postId } = await params;

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required" },
      { status: 400 }
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

    // Verify ownership
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        portfolioId: portfolio.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    revalidatePath(`/${portfolio.slug}`);
    revalidatePath(`/${portfolio.slug}/blog`);

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

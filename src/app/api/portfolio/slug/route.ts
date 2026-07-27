import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { revalidatePath } from "next/cache";

const SLUG_REGEX = /^[a-z0-9-]{3,30}$/;

export async function PATCH(req: Request) {
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
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { newSlug } = body;

    if (!newSlug) {
      return NextResponse.json(
        { error: "newSlug parameter is required" },
        { status: 400 }
      );
    }

    const slug = newSlug.trim().toLowerCase();

    // 1. Format validation
    if (!SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: "Slug must be between 3 and 30 characters and contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // 2. Reserved-word check
    if (isReservedSlug(slug)) {
      return NextResponse.json(
        { error: "This slug is reserved and cannot be used" },
        { status: 400 }
      );
    }

    // Fetch user's current portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // If new slug is identical to current, return success early
    if (slug === portfolio.slug) {
      return NextResponse.json(portfolio);
    }

    // 3. Collision check
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (existingPortfolio && existingPortfolio.userId !== session.user.id) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    // 4. Cooldown (30 days) check
    if (portfolio.slugUpdatedAt) {
      const cooldownMs = 30 * 24 * 60 * 60 * 1000;
      const timeSinceLastUpdate = Date.now() - new Date(portfolio.slugUpdatedAt).getTime();
      if (timeSinceLastUpdate < cooldownMs) {
        const daysRemaining = Math.ceil((cooldownMs - timeSinceLastUpdate) / (24 * 60 * 60 * 1000));
        return NextResponse.json(
          { error: `You must wait ${daysRemaining} day(s) before changing your username again.` },
          { status: 429 }
        );
      }
    }

    // 5. Transaction execution
    const updatedPortfolio = await prisma.$transaction(async (tx) => {
      // Create a SlugHistory record of the old slug
      await tx.slugHistory.create({
        data: {
          oldSlug: portfolio.slug,
          portfolioId: portfolio.id,
        },
      });

      // Update Portfolio slug and slugUpdatedAt
      return await tx.portfolio.update({
        where: { id: portfolio.id },
        data: {
          slug,
          slugUpdatedAt: new Date(),
        },
      });
    });

    // 6. Revalidate cached paths
    revalidatePath(`/${portfolio.slug}`);
    revalidatePath(`/${slug}`);

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error("Error changing slug:", error);
    return NextResponse.json(
      { error: "Failed to change username" },
      { status: 500 }
    );
  }
}

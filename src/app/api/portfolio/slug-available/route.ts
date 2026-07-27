import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isReservedSlug } from "@/lib/reserved-slugs";

const SLUG_REGEX = /^[a-z0-9-]{3,30}$/;

export async function GET(req: Request) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const { searchParams } = new URL(req.url);
  const slugParam = searchParams.get("slug");

  if (!slugParam) {
    return NextResponse.json(
      { available: false, reason: "Slug parameter is required" },
      { status: 400 }
    );
  }

  const slug = slugParam.trim().toLowerCase();

  // 1. Format validation
  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({
      available: false,
      reason: "Slug must be between 3 and 30 characters and contain only lowercase letters, numbers, and hyphens",
    });
  }

  // 2. Blocklist validation
  if (isReservedSlug(slug)) {
    return NextResponse.json({
      available: false,
      reason: "This slug is reserved and cannot be used",
    });
  }

  try {
    // 3. Database validation
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (existingPortfolio) {
      // If it exists, exclude the current user's own portfolio
      if (currentUserId && existingPortfolio.userId === currentUserId) {
        return NextResponse.json({ available: true });
      }
      return NextResponse.json({
        available: false,
        reason: "This username is already taken",
      });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json(
      { available: false, reason: "Failed to check slug availability" },
      { status: 500 }
    );
  }
}

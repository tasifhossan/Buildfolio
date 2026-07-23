import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const visibilitySchema = z.object({
  isVisible: z.boolean({
    message: "isVisible must be a boolean",
  }),
});

interface RouteParams {
  params: Promise<{ sectionId: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { sectionId } = await params;

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parseResult = visibilitySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { isVisible } = parseResult.data;

    // 1. Fetch user's portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // 2. Fetch the section
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    // 3. Verify the section belongs to the current user's portfolio
    if (section.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Forbidden: Section does not belong to your portfolio" },
        { status: 403 }
      );
    }

    // 4. Update the section's visibility
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { isVisible },
    });

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error("Error updating section visibility:", error);
    return NextResponse.json(
      { error: "Failed to update section visibility" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reorderSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string().min(1, "Section ID must be a string"),
      order: z.number().int("Order must be an integer"),
    })
  ),
});

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

    const parseResult = reorderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { sections } = parseResult.data;

    // 1. Fetch the user's portfolio first
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
      include: {
        sections: {
          select: { id: true },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // 2. Verify every section id belongs to a Section whose portfolioId matches the current user's Portfolio
    const userSectionIds = new Set(portfolio.sections.map((s) => s.id));
    for (const item of sections) {
      if (!userSectionIds.has(item.id)) {
        return NextResponse.json(
          { error: "Forbidden: One or more section IDs do not belong to your portfolio" },
          { status: 403 }
        );
      }
    }

    // 3. Inside a transaction, update each section's order field to match the new array
    await prisma.$transaction(
      sections.map((section) =>
        prisma.section.update({
          where: { id: section.id },
          data: { order: section.order },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Sections reordered successfully" });
  } catch (error) {
    console.error("Error reordering sections:", error);
    return NextResponse.json(
      { error: "Failed to reorder sections" },
      { status: 500 }
    );
  }
}

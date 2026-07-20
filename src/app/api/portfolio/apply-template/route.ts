import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

const applyTemplateSchema = z.object({
  templateId: z.string({
    message: "templateId must be a string",
  }).min(1, "templateId cannot be empty"),
});

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
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parseResult = applyTemplateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { templateId } = parseResult.data;

    // Verify the Template exists and isActive is true (404 if not)
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        templateSections: true,
      },
    });

    if (!template || !template.isActive) {
      return NextResponse.json(
        { error: "Template not found or is inactive" },
        { status: 404 }
      );
    }

    // Fetch the current user's Portfolio by userId from the session
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Update inside a Prisma transaction
    const updatedPortfolio = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing Section rows for that portfolio
      await tx.section.deleteMany({
        where: { portfolioId: portfolio.id },
      });

      // 2. Create new Section rows copying type, order, and content from TemplateSection rows
      if (template.templateSections.length > 0) {
        await tx.section.createMany({
          data: template.templateSections.map((ts) => ({
            portfolioId: portfolio.id,
            type: ts.type,
            order: ts.order,
            isVisible: true,
            content: ts.content as Prisma.InputJsonValue,
          })),
        });
      }

      // 3. Update Portfolio.templateId
      return await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { templateId: template.id },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error("Error applying template:", error);
    return NextResponse.json(
      { error: "Failed to apply template" },
      { status: 500 }
    );
  }
}

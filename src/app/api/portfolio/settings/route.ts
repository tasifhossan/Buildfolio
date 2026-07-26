import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const settingsSchema = z.object({
  themeColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color code (e.g. #6366f1)")
    .optional()
    .or(z.literal("")),
  fontFamily: z
    .enum(["sans", "serif", "mono"])
    .optional()
    .or(z.literal("")),
  seoTitle: z.string().max(100, "SEO Title cannot exceed 100 characters").optional().or(z.literal("")),
  seoDescription: z.string().max(200, "SEO Description cannot exceed 200 characters").optional().or(z.literal("")),
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

    const parseResult = settingsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { themeColor, fontFamily, seoTitle, seoDescription } = parseResult.data;

    // Fetch user's portfolio to check ownership and get the slug
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Upsert the Settings row for this portfolio
    const updatedSettings = await prisma.settings.upsert({
      where: { portfolioId: portfolio.id },
      update: {
        themeColor: themeColor || null,
        fontFamily: fontFamily || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
      create: {
        portfolioId: portfolio.id,
        themeColor: themeColor || null,
        fontFamily: fontFamily || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });

    // Revalidate the public portfolio page path
    revalidatePath(`/${portfolio.slug}`);

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

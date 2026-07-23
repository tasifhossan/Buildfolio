import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSectionSchema = z.object({
  type: z.string().min(1, "Type is required").refine(
    (val) => ["hero", "about", "projects", "contact"].includes(val.toLowerCase()),
    {
      message: "Type must be one of: hero, about, projects, contact",
    }
  ),
});

const DEFAULT_CONTENTS: Record<string, any> = {
  hero: {
    title: "Welcome to my portfolio",
    subtitle: "I build high-quality digital experiences.",
    ctaText: "",
  },
  about: {
    bio: "No biography provided yet.",
    skills: [],
  },
  projects: {
    title: "Projects",
    list: [],
  },
  contact: {
    title: "Contact",
    email: "",
    github: "",
    linkedin: "",
  },
};

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

    const parseResult = createSectionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { type } = parseResult.data;
    const typeKey = type.toLowerCase();
    const normalizedType = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
    const content = DEFAULT_CONTENTS[typeKey];

    // Fetch user's portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Find current max order
    const aggregateResult = await prisma.section.aggregate({
      where: { portfolioId: portfolio.id },
      _max: {
        order: true,
      },
    });

    const maxOrder = aggregateResult._max.order ?? 0;
    const newOrder = maxOrder + 1;

    // Create the new section
    const newSection = await prisma.section.create({
      data: {
        portfolioId: portfolio.id,
        type: normalizedType,
        order: newOrder,
        isVisible: true,
        content,
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

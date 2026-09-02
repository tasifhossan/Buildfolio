import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const HeroContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
});

const AboutContentSchema = z.object({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

const ProjectItemSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
});

const ProjectsContentSchema = z.object({
  title: z.string().optional(),
  layout: z.enum(["grid", "list", "carousel"]).optional(),
  list: z.array(ProjectItemSchema).optional(),
  items: z.array(ProjectItemSchema).optional(),
});

const ContactContentSchema = z.object({
  title: z.string().optional(),
  email: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

const ExperienceItemSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  startMonth: z.number().int().min(1, "Start month must be between 1 and 12").max(12, "Start month must be between 1 and 12"),
  startYear: z.number().int(),
  endMonth: z.number().int().min(1, "End month must be between 1 and 12").max(12, "End month must be between 1 and 12").optional(),
  endYear: z.number().int().optional(),
  isCurrent: z.boolean(),
  description: z.string(),
}).refine(
  (data) => {
    if (data.isCurrent) {
      return true;
    }
    return data.endMonth !== undefined && data.endYear !== undefined;
  },
  {
    message: "End month and year are required if this is not your current role",
    path: ["endMonth"],
  }
);

const ExperienceContentSchema = z.object({
  layout: z.enum(["timeline", "list"]).optional(),
  items: z.array(ExperienceItemSchema).optional(),
});

const TestimonialItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  quote: z.string().min(1, "Quote is required"),
  photoUrl: z.string().optional(),
});

const TestimonialsContentSchema = z.object({
  layout: z.enum(["grid", "carousel"]).optional(),
  items: z.array(TestimonialItemSchema).optional(),
});

const BlogTeaserContentSchema = z.object({
  title: z.string().optional().default("From the Blog"),
  postCount: z.number().int().min(1, "Post count must be at least 1").max(6, "Post count must be at most 6").optional().default(3),
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

    const { content } = body;
    if (!content) {
      return NextResponse.json(
        { error: "Content field is required" },
        { status: 400 }
      );
    }

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

    // 3. Verify ownership: must belong to the current user's portfolio
    if (section.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Forbidden: Section does not belong to your portfolio" },
        { status: 403 }
      );
    }

    // 4. Validate content against schema
    let parseResult;
    const type = section.type.toLowerCase();
    
    if (type === "hero") {
      parseResult = HeroContentSchema.safeParse(content);
    } else if (type === "about") {
      parseResult = AboutContentSchema.safeParse(content);
    } else if (type === "projects") {
      parseResult = ProjectsContentSchema.safeParse(content);
    } else if (type === "contact") {
      parseResult = ContactContentSchema.safeParse(content);
    } else if (type === "experience") {
      parseResult = ExperienceContentSchema.safeParse(content);
    } else if (type === "testimonials") {
      parseResult = TestimonialsContentSchema.safeParse(content);
    } else if (type === "blogteaser" || type === "blog_teaser") {
      parseResult = BlogTeaserContentSchema.safeParse(content);
    } else {
      return NextResponse.json({ error: "Unknown section type" }, { status: 400 });
    }

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message || "Invalid content structure" },
        { status: 400 }
      );
    }

    // 5. Update the Section
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: {
        content: parseResult.data,
      },
    });

    revalidatePath(`/${portfolio.slug}`);

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { sectionId } = await params;

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

    // 3. Verify ownership: must belong to the current user's portfolio
    if (section.portfolioId !== portfolio.id) {
      return NextResponse.json(
        { error: "Forbidden: Section does not belong to your portfolio" },
        { status: 403 }
      );
    }

    // 4. Delete the section
    await prisma.section.delete({
      where: { id: sectionId },
    });

    revalidatePath(`/${portfolio.slug}`);

    return NextResponse.json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}

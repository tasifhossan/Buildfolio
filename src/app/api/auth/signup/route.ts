import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize base slug from email (e.g. john.doe@example.com -> john-doe)
    const emailPrefix = email.split("@")[0] || "user";
    const baseSlug = emailPrefix
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")  // Replace non-alphanumeric with hyphen
      .replace(/-+/g, "-")         // Replace consecutive hyphens with a single one
      .replace(/^-+|-+$/g, "")     // Remove leading/trailing hyphens
      || "user";                   // Fallback to "user" if slug is empty

    // Perform database operations inside a transaction to ensure atomic signup
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Generate a unique slug checking for collisions in database
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existingPortfolio = await tx.portfolio.findUnique({
          where: { slug },
        });
        if (!existingPortfolio) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create the User
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
        },
      });

      // Create the Portfolio
      const portfolio = await tx.portfolio.create({
        data: {
          userId: user.id,
          slug,
          templateId: null,
        },
      });

      return { user, portfolio };
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
        },
        portfolio: {
          id: result.portfolio.id,
          slug: result.portfolio.slug,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}

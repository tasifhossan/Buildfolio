import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Server-only helper function to retrieve the authenticated user's portfolio.
 * Throws or redirects to login if the session is unauthenticated.
 */
export async function getCurrentUserPortfolio() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      sections: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!portfolio) {
    throw new Error("Portfolio not found for the authenticated user.");
  }

  return portfolio;
}

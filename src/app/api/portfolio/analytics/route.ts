import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Fetch daily analytics for the last 30 days
    const analytics = await prisma.dailyAnalytics.findMany({
      where: {
        portfolioId: portfolio.id,
      },
      orderBy: {
        date: "asc",
      },
      take: 30,
    });

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("[Portfolio Analytics GET API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

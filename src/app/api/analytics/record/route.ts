import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { portfolioId, type } = await request.json();

    if (!portfolioId || (type !== "view" && type !== "click")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Truncate timestamp to start of today in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.dailyAnalytics.upsert({
      where: {
        portfolioId_date: {
          portfolioId,
          date: today,
        },
      },
      update: {
        views: type === "view" ? { increment: 1 } : undefined,
        clicks: type === "click" ? { increment: 1 } : undefined,
      },
      create: {
        portfolioId,
        date: today,
        views: type === "view" ? 1 : 0,
        clicks: type === "click" ? 1 : 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Analytics Record API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortfolioRenderer } from "@/components/portfolio-renderer";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { settings: true },
  });
  
  if (!portfolio) {
    return {
      title: "Portfolio Not Found",
    };
  }
  
  return {
    title: portfolio.settings?.seoTitle || `${username}'s Portfolio`,
    description: portfolio.settings?.seoDescription || `Welcome to ${username}'s portfolio.`,
  };
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
      settings: true,
    },
  });

  if (!portfolio) {
    notFound();
  }

  // Sanitizing sections and settings to prevent leaking internal database/auth fields
  const sanitizedSections = portfolio.sections.map((section) => ({
    type: section.type,
    content: section.content,
  }));

  const sanitizedSettings = portfolio.settings
    ? {
        themeColor: portfolio.settings.themeColor,
        fontFamily: portfolio.settings.fontFamily,
      }
    : null;

  return (
    <PortfolioRenderer
      sections={sanitizedSections}
      settings={sanitizedSettings}
      username={username}
    />
  );
}

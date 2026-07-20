import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SectionRenderer } from "@/components/portfolio/SectionRenderer";
import { PortfolioHeader } from "@/components/portfolio/sections/PortfolioHeader";
import Link from "next/link";
import type { Metadata } from "next";
import React from "react";

export const revalidate = 60; // Regenerate pages at most once per minute

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

  // Sanitizing sections to prevent leaking internal database/auth fields
  const sanitizedSections = portfolio.sections.map((section) => ({
    type: section.type,
    content: section.content,
  }));

  // Layout Configuration Settings
  const themeColor = portfolio.settings?.themeColor || "#6366f1"; // Default to Indigo
  const fontFamily = portfolio.settings?.fontFamily || "sans";

  const customStyles = {
    "--theme-primary": themeColor,
    "--theme-primary-hover": `${themeColor}e0`, // slightly lighter/darker
    "--theme-primary-glow": `${themeColor}20`,  // glow background
  } as React.CSSProperties;

  const fontClass = fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";

  const menuLinks = sanitizedSections.map((s) => ({
    name: s.type,
    id: s.type.toLowerCase(),
  }));

  return (
    <div
      style={customStyles}
      className={`min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[var(--theme-primary)] selection:text-white ${fontClass}`}
    >
      <PortfolioHeader username={username} menuLinks={menuLinks} />

      <main className="pb-24">
        {sanitizedSections.map((section) => (
          <SectionRenderer key={section.type} section={section} />
        ))}
      </main>

      <footer className="border-t border-zinc-900 py-12 bg-zinc-950/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 font-light">
            &copy; {new Date().getFullYear()} {username}. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 hover:text-[var(--theme-primary)] transition-colors duration-150"
          >
            Powered by Buildfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}

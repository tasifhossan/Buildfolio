import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortfolioThemeWrapper } from "@/components/portfolio/PortfolioThemeWrapper";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import React from "react";
import { Calendar, ArrowLeft, BookOpen } from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { settings: true, user: { select: { name: true } } },
  });

  if (!portfolio) {
    return {
      title: "Blog Not Found",
    };
  }

  const name = portfolio.user?.name || username;

  return {
    title: `Blog | ${name}`,
    description: portfolio.settings?.seoDescription || `Read articles and blog posts by ${name}.`,
  };
}

export default async function PublicBlogListPage({ params }: PageProps) {
  const { username } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: {
      settings: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!portfolio) {
    const slugHistoryEntry = await prisma.slugHistory.findUnique({
      where: { oldSlug: username },
      include: {
        portfolio: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (slugHistoryEntry?.portfolio) {
      redirect(`/${slugHistoryEntry.portfolio.slug}/blog`);
    }

    notFound();
  }

  const posts = await prisma.blogPost.findMany({
    where: {
      portfolioId: portfolio.id,
      isPublished: true,
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  const themeColor = portfolio.settings?.themeColor || "#6366f1";
  const fontFamily = portfolio.settings?.fontFamily || "sans";

  const customStyles = {
    "--theme-primary": themeColor,
    "--theme-primary-hover": `${themeColor}e0`,
    "--theme-primary-glow": `${themeColor}20`,
  } as React.CSSProperties;

  const fontClass = fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";
  const authorName = portfolio.user?.name || username;

  return (
    <PortfolioThemeWrapper fontClass={fontClass} customStyles={customStyles}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        {/* Navigation Bar */}
        <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href={`/${username}`}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>

            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              {authorName}&apos;s Blog
            </span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full space-y-12">
          {/* Header Section */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary-glow)] border border-[var(--theme-primary)]/20 text-[var(--theme-primary)] text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Articles & Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Latest Blog Posts
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Thoughts, tutorials, and articles written by {authorName}.
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 max-w-md mx-auto space-y-4">
              <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-300">No blog posts published yet</h3>
                <p className="text-xs text-zinc-500">Check back later for new updates and articles!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const dateStr = post.publishedAt || post.createdAt;
                const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Link
                    key={post.id}
                    href={`/${username}/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700/80 transition-all overflow-hidden duration-200"
                  >
                    {/* Cover Thumbnail */}
                    {post.coverImageUrl ? (
                      <div className="relative w-full h-44 bg-zinc-950 overflow-hidden">
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-800/60 flex items-center justify-center p-6 text-zinc-700 group-hover:text-[var(--theme-primary)] transition-colors">
                        <BookOpen className="w-12 h-12 opacity-40" />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <time dateTime={new Date(dateStr).toISOString()}>{formattedDate}</time>
                        </div>
                        <h2 className="text-lg font-bold text-zinc-100 group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 text-xs font-medium text-[var(--theme-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read article</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-8 bg-zinc-950/40">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600 font-light">
              &copy; {new Date().getFullYear()} {authorName}. All rights reserved.
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
    </PortfolioThemeWrapper>
  );
}

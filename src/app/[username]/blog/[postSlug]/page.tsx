import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortfolioThemeWrapper } from "@/components/portfolio/PortfolioThemeWrapper";
import { SafeHtmlRenderer } from "@/components/portfolio/SafeHtmlRenderer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import React from "react";
import { Calendar, ArrowLeft, User } from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ username: string; postSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, postSlug } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    select: { id: true, slug: true, user: { select: { name: true } } },
  });

  if (!portfolio) {
    return {
      title: "Post Not Found",
    };
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      portfolioId: portfolio.id,
      slug: postSlug,
      isPublished: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const authorName = portfolio.user?.name || username;

  return {
    title: `${post.title} | ${authorName}`,
    description: post.excerpt || `Read ${post.title} by ${authorName} on Buildfolio.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Article by ${authorName}`,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
    },
  };
}

export default async function PublicBlogPostPage({ params }: PageProps) {
  const { username, postSlug } = await params;

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
    notFound();
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      portfolioId: portfolio.id,
      slug: postSlug,
      isPublished: true,
    },
  });

  // Return notFound() if post doesn't exist or is not published
  if (!post || !post.isPublished) {
    notFound();
  }

  const themeColor = portfolio.settings?.themeColor || "#6366f1";
  const fontFamily = portfolio.settings?.fontFamily || "sans";

  const customStyles = {
    "--theme-primary": themeColor,
    "--theme-primary-hover": `${themeColor}e0`,
    "--theme-primary-glow": `${themeColor}20`,
  } as React.CSSProperties;

  const fontClass = fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";
  const authorName = portfolio.user?.name || username;

  const dateStr = post.publishedAt || post.createdAt;
  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PortfolioThemeWrapper fontClass={fontClass} customStyles={customStyles}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        {/* Navigation Bar */}
        <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href={`/${username}/blog`}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Articles</span>
            </Link>

            <Link
              href={`/${username}`}
              className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
            >
              {authorName}
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
          {/* Post Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <User className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                {authorName}
              </span>
              <span>&bull;</span>
              <time dateTime={new Date(dateStr).toISOString()} className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {formattedDate}
              </time>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light border-l-2 border-[var(--theme-primary)] pl-4 italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Optional Cover Image */}
          {post.coverImageUrl && (
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Post Body with Render-Time DOMPurify Sanitization */}
          <article className="pt-4 border-t border-zinc-900">
            <SafeHtmlRenderer content={post.contentHtml} />
          </article>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-8 bg-zinc-950/40">
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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

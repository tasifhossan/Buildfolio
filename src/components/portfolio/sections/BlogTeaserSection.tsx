import React from "react";
import { prisma } from "@/lib/prisma";
import type { BlogTeaserContent } from "../SectionRenderer";
import { BlogTeaserCarousel } from "./BlogTeaserCarousel";

interface BlogTeaserSectionProps {
  content: BlogTeaserContent;
  portfolioId?: string;
  username?: string;
}

export async function BlogTeaserSection({
  content,
  portfolioId,
  username,
}: BlogTeaserSectionProps) {
  const title = content.title || "From the Blog";
  const postCount = Math.min(Math.max(content.postCount ?? 3, 1), 6);

  let targetPortfolioId = portfolioId;
  let targetUsername = username || "";

  if (!targetPortfolioId && targetUsername) {
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: targetUsername },
      select: { id: true },
    });
    targetPortfolioId = portfolio?.id;
  }

  if (!targetPortfolioId) {
    return null;
  }

  const posts = await prisma.blogPost.findMany({
    where: {
      portfolioId: targetPortfolioId,
      isPublished: true,
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: postCount,
  });

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      id="blogteaser"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <span
            className="w-1.5 h-8 rounded-full"
            style={{ backgroundColor: "var(--theme-primary, #6366f1)" }}
          ></span>
          {title}
        </h2>

        <BlogTeaserCarousel posts={posts} username={targetUsername} />
      </div>
    </section>
  );
}

export default BlogTeaserSection;

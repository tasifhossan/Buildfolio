"use client";

import React, { useEffect, useState } from "react";
import type { BlogTeaserContent } from "../SectionRenderer";
import { BlogTeaserCarousel, PostItem } from "./BlogTeaserCarousel";

interface BlogTeaserSectionProps {
  content: BlogTeaserContent;
  portfolioId?: string;
  username?: string;
}

export function BlogTeaserSection({
  content,
  portfolioId,
  username,
}: BlogTeaserSectionProps) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const title = content.title || "From the Blog";
  const postCount = Math.min(Math.max(content.postCount ?? 3, 1), 6);

  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      try {
        const queryParams = new URLSearchParams();
        if (portfolioId) queryParams.set("portfolioId", portfolioId);
        if (username) queryParams.set("username", username);

        const url = `/api/portfolio/blog${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setPosts(data);
          }
        }
      } catch {
        // Ignore fetch errors
      } finally {
        if (isMounted) setLoaded(true);
      }
    }

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, [portfolioId, username]);

  if (!loaded || posts.length === 0) {
    return null;
  }

  const displayedPosts = posts.slice(0, postCount);

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

        <BlogTeaserCarousel posts={displayedPosts} username={username || ""} />
      </div>
    </section>
  );
}

export default BlogTeaserSection;

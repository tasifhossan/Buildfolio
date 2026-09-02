"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | string | null;
}

interface BlogTeaserCarouselProps {
  posts: PostItem[];
  username: string;
}

export function ArrowButton({
  direction,
  onClick,
  ariaLabel,
}: {
  direction: "left" | "right";
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition duration-150 shadow-md backdrop-blur-sm cursor-pointer shrink-0"
      type="button"
    >
      {direction === "left" ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </button>
  );
}

export function BlogTeaserCarousel({ posts, username }: BlogTeaserCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75;
      trackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      {posts.length > 1 && (
        <div className="flex items-center gap-2 mb-4 justify-end">
          <ArrowButton
            direction="left"
            onClick={() => scroll("left")}
            ariaLabel="Previous posts"
          />
          <ArrowButton
            direction="right"
            onClick={() => scroll("right")}
            ariaLabel="Next posts"
          />
        </div>
      )}

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${username}/blog/${post.slug}`}
            className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] flex flex-col bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 group/card"
          >
            <div className="w-full aspect-video overflow-hidden border-b border-zinc-900 bg-zinc-950 relative flex items-center justify-center">
              {post.coverImageUrl ? (
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-zinc-700 transition-colors duration-300 group-hover/card:text-zinc-500">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Published"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-100 group-hover/card:text-indigo-400 transition-colors duration-150 line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-zinc-400 font-light line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-900/50 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-primary)] opacity-80 group-hover/card:opacity-100 transition-opacity">
                <span>Read Article</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BlogTeaserCarousel;

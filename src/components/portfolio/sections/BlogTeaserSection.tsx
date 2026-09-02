import React, { useEffect, useState } from "react";
import { BookOpen, Calendar } from "lucide-react";

export interface BlogTeaserContent {
  title?: string;
  postCount?: number;
}

interface BlogTeaserSectionProps {
  content: BlogTeaserContent;
}

interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export function BlogTeaserSection({ content }: BlogTeaserSectionProps) {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      try {
        const res = await fetch("/api/portfolio/blog");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setPosts(data);
          }
        }
      } catch {
        // Ignore fetch errors in preview
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const title = content.title || "From the Blog";
  const postCount = content.postCount ?? 3;
  const displayedPosts = posts.slice(0, postCount);

  return (
    <section
      id="blogteaser"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span
              className="w-1.5 h-8 rounded-full"
              style={{ backgroundColor: "var(--theme-primary, #6366f1)" }}
            ></span>
            {title}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: Math.min(postCount, 3) }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 animate-pulse space-y-4"
              >
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-850 rounded w-full"></div>
                <div className="h-3 bg-zinc-850 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-950/40 border border-zinc-900 text-center space-y-3">
            <BookOpen className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-zinc-500 text-sm">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Draft"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogTeaserSection;

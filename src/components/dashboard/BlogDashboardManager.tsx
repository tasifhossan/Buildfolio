"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BlogPost, BlogPostEditorModal } from "@/components/dashboard/BlogPostEditorModal";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface BlogDashboardManagerProps {
  portfolioSlug: string;
}

export function BlogDashboardManager({ portfolioSlug }: BlogDashboardManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/blog");
      if (!res.ok) {
        throw new Error("Failed to load blog posts");
      }
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreateNew = () => {
    setSelectedPost(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(postId);
    try {
      const res = await fetch(`/api/portfolio/blog/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Blog Post Management</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Write, edit, and publish rich-text articles for your portfolio at{" "}
            <code className="text-indigo-400 bg-zinc-950 px-1.5 py-0.5 rounded">
              /{portfolioSlug}/blog
            </code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${portfolioSlug}/blog`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-zinc-800/60 rounded-2xl bg-zinc-900/20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Loading blog posts...</span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-900/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 space-y-4 max-w-md mx-auto">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-200">No blog posts yet</h3>
            <p className="text-xs text-zinc-500">
              Create your first blog post using Tiptap rich-text editor!
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Post</span>
          </button>
        </div>
      ) : (
        /* Posts Table */
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-950/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
                {posts.map((post) => {
                  const dateVal = post.publishedAt || post.createdAt;
                  const formattedDate = new Date(dateVal).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Title & Slug */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                          {post.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          /blog/{post.slug}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {post.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-zinc-400">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {post.isPublished && (
                            <Link
                              href={`/${portfolioSlug}/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                              title="View Public Post"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => handleEdit(post)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Post"
                          >
                            {deletingId === post.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <BlogPostEditorModal
        post={selectedPost}
        portfolioSlug={portfolioSlug}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveSuccess={fetchPosts}
      />
    </div>
  );
}

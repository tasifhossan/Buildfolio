"use client";

import React, { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { slugify } from "@/lib/slugify";
import { X, Check, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export interface BlogPost {
  id: string;
  portfolioId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentHtml: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostEditorModalProps {
  post: BlogPost | null; // null for creating new post
  portfolioSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export function BlogPostEditorModal({
  post,
  isOpen,
  onClose,
  onSaveSuccess,
}: BlogPostEditorModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setExcerpt(post.excerpt || "");
      setContentHtml(post.contentHtml || "");
      setCoverImageUrl(post.coverImageUrl || null);
      setIsPublished(post.isPublished || false);
      setIsSlugManuallyEdited(true);
    } else {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContentHtml("");
      setCoverImageUrl(null);
      setIsPublished(false);
      setIsSlugManuallyEdited(false);
    }
    setError(null);
  }, [post, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(slugify(e.target.value));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image size exceeds 5MB limit.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are supported.");
      return;
    }

    setIsUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to upload cover image");
      }

      const data = await res.json();
      setCoverImageUrl(data.secure_url);
    } catch (err) {
      console.error("Cover image upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Post title is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        contentHtml,
        coverImageUrl,
        isPublished,
      };

      const url = post ? `/api/portfolio/blog/${post.id}` : "/api/portfolio/blog";
      const method = post ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save blog post");
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-[cardFadeIn_0.2s_ease-out]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">
              {post ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <p className="text-xs text-zinc-400">
              {post ? "Update your post title, slug, and content." : "Draft a new article for your portfolio blog."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Post Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Building Next.js Apps with Tiptap"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                URL Slug
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="building-nextjs-apps-with-tiptap"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Public URL: <code className="text-zinc-400">/blog/{slug || "post-slug"}</code>
              </p>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Cover Image (Optional)
            </label>

            {coverImageUrl ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
                <Image
                  src={coverImageUrl}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl(null)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all cursor-pointer">
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-400 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    <span>Uploading cover image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400 text-xs">
                    <ImageIcon className="w-8 h-8 text-zinc-500" />
                    <span>Click or drag image to upload cover (JPG, PNG, WEBP &lt; 5MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Short Excerpt (Summary for Cards & SEO)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Brief summary of the blog post..."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Content (Rich Text WYSIWYG)
            </label>
            <RichTextEditor
              value={contentHtml}
              onChange={setContentHtml}
              disabled={isSaving}
            />
          </div>

          {/* Status & Actions Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Publish Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-300">Publication Status:</span>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublished ? "bg-emerald-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-medium ${isPublished ? "text-emerald-400" : "text-amber-400"}`}>
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>

            {/* Form Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploadingImage}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{post ? "Update Post" : "Save Post"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

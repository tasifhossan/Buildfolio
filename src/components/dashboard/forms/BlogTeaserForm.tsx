"use client";

import React from "react";
import type { BlogTeaserContent } from "@/components/portfolio/SectionRenderer";

interface BlogTeaserFormProps {
  value: BlogTeaserContent;
  onChange: (updatedContent: BlogTeaserContent) => void;
  onSave: (updatedContent: BlogTeaserContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function BlogTeaserForm({ value, onChange, onSave, isSaving = false }: BlogTeaserFormProps) {
  const title = value.title ?? "From the Blog";
  const postCount = value.postCount ?? 3;

  const handleChange = (field: keyof BlogTeaserContent, val: string | number) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      postCount: Number(postCount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 space-y-4 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="blogteaser-title" className="text-xs font-semibold text-zinc-400">
            Section Title
          </label>
          <input
            id="blogteaser-title"
            type="text"
            value={title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={isSaving}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
            placeholder="From the Blog"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="blogteaser-postcount" className="text-xs font-semibold text-zinc-400">
            Number of Posts to Display (1 - 6)
          </label>
          <input
            id="blogteaser-postcount"
            type="number"
            min={1}
            max={6}
            value={postCount}
            onChange={(e) => handleChange("postCount", parseInt(e.target.value, 10) || 1)}
            disabled={isSaving}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          />
          <p className="text-[11px] text-zinc-500 italic">
            This section type stores display configuration only. Actual posts are fetched dynamically from your published blog posts at render time.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-zinc-850 shrink-0">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white disabled:text-zinc-500 font-semibold text-xs py-2 px-5 rounded-xl shadow-lg shadow-indigo-500/10 transition duration-150 flex items-center gap-1.5 cursor-pointer"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}

export default BlogTeaserForm;

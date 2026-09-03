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
  const rawPostCount = value.postCount ?? 3;
  const postCount = Math.min(Math.max(rawPostCount, 1), 6);

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
      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
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
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              handleChange("postCount", isNaN(val) ? 1 : val);
            }}
            disabled={isSaving}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-indigo-300 text-xs flex items-start gap-2.5">
          <svg className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            Showing your latest {postCount} published post{postCount === 1 ? "" : "s"}.
          </span>
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

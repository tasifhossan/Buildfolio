"use client";

import { useState } from "react";

export interface HeroContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export interface Section {
  id: string;
  portfolioId: string;
  type: string;
  order: number;
  isVisible: boolean;
  content: HeroContent;
}

interface HeroFormProps {
  section: Section;
  onSave: (updatedContent: HeroContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function HeroForm({ section, onSave, isSaving = false }: HeroFormProps) {
  const initialContent = section.content || {};
  const [title, setTitle] = useState(initialContent.title ?? "Welcome to my portfolio");
  const [subtitle, setSubtitle] = useState(initialContent.subtitle ?? "I build high-quality digital experiences.");
  const [ctaText, setCtaText] = useState(initialContent.ctaText ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      subtitle,
      ctaText,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="space-y-1.5">
        <label htmlFor="hero-title" className="text-xs font-semibold text-zinc-400">
          Title
        </label>
        <input
          id="hero-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="Welcome to my portfolio"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="hero-subtitle" className="text-xs font-semibold text-zinc-400">
          Subtitle
        </label>
        <textarea
          id="hero-subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          disabled={isSaving}
          rows={3}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
          placeholder="Describe what you build or do"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="hero-cta" className="text-xs font-semibold text-zinc-400">
          Call to Action Button Text (Optional)
        </label>
        <input
          id="hero-cta"
          type="text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="e.g. View Projects"
        />
      </div>

      <div className="flex justify-end pt-2">
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

export default HeroForm;

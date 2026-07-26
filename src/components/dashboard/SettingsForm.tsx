"use client";

import { useState } from "react";

export interface Settings {
  id?: string;
  portfolioId?: string;
  themeColor: string | null;
  fontFamily: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface SettingsFormProps {
  portfolioId: string;
  initialSettings: Settings | null;
  onSaveSuccess: (updatedSettings: Settings) => void;
}

const PRESET_COLORS = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Violet", hex: "#8b5cf6" },
];

const FONT_OPTIONS = [
  { value: "sans", name: "Sans-Serif (Modern / Inter)" },
  { value: "serif", name: "Serif (Classic / Elegant)" },
  { value: "mono", name: "Monospace (Minimalist / Tech)" },
];

export function SettingsForm({ portfolioId: _portfolioId, initialSettings, onSaveSuccess }: SettingsFormProps) {
  const [themeColor, setThemeColor] = useState(initialSettings?.themeColor || "#6366f1");
  const [fontFamily, setFontFamily] = useState(initialSettings?.fontFamily || "sans");
  const [seoTitle, setSeoTitle] = useState(initialSettings?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialSettings?.seoDescription || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/portfolio/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          themeColor,
          fontFamily,
          seoTitle,
          seoDescription,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to update settings";
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch {
          // ignore parsing error
        }
        throw new Error(errorMessage);
      }

      const updatedSettings = await res.json();
      onSaveSuccess(updatedSettings);
      setSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-white/5 backdrop-blur-sm p-6 rounded-2xl space-y-6 animate-[cardFadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      <div>
        <h3 className="text-base font-bold text-zinc-200">Portfolio Design & SEO Settings</h3>
        <p className="text-[11px] text-zinc-500">Customise the look, styling, typography, and search engine metadata of your portfolio.</p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-[cardFadeIn_0.3s_ease]">
          <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-[cardFadeIn_0.3s_ease]">
          <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Settings saved successfully! Cache revalidated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Color Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 block">Theme Primary Color</label>
          <div className="flex flex-wrap items-center gap-3 bg-zinc-950/40 border border-zinc-800/80 p-3 rounded-xl">
            {/* Color Swatches */}
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setThemeColor(preset.hex)}
                  className={`w-6 h-6 rounded-lg transition-transform duration-100 relative shrink-0 cursor-pointer ${
                    themeColor.toLowerCase() === preset.hex.toLowerCase()
                      ? "scale-110 ring-2 ring-indigo-500/80 ring-offset-2 ring-offset-zinc-900"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                >
                  {themeColor.toLowerCase() === preset.hex.toLowerCase() && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block"></div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2 flex-1">
              <label htmlFor="custom-color-picker" className="sr-only">Custom Theme Color Picker</label>
              <input
                id="custom-color-picker"
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                disabled={isSaving}
                className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer p-0 shrink-0"
              />
              <input
                id="custom-color-hex"
                type="text"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                disabled={isSaving}
                placeholder="#6366f1"
                className="bg-transparent text-xs text-zinc-300 font-mono focus:outline-none w-20 uppercase"
              />
            </div>
          </div>
        </div>

        {/* Font Family Selector */}
        <div className="space-y-1.5">
          <label htmlFor="font-family" className="text-xs font-semibold text-zinc-400">
            Typography Style (Font Family)
          </label>
          <select
            id="font-family"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            disabled={isSaving}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none disabled:opacity-50 appearance-none cursor-pointer"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-100">
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* SEO Title Input */}
        <div className="space-y-1.5">
          <label htmlFor="seo-title" className="text-xs font-semibold text-zinc-400">
            SEO Page Title
          </label>
          <input
            id="seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            disabled={isSaving}
            maxLength={100}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
            placeholder="e.g. John Doe - Full Stack Developer Portfolio"
          />
          <p className="text-[10px] text-zinc-500">Appears in browser tabs and search engine search results (recommended under 60 characters).</p>
        </div>

        {/* SEO Description Input */}
        <div className="space-y-1.5">
          <label htmlFor="seo-description" className="text-xs font-semibold text-zinc-400">
            SEO Page Description
          </label>
          <textarea
            id="seo-description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            disabled={isSaving}
            rows={3}
            maxLength={200}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
            placeholder="e.g. Welcome to my personal portfolio website. Explore my recent engineering projects, core technical skills, and details on how to get in touch."
          />
          <p className="text-[10px] text-zinc-500">Summary description snippet shown by search engines (recommended under 160 characters).</p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-zinc-800/80">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white disabled:text-zinc-500 font-semibold text-xs py-2 px-5 rounded-xl shadow-lg shadow-indigo-500/10 transition duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving Settings...</span>
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsForm;

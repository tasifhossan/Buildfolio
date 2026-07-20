"use client";

import React from "react";
import { z } from "zod";

// Zod schema matching the JSON shape from the seed data
export const HeroContentSchema = z.object({
  title: z.string().optional().default("Welcome to my portfolio"),
  subtitle: z.string().optional().default("I build high-quality digital experiences."),
  ctaText: z.string().optional(),
});

export type HeroContent = z.infer<typeof HeroContentSchema>;

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const handleScrollToNext = () => {
    const nextSections = ["about", "projects", "contact"];
    for (const id of nextSections) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        break;
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-radial from-[var(--theme-primary-glow)] via-transparent to-transparent"
    >
      <div className="max-w-3xl mx-auto space-y-8 animate-[fadeIn_1s_ease-out]">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-tight sm:leading-none">
          {content.title}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          {content.subtitle}
        </p>
        {content.ctaText && (
          <div className="pt-4">
            <button
              onClick={handleScrollToNext}
              className="px-8 py-4 rounded-full font-bold text-sm tracking-wide text-white transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer"
              style={{
                backgroundColor: "var(--theme-primary)",
                boxShadow: "0 10px 25px -5px var(--theme-primary-glow)",
              }}
            >
              {content.ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

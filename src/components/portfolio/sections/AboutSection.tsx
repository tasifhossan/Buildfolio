import React from "react";
import { z } from "zod";

// Zod schema matching the JSON shape from the seed data
export const AboutContentSchema = z.object({
  bio: z.string().optional().default("No biography provided yet."),
  skills: z.array(z.string()).optional().default([]),
});

export type AboutContent = z.infer<typeof AboutContentSchema>;

interface AboutSectionProps {
  content: AboutContent;
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }}></span>
            About Me
          </h2>
        </div>
        <div className="md:col-span-2 space-y-6">
          <p className="text-zinc-300 text-base leading-relaxed font-light">
            {content.bio}
          </p>
          {content.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {content.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

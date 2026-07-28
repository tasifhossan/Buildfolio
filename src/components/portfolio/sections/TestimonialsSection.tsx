import React from "react";
import type { TestimonialsContent } from "../SectionRenderer";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const items = content.items || [];

  return (
    <section
      id="testimonials"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary, #6366f1)" }}></span>
            Testimonials
          </h2>
        </div>
        <div className="md:col-span-2 space-y-6">
          {items.length === 0 ? (
            <p className="text-zinc-500 text-sm">No testimonials listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60"
                >
                  <blockquote className="text-zinc-300 text-sm md:text-base leading-relaxed italic font-light mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-800 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-semibold text-sm shrink-0 border border-zinc-700">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                      {item.role && (
                        <p className="text-xs text-zinc-500 font-medium">{item.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

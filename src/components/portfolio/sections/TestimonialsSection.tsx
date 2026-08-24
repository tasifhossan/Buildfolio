import React from "react";
import type { TestimonialsContent } from "../SectionRenderer";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const items = content.items || [];

  const getInitials = (name: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return "??";
  };

  return (
    <section
      id="testimonials"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="space-y-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary, #6366f1)" }}></span>
          Testimonials
        </h2>

        {items.length === 0 ? (
          <p className="text-zinc-500 text-sm">No testimonials listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 group flex flex-col justify-between"
              >
                {/* Subtle Quote-icon accent */}
                <div className="absolute top-4 right-4 text-zinc-800/40 group-hover:text-indigo-500/20 transition-colors duration-300">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.748-9.762 9-10.961v4.22c-2.943.911-4.2 3.607-4.31 5.348h4.3v8.784h-9zm-14 0v-7.391c0-5.704 3.748-9.762 9-10.961v4.22c-2.943.911-4.2 3.607-4.31 5.348h4.3v8.784h-9z" />
                  </svg>
                </div>

                <div className="relative z-10 space-y-6 flex-1 flex flex-col justify-between">
                  <p className="text-zinc-300 text-sm leading-relaxed italic font-light">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-900/50">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-11 h-11 rounded-full object-cover border border-zinc-800 shrink-0"
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white border tracking-wider shrink-0 shadow-lg animate-pulse-subtle"
                        style={{
                          background: "linear-gradient(135deg, var(--theme-primary, #6366f1) 0%, var(--theme-primary-hover, #4f46e5) 100%)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
                        }}
                      >
                        {getInitials(item.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                      {item.role && (
                        <p className="text-xs text-zinc-500 font-medium truncate">{item.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

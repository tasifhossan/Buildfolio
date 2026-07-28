import React from "react";
import type { ExperienceContent } from "../SectionRenderer";

interface ExperienceSectionProps {
  content: ExperienceContent;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatPeriod(
  startMonth: number,
  startYear: number,
  isCurrent: boolean,
  endMonth?: number | null,
  endYear?: number | null
) {
  const startStr = `${MONTHS[startMonth - 1] || startMonth} ${startYear}`;
  if (isCurrent) {
    return `${startStr} — Present`;
  }
  const endStr = endMonth && endYear ? `${MONTHS[endMonth - 1] || endMonth} ${endYear}` : "";
  return endStr ? `${startStr} — ${endStr}` : startStr;
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
  const items = content.items || [];

  return (
    <section
      id="experience"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }}></span>
            Experience
          </h2>
        </div>
        <div className="md:col-span-2 space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-[1px] before:bg-zinc-800">
          {items.length === 0 ? (
            <p className="text-zinc-500 text-sm pl-8">No experience listed yet.</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="relative pl-8 group">
                {/* Timeline dot */}
                <div className="absolute left-4 top-1.5 w-3 h-3 rounded-full border-2 border-zinc-950 bg-zinc-700 group-hover:bg-[var(--theme-primary)] group-hover:border-[var(--theme-primary)] transition-all duration-300 transform -translate-x-1/2" />
                
                <div className="space-y-2">
                  <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
                    {formatPeriod(item.startMonth, item.startYear, item.isCurrent, item.endMonth, item.endYear)}
                  </span>
                  
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors duration-150">
                      {item.role}
                    </h3>
                    <p className="text-sm font-medium text-zinc-400">
                      {item.company}
                    </p>
                  </div>
                  
                  <p className="text-zinc-400 text-sm font-light leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import type { ContactContent } from "../SectionRenderer";

interface ContactSectionProps {
  content: ContactContent;
}

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }}></span>
            {content.title}
          </h2>
        </div>
        <div className="md:col-span-2 space-y-8">
          <p className="text-zinc-400 text-base font-light">
            Feel free to reach out using any of the platforms below. I&apos;d love to connect!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Email</div>
                  <div className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{content.email}</div>
                </div>
              </a>
            )}

            {content.github && (
              <a
                href={content.github.startsWith("http") ? content.github : `https://${content.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">GitHub</div>
                  <div className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">
                    {content.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "")}
                  </div>
                </div>
              </a>
            )}

            {content.linkedin && (
              <a
                href={content.linkedin.startsWith("http") ? content.linkedin : `https://${content.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">LinkedIn</div>
                  <div className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">
                    {content.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "")}
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

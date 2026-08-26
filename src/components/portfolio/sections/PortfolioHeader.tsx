"use client";

import React, { useState } from "react";

interface PortfolioHeaderProps {
  username: string;
  menuLinks: { name: string; id: string }[];
  resumeUrl?: string | null;
}

export function PortfolioHeader({ username, menuLinks, resumeUrl }: PortfolioHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/60 bg-zinc-950/60 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--theme-primary), var(--theme-primary-hover))",
            }}
            onClick={() => handleScroll("hero")}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <span
            onClick={() => handleScroll("hero")}
            className="font-bold tracking-tight text-white cursor-pointer hover:opacity-85 transition-opacity"
          >
            {username}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {menuLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-white transition duration-150 cursor-pointer"
            >
              {link.name}
            </button>
          ))}

          {/* Download Resume Button — only shown if resume is uploaded */}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Download Resume — inline icon button */}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="text-[var(--theme-primary)] hover:opacity-75 transition-opacity"
              title="Download Resume"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-900 bg-zinc-950 px-6 py-4 space-y-3 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
          {menuLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="block w-full text-left py-2 text-sm font-semibold tracking-wider uppercase text-zinc-400 hover:text-white transition duration-150 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 py-2 text-sm font-semibold text-[var(--theme-primary)] hover:opacity-75 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          )}
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRenderer } from "./portfolio/SectionRenderer";

// Types matching Prisma Schema and seed structure
export interface Section {
  type: string;
  content: unknown; // Dynamic JSON content
}

export interface Settings {
  themeColor: string | null;
  fontFamily: string | null;
}

interface PortfolioRendererProps {
  sections: Section[];
  settings: Settings | null;
  username: string;
}

export function PortfolioRenderer({ sections, settings, username }: PortfolioRendererProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set default theme color and font family
  const themeColor = settings?.themeColor || "#6366f1"; // Default to Indigo
  const fontFamily = settings?.fontFamily || "sans";

  // Build the dynamic styles for theme customization
  const customStyles = {
    "--theme-primary": themeColor,
    "--theme-primary-hover": `${themeColor}e0`, // slightly lighter/darker
    "--theme-primary-glow": `${themeColor}20`,  // glow background
  } as React.CSSProperties;

  // Resolve font class based on setting
  const getFontClass = () => {
    if (fontFamily === "serif") return "font-serif";
    if (fontFamily === "mono") return "font-mono";
    return "font-sans";
  };

  // Helper to handle smooth scroll to a section
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Get active menu categories dynamically
  const menuLinks = sections.map((s) => ({
    name: s.type,
    id: s.type.toLowerCase(),
  }));

  return (
    <div
      style={customStyles}
      className={`min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[var(--theme-primary)] selection:text-white ${getFontClass()}`}
    >
      {/* Floating Header */}
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
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden">
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
          </div>
        )}
      </header>

      {/* Main Sections */}
      <main className="pb-24">
        {sections.map((section) => (
          <SectionRenderer
            key={section.type}
            section={section}
            onCtaClick={
              section.type === "Hero"
                ? () => {
                    const nextSection = sections.find((s) => s.type !== "Hero");
                    const targetId = nextSection ? nextSection.type.toLowerCase() : "contact";
                    handleScroll(targetId);
                  }
                : undefined
            }
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 bg-zinc-950/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 font-light">
            &copy; {new Date().getFullYear()} {username}. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 hover:text-[var(--theme-primary)] transition-colors duration-150"
          >
            Powered by Buildfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}

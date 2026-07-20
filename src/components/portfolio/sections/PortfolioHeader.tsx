"use client";

import React, { useState } from "react";

interface PortfolioHeaderProps {
  username: string;
  menuLinks: { name: string; id: string }[];
}

export function PortfolioHeader({ username, menuLinks }: PortfolioHeaderProps) {
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
  );
}

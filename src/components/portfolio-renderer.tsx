"use client";

import React, { useState } from "react";
import Link from "next/link";

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

// Interfaces for section content structures
interface HeroContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

interface AboutContent {
  bio?: string;
  skills?: string[];
}

interface ProjectItem {
  name: string;
  description?: string;
  link?: string;
}

interface ProjectsContent {
  title?: string;
  list?: ProjectItem[];
}

interface ContactContent {
  title?: string;
  email?: string;
  github?: string;
  linkedin?: string;
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

  // Section Renderers
  const renderHero = (content: HeroContent, id: string) => {
    return (
      <section
        key={id}
        id="hero"
        className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-radial from-[var(--theme-primary-glow)] via-transparent to-transparent"
      >
        <div className="max-w-3xl mx-auto space-y-8 animate-[fadeIn_1s_ease-out]">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-tight sm:leading-none">
            {content.title || "Welcome to my portfolio"}
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            {content.subtitle || "I build high-quality digital experiences."}
          </p>
          {content.ctaText && (
            <div className="pt-4">
              <button
                onClick={() => {
                  // Find the next visible section or fallback to contact
                  const nextSection = sections.find((s) => s.type !== "Hero");
                  const targetId = nextSection ? nextSection.type.toLowerCase() : "contact";
                  handleScroll(targetId);
                }}
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
  };

  const renderAbout = (content: AboutContent, id: string) => {
    return (
      <section
        key={id}
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
              {content.bio || "No biography provided yet."}
            </p>
            {content.skills && Array.isArray(content.skills) && content.skills.length > 0 && (
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
  };

  const renderProjects = (content: ProjectsContent, id: string) => {
    return (
      <section
        key={id}
        id="projects"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
      >
        <div className="space-y-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }}></span>
            {content.title || "Projects"}
          </h2>

          {!content.list || content.list.length === 0 ? (
            <p className="text-zinc-500 text-sm">No projects listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.list.map((project, idx) => {
                const Card = () => (
                  <div className="h-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 group flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors duration-150">
                          {project.name}
                        </h3>
                        {project.link && (
                          <svg
                            className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm font-light mt-3 leading-relaxed">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    {project.link && (
                      <div className="mt-6 pt-4 border-t border-zinc-900/50 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-primary)] opacity-80 group-hover:opacity-100 transition-opacity">
                        <span>View Project</span>
                      </div>
                    )}
                  </div>
                );

                if (project.link) {
                  return (
                    <a
                      key={idx}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full cursor-pointer"
                    >
                      <Card />
                    </a>
                  );
                }

                return (
                  <div key={idx} className="block h-full">
                    <Card />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderContact = (content: ContactContent, id: string) => {
    return (
      <section
        key={id}
        id="contact"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }}></span>
              {content.title || "Contact"}
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
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "Hero":
        return renderHero(section.content as HeroContent, section.type);
      case "About":
        return renderAbout(section.content as AboutContent, section.type);
      case "Projects":
        return renderProjects(section.content as ProjectsContent, section.type);
      case "Contact":
        return renderContact(section.content as ContactContent, section.type);
      default:
        return null;
    }
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
        {sections.map((section) => renderSection(section))}
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

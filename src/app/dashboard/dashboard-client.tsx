"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPortfolioUrl } from "@/lib/get-portfolio-url";

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

interface Section {
  id: string;
  portfolioId: string;
  type: string;
  order: number;
  isVisible: boolean;
  content: unknown;
}

interface Portfolio {
  id: string;
  userId: string;
  slug: string;
  templateId: string | null;
  createdAt: Date | string;
  sections: Section[];
}

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
}

interface DashboardClientProps {
  initialPortfolio: Portfolio;
}

export function DashboardClient({ initialPortfolio }: DashboardClientProps) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [showTemplateSelector, setShowTemplateSelector] = useState(
    portfolio.sections.length === 0
  );
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [applyingTemplateId, setApplyingTemplateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates when template selector is shown
  useEffect(() => {
    if (showTemplateSelector && templates.length === 0) {
      const fetchTemplates = async () => {
        setLoadingTemplates(true);
        setError(null);
        try {
          const res = await fetch("/api/templates");
          if (!res.ok) {
            throw new Error("Failed to fetch templates");
          }
          const data = await res.json();
          setTemplates(data);
        } catch (err) {
          console.error("Error loading templates:", err);
          setError(err instanceof Error ? err.message : "Failed to load templates");
        } finally {
          setLoadingTemplates(false);
        }
      };
      fetchTemplates();
    }
  }, [showTemplateSelector, templates.length]);

  const handleApplyTemplate = async (templateId: string) => {
    setApplyingTemplateId(templateId);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/apply-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to apply template");
      }

      const updatedPortfolio = await res.json();
      setPortfolio(updatedPortfolio);
      setShowTemplateSelector(false);
      router.refresh();
    } catch (err) {
      console.error("Error applying template:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setApplyingTemplateId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const renderSectionContent = (section: Section) => {
    switch (section.type) {
      case "Hero": {
        const c = section.content as HeroContent;
        return (
          <div className="space-y-1">
            <div className="text-zinc-200 font-medium text-sm">{c?.title || "No Title"}</div>
            <div className="text-zinc-400 text-xs">{c?.subtitle || "No Subtitle"}</div>
            {c?.ctaText && (
              <span className="inline-block mt-2 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                CTA: {c.ctaText}
              </span>
            )}
          </div>
        );
      }
      case "About": {
        const c = section.content as AboutContent;
        return (
          <div className="space-y-2">
            <div className="text-zinc-300 text-xs line-clamp-2">{c?.bio || "No Bio"}</div>
            {c?.skills && Array.isArray(c.skills) && (
              <div className="flex flex-wrap gap-1">
                {c.skills.map((skill: string, i: number) => (
                  <span key={i} className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/50">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }
      case "Projects": {
        const c = section.content as ProjectsContent;
        return (
          <div className="space-y-2">
            <div className="text-zinc-200 font-medium text-xs">{c?.title || "Projects"}</div>
            {c?.list && Array.isArray(c.list) && (
              <div className="grid grid-cols-1 gap-1">
                {c.list.map((proj: ProjectItem, i: number) => (
                  <div key={i} className="text-[11px] text-zinc-400 flex items-center justify-between bg-zinc-950/40 p-1.5 rounded border border-zinc-800/40">
                    <span className="font-medium text-zinc-300 truncate max-w-[150px]">{proj.name}</span>
                    <span className="text-[9px] text-zinc-500 truncate max-w-[100px]">{proj.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      default:
        return (
          <pre className="text-[10px] text-zinc-500 bg-zinc-950/40 p-2 rounded overflow-x-auto border border-zinc-800/50 font-mono">
            {JSON.stringify(section.content, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="min-h-screen bg-radial from-[#1e1b4b]/80 to-[#09090b] text-[#f4f4f5] font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              B
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Buildfolio
              </h1>
              <p className="text-[10px] text-zinc-500 -mt-0.5">Creator Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={getPortfolioUrl(portfolio.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition duration-150 flex items-center gap-1.5 hover:bg-zinc-800"
            >
              <span>View Site</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={handleSignOut}
              className="text-xs text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/30 border border-red-900/30 px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Template Selector Overlay/Screen */}
        {showTemplateSelector ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-[cardFadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Choose a Template
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm">
                Kickstart your portfolio with one of our designer layouts or begin with a clean, customisable blank canvas.
              </p>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Template Selection Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition duration-150 shadow-md shadow-black/10 cursor-pointer"
              >
                Start Blank Canvas
              </button>
            </div>

            {/* Templates Grid */}
            {loadingTemplates ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-sm">Loading premium layouts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 backdrop-blur-sm"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                        {tpl.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={tpl.thumbnailUrl}
                            alt={tpl.name}
                            className="object-cover w-full h-full transform transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
                            No Preview Available
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60"></div>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-1.5">
                        <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition duration-150">
                          {tpl.name}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                          {tpl.description || "Start building with this template design."}
                        </p>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleApplyTemplate(tpl.id)}
                        disabled={applyingTemplateId !== null}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white disabled:text-zinc-500 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/10 transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {applyingTemplateId === tpl.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Applying...</span>
                          </>
                        ) : (
                          <>
                            <span>Use this template</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Dashboard Main Content */
          <div className="space-y-8 animate-[cardFadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Intro Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/30 border border-white/5 backdrop-blur-sm p-6 rounded-2xl">
              <div>
                <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <span>Portfolio Status:</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Live
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Your portfolio is currently mapped to slug <code className="text-indigo-400 bg-zinc-950 px-1 py-0.5 rounded">/{portfolio.slug}</code>
                </p>
              </div>

              <div>
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="w-full md:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition duration-150 cursor-pointer"
                >
                  Change / Apply Template
                </button>
              </div>
            </div>

            {/* Sections Title */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-200">Portfolio Layout</h3>
              <p className="text-xs text-zinc-400">View and order sections that are active on your personal landing page.</p>
            </div>

            {/* Sections List */}
            {portfolio.sections.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/20 border border-dashed border-zinc-800/80 rounded-2xl space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-300">Your portfolio has no sections yet</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">Apply a pre-made template to fill your page, or create custom sections manually.</p>
                </div>
                <div>
                  <button
                    onClick={() => setShowTemplateSelector(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer"
                  >
                    Select Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.sections.map((sect) => (
                  <div
                    key={sect.id}
                    className="bg-zinc-900/40 border border-white/5 hover:border-zinc-800 rounded-xl p-5 flex items-start gap-4 transition duration-200"
                  >
                    {/* Badge */}
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800/60 flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0">
                      {sect.order}
                    </div>

                    {/* Content preview */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-900/30">
                          {sect.type}
                        </span>
                        {sect.isVisible ? (
                          <span className="text-[9.5px] text-emerald-400 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Visible
                          </span>
                        ) : (
                          <span className="text-[9.5px] text-zinc-500 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span> Hidden
                          </span>
                        )}
                      </div>
                      <div className="pt-1">{renderSectionContent(sect)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutTemplate, Sliders, Eye, Globe } from "lucide-react";
import FaqSection from "@/components/FaqSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buildfolio — Build Your Portfolio in Minutes",
  description:
    "Pick a template, customize your sections, and share your own portfolio page — no code required.",
};

export default async function Home() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans bg-zinc-950"
      style={{
        background: "radial-gradient(ellipse at 50% -10%, #1e1b4b 0%, #09090b 70%)",
        color: "#f4f4f5",
      }}
    >
      {/* Background Grid Pattern Overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Ambient glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 800,
          height: 800,
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 600,
          height: 600,
          bottom: "-10%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(30px)",
        }}
      />

      {/* Top nav */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-20 max-w-7xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
          Buildfolio
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
        >
          Log In →
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium backdrop-blur-md"
            style={{
              borderColor: "rgba(99,102,241,0.35)",
              background: "rgba(99,102,241,0.12)",
              color: "#c7d2fe",
              boxShadow: "0 0 20px rgba(99,102,241,0.15)",
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#818cf8" }}
            />
            Multi-tenant &bull; Template-based &bull; Instant publishing
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[1.05] tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 30%, #c7d2fe 75%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Build your portfolio
            <br />
            in minutes.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-2xl text-zinc-300 max-w-2xl leading-relaxed mb-10 font-normal">
            Pick a template, customize your sections — hero, about, projects,
            contact — and share your own public page instantly. No code, no
            friction.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/signup"
              id="cta-get-started"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 0 32px rgba(99,102,241,0.45)",
              }}
            >
              Get Started — it&apos;s free
            </Link>
            <Link
              href="/login"
              id="cta-login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-8 py-4 text-base font-semibold text-zinc-200 transition-all duration-200 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-[0.98]"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              Log In
            </Link>
          </div>

          {/* Secondary line under CTAs */}
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-medium flex items-center justify-center gap-2 opacity-90">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            No credit card required &bull; Free to get started
          </p>

          {/* Feature pills */}
          <div className="mt-14 flex flex-wrap gap-3 justify-center">
            {[
              "✦ Choose a template",
              "✦ Edit sections live",
              "✦ One-click publish",
              "✦ Your own /username URL",
            ].map((feat) => (
              <span
                key={feat}
                className="rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-zinc-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Glassmorphic preview card */}
          <div
            className="mt-16 w-full max-w-3xl rounded-2xl p-px shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.2) 50%, rgba(255,255,255,0.08) 100%)",
            }}
          >
            <div
              className="rounded-2xl px-8 py-8"
              style={{
                background: "rgba(9,9,11,0.85)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#ef4444" }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#f59e0b" }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#22c55e" }}
                />
                <div
                  className="ml-3 flex-1 rounded-lg px-4 py-1.5 text-xs text-zinc-400 text-left font-mono"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  buildfolio.app/
                  <span className="text-indigo-400 font-semibold">yourname</span>
                </div>
              </div>

              {/* Mock portfolio content */}
              <div className="text-left space-y-3">
                <div
                  className="h-3.5 rounded-full w-56 animate-pulse"
                  style={{ background: "rgba(99,102,241,0.45)" }}
                />
                <div
                  className="h-2.5 rounded-full w-80"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
                <div
                  className="h-2.5 rounded-full w-64"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <div className="pt-4 flex gap-3">
                  <div
                    className="h-8 w-28 rounded-lg"
                    style={{ background: "rgba(99,102,241,0.4)" }}
                  />
                  <div
                    className="h-8 w-24 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-6xl mx-auto mt-32 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: LayoutTemplate,
                title: "Pick a template",
                desc: "Start from a professional layout designed to showcase your skills beautifully.",
              },
              {
                icon: Sliders,
                title: "Customize everything",
                desc: "Edit sections, content, and themes in real-time from your dashboard.",
              },
              {
                icon: Eye,
                title: "Live preview",
                desc: "See exact changes as you type before publishing them to the live web.",
              },
              {
                icon: Globe,
                title: "Your own page",
                desc: "Get a custom, shareable public portfolio URL ready in minutes.",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
                    }}
                  />
                  
                  {/* Icon wrapper with subtle glow */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full max-w-5xl mx-auto mt-32 pt-16 flex flex-col items-center">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              How it works
            </h2>
            <p className="text-zinc-400 text-lg">
              Get your personal developer or designer portfolio live in three easy steps.
            </p>
          </div>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 -z-10" />

            {[
              {
                step: "01",
                title: "Sign up",
                desc: "Create your free account.",
              },
              {
                step: "02",
                title: "Pick a template",
                desc: "Choose a starting layout or begin blank.",
              },
              {
                step: "03",
                title: "Customize & publish",
                desc: "Edit your sections, preview live, and share your page instantly.",
              },
            ].map((stepItem, idx) => (
              <div key={idx} className="flex flex-col items-center text-center px-4 space-y-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-indigo-300 border backdrop-blur-md shadow-lg"
                  style={{
                    background: "rgba(99, 102, 241, 0.08)",
                    borderColor: "rgba(99, 102, 241, 0.25)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.1)",
                  }}
                >
                  {stepItem.step}
                </div>
                <h3 className="text-xl font-semibold text-white pt-2">
                  {stepItem.title}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xs">
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Preview Section */}
        <section className="w-full max-w-5xl mx-auto mt-32 pt-16 flex flex-col items-center">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              See a finished Buildfolio
            </h2>
            <p className="text-zinc-400 text-lg">
              Here is what your custom public portfolio page looks like out of the box. Fully responsive, ultra-fast, and designed to impress.
            </p>
          </div>

          {/* Browser Mockup */}
          <div
            className="w-full rounded-2xl p-px shadow-[0_0_50px_rgba(99,102,241,0.1)] border"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(255,255,255,0.05) 100%)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#09090b",
              }}
            >
              {/* Browser Header Bar */}
              <div
                className="flex items-center gap-2 px-6 py-4 border-b"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                {/* Window buttons */}
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
                </div>
                {/* Search Bar / URL bar */}
                <div
                  className="mx-auto max-w-sm w-full rounded-lg px-4 py-1 text-xs text-zinc-400 text-center font-mono border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  buildfolio.app/alex-rivera
                </div>
              </div>

              {/* Inside the Browser - Mockup Portfolio Site */}
              <div className="p-8 sm:p-12 space-y-16 text-left max-w-4xl mx-auto">
                {/* Portfolio Site Header */}
                <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
                  <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    Alex Rivera
                  </span>
                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <span>About</span>
                    <span>Projects</span>
                    <span>Contact</span>
                    <span className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600/80">
                      Say Hello
                    </span>
                  </div>
                </div>

                {/* Mock Portfolio Hero Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-4">
                  <div className="space-y-4 max-w-xl">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                      Building digital products that combine design &amp; engineering.
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed">
                      I&apos;m a product builder and frontend engineer based in San Francisco. Specializing in highly interactive interfaces, Next.js, and performant design systems.
                    </p>
                    <div className="flex gap-3">
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-zinc-800">
                        View Projects
                      </span>
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400">
                        Read About Me
                      </span>
                    </div>
                  </div>

                  {/* Stylized Avatar Placeholder */}
                  <div
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center p-1 border shadow-inner"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.1) 100%)",
                      borderColor: "rgba(99,102,241,0.25)",
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-3xl font-bold text-indigo-300">
                      AR
                    </div>
                  </div>
                </div>

                {/* Mock Portfolio About Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-px bg-indigo-500" />
                    <h4 className="text-xs uppercase font-semibold tracking-wider text-indigo-400">About Me</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        I bridge the gap between design and engineering. Over the last 5 years, I&apos;ve collaborated with teams worldwide to ship responsive, pixel-perfect user experiences. I focus on clean structure, readable code, and seamless micro-interactions.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 content-start">
                      {["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "UI/UX"].map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-300 border"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            borderColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mock Portfolio Projects Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-px bg-indigo-500" />
                    <h4 className="text-xs uppercase font-semibold tracking-wider text-indigo-400">Featured Projects</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Project Card 1 */}
                    <div
                      className="rounded-xl p-5 border space-y-3"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        borderColor: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">VibeSync</span>
                        <span className="text-xs text-indigo-400 font-semibold">Visit &rarr;</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        A collaborative music visualizer and real-time room-based recommendation engine built with Web Audio API.
                      </p>
                      <div className="flex gap-1.5">
                        {["Three.js", "Tailwind", "WebSockets"].map((t) => (
                          <span key={t} className="text-[10px] text-zinc-500 font-medium px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Card 2 */}
                    <div
                      className="rounded-xl p-5 border space-y-3"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        borderColor: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">Chronos DB</span>
                        <span className="text-xs text-indigo-400 font-semibold">Visit &rarr;</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        A lightweight, real-time analytics database engine and dashboard with live metrics tracking.
                      </p>
                      <div className="flex gap-1.5">
                        {["Rust", "React", "gRPC"].map((t) => (
                          <span key={t} className="text-[10px] text-zinc-500 font-medium px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Final CTA Section */}
      <section className="w-full max-w-4xl mx-auto mt-20 pb-28 text-center flex flex-col items-center space-y-6 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Ready to build your portfolio?
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-lg leading-relaxed">
          Join developers and designers who are already sharing their work with Buildfolio. Get started for free.
        </p>
        <div className="pt-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 0 32px rgba(99,102,241,0.45)",
            }}
          >
            Sign Up for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 py-12 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            <span className="text-base font-bold tracking-tight text-white">Buildfolio</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-zinc-500 sm:order-none order-last">
            &copy; {new Date().getFullYear()} Buildfolio. Built with Next.js &amp; Tailwind CSS.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buildfolio — Build Your Portfolio in Minutes",
  description:
    "Pick a template, customize your sections, and share your own portfolio page — no code required.",
};

export default function Home() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #09090b 65%)",
        color: "#f4f4f5",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 700,
          height: 700,
          top: "-20%",
          left: "-15%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 600,
          height: 600,
          bottom: "-20%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Top nav */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10">
        <span className="text-lg font-bold tracking-tight text-white">
          Buildfolio
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Log In →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 max-w-3xl mx-auto">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
          style={{
            borderColor: "rgba(99,102,241,0.35)",
            background: "rgba(99,102,241,0.10)",
            color: "#a5b4fc",
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "#6366f1" }}
          />
          Multi-tenant · Template-based · Instant publishing
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-5"
          style={{
            background: "linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Build your portfolio
          <br />
          in minutes.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10">
          Pick a template, customize your sections — hero, about, projects,
          contact — and share your own public page instantly. No code, no
          friction.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/signup"
            id="cta-get-started"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 0 24px rgba(99,102,241,0.35)",
            }}
          >
            Get Started — it&apos;s free
          </Link>
          <Link
            href="/login"
            id="cta-login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:text-white hover:bg-white/5 hover:border-white/20 active:scale-[0.98]"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            Log In
          </Link>
        </div>

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
              className="rounded-full px-4 py-1.5 text-xs font-medium text-zinc-400"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Glassmorphic preview card */}
        <div
          className="mt-16 w-full max-w-2xl rounded-2xl p-px"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(168,85,247,0.15) 50%, rgba(255,255,255,0.06) 100%)",
          }}
        >
          <div
            className="rounded-2xl px-8 py-8"
            style={{
              background: "rgba(9,9,11,0.75)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#ef4444" }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#f59e0b" }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#22c55e" }}
              />
              <div
                className="ml-3 flex-1 rounded-md px-3 py-1 text-xs text-zinc-500"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                buildfolio.vercel.app/
                <span className="text-indigo-400">yourname</span>
              </div>
            </div>

            {/* Mock portfolio content */}
            <div className="text-left space-y-3">
              <div
                className="h-3 rounded-full w-48"
                style={{ background: "rgba(99,102,241,0.4)" }}
              />
              <div
                className="h-2 rounded-full w-72"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <div
                className="h-2 rounded-full w-64"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <div className="pt-3 flex gap-2">
                <div
                  className="h-7 w-24 rounded-lg"
                  style={{ background: "rgba(99,102,241,0.35)" }}
                />
                <div
                  className="h-7 w-20 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Buildfolio. Built with Next.js &amp; Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}

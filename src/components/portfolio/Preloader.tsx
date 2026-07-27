"use client";

import { useEffect, useState } from "react";

interface PreloaderProps {
  showPreloader: boolean;
  logoUrl?: string | null;
  userName?: string | null;
  slug: string;
}

export function Preloader({
  showPreloader,
  logoUrl,
  userName,
  slug,
}: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(showPreloader);
  const [shouldRender, setShouldRender] = useState(showPreloader);

  // Derive initials from user name or portfolio slug
  const getInitials = () => {
    if (userName && userName.trim().length > 0) {
      const parts = userName.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return slug.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!showPreloader) return;

    let minimumTimeElapsed = false;
    let pageFullyLoaded = false;

    const fadeOut = () => {
      setIsVisible(false);
      // Wait for fade out animation to finish before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    };

    const checkAndFadeOut = () => {
      if (minimumTimeElapsed && (pageFullyLoaded || document.readyState === "complete")) {
        fadeOut();
      }
    };

    // Minimum display time of 1000ms
    const minTimer = setTimeout(() => {
      minimumTimeElapsed = true;
      checkAndFadeOut();
    }, 1000);

    // Handle page load event
    if (document.readyState === "complete") {
      pageFullyLoaded = true;
      checkAndFadeOut();
    } else {
      const handleLoad = () => {
        pageFullyLoaded = true;
        checkAndFadeOut();
      };
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(minTimer);
      };
    }

    // Hard fallback timeout of 3.5s to prevent loading screen getting stuck
    const hardFallbackTimer = setTimeout(() => {
      fadeOut();
    }, 3500);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(hardFallbackTimer);
    };
  }, [showPreloader]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950 transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Decorative ambient background glow */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, var(--theme-primary, #6366f1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {logoUrl ? (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 p-2 shadow-2xl flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white border shadow-2xl tracking-wider"
            style={{
              background: "linear-gradient(135deg, var(--theme-primary, #6366f1) 0%, var(--theme-primary-hover, #4f46e5) 100%)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 0 40px rgba(99, 102, 241, 0.25)",
            }}
          >
            {getInitials()}
          </div>
        )}

        {/* Small minimalist loading indicator */}
        <div className="flex items-center gap-1.5 pt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

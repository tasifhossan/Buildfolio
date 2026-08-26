"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function usePortfolioTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("usePortfolioTheme must be used within a PortfolioThemeWrapper");
  }
  return context;
}

interface PortfolioThemeWrapperProps {
  children: React.ReactNode;
  fontClass: string;
  customStyles: React.CSSProperties;
}

export function PortfolioThemeWrapper({
  children,
  fontClass,
  customStyles,
}: PortfolioThemeWrapperProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  };

  // Prevent flash by matching SSR/initial load (defaults to dark)
  const currentTheme = mounted ? theme : "dark";

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <div
        data-theme={currentTheme}
        style={customStyles}
        className={`portfolio-root min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[var(--theme-primary)] selection:text-white ${fontClass}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

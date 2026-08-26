"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  portfolioId: string;
}

export function AnalyticsTracker({ portfolioId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // 1. Record Page View on mount (with simple session deduplication)
    const sessionKey = `visited_portfolio_${portfolioId}`;
    if (!sessionStorage.getItem(sessionKey)) {
      fetch("/api/analytics/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioId, type: "view" }),
      })
        .then((res) => {
          if (res.ok) {
            sessionStorage.setItem(sessionKey, "true");
          }
        })
        .catch((err) => console.error("[Analytics] View logging failed:", err));
    }

    // 2. Intercept Outbound Clicks via Event Delegation
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        const isExternal =
          anchor.target === "_blank" ||
          anchor.hostname !== window.location.hostname;

        if (isExternal) {
          const payload = JSON.stringify({ portfolioId, type: "click" });
          if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/analytics/record", payload);
          } else {
            fetch("/api/analytics/record", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: payload,
              keepalive: true,
            }).catch((err) => console.error("[Analytics] Click logging failed:", err));
          }
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [portfolioId]);

  return null;
}

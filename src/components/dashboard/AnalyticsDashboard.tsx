"use client";

import { useEffect, useState } from "react";

interface DailyRecord {
  id: string;
  portfolioId: string;
  date: string;
  views: number;
  clicks: number;
}

interface AnalyticsDashboardProps {
  portfolioId: string;
}

export function AnalyticsDashboard({ portfolioId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portfolio/analytics");
        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const result = await res.json();
        setData(result.analytics || []);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm">Loading analytics statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  // Calculate aggregates
  const totalViews = data.reduce((acc, rec) => acc + rec.views, 0);
  const totalClicks = data.reduce((acc, rec) => acc + rec.clicks, 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  // SVG Chart Setup
  const chartHeight = 200;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  const maxVal = Math.max(
    ...data.map((r) => Math.max(r.views, r.clicks)),
    5 // default minimum max value to draw axis nicely
  );

  const pointsViews: string[] = [];
  const pointsClicks: string[] = [];
  const areaViewsPoints: string[] = [];
  const areaClicksPoints: string[] = [];

  if (data.length > 1) {
    data.forEach((rec, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * (chartWidth - paddingX * 2);
      
      const yViews =
        chartHeight -
        paddingY -
        (rec.views / maxVal) * (chartHeight - paddingY * 2);
      pointsViews.push(`${x},${yViews}`);
      
      const yClicks =
        chartHeight -
        paddingY -
        (rec.clicks / maxVal) * (chartHeight - paddingY * 2);
      pointsClicks.push(`${x},${yClicks}`);
    });

    // For area fills, close the shape by adding bottom-right and bottom-left points
    const bottomY = chartHeight - paddingY;
    const startX = paddingX;
    const endX = chartWidth - paddingX;

    areaViewsPoints.push(`${startX},${bottomY}`, ...pointsViews, `${endX},${bottomY}`);
    areaClicksPoints.push(`${startX},${bottomY}`, ...pointsClicks, `${endX},${bottomY}`);
  }

  return (
    <div className="space-y-8 animate-[cardFadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card: Views */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-xl group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Page Views</span>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              {totalViews}
              <span className="text-xs text-indigo-400 font-medium">all-time</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 w-12 h-12 text-indigo-500/10 flex items-center justify-center pointer-events-none">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Card: Clicks */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-xl group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-rose-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Outbound Link Clicks</span>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              {totalClicks}
              <span className="text-xs text-pink-400 font-medium">all-time</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 w-12 h-12 text-pink-500/10 flex items-center justify-center pointer-events-none">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
        </div>

        {/* Card: CTR */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-xl group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Conversion Rate (CTR)</span>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              {ctr}%
              <span className="text-xs text-emerald-400 font-medium">clicks / views</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 w-12 h-12 text-emerald-500/10 flex items-center justify-center pointer-events-none">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-zinc-100">Analytics Trend</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Visualize page performance over the last 30 active days.</p>
        </div>

        {data.length === 0 ? (
          /* Empty State */
          <div className="h-[240px] flex flex-col items-center justify-center text-center gap-2 border border-dashed border-zinc-800 rounded-xl p-8 bg-zinc-950/20">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-200">No Analytics Yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Views and link clicks will start populating dynamically here once visitors access your public portfolio page.
              </p>
            </div>
          </div>
        ) : (
          /* Interactive Trend Chart */
          <div className="space-y-4">
            <div className="w-full overflow-x-auto select-none">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto min-w-[500px]"
              >
                <defs>
                  {/* Views Gradient fill */}
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Clicks Gradient fill */}
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d946ef" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Y-Axis Grids */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const gridVal = Math.round(maxVal * (1 - ratio));
                  return (
                    <g key={ratio} className="opacity-40">
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#27272a"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 10}
                        y={y + 4}
                        fill="#52525b"
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {gridVal}
                      </text>
                    </g>
                  );
                })}

                {/* Y-Axis Label */}
                <line
                  x1={paddingX}
                  y1={paddingY}
                  x2={paddingX}
                  y2={chartHeight - paddingY}
                  stroke="#27272a"
                  strokeWidth="1"
                />

                {data.length > 1 && (
                  <>
                    {/* Areas */}
                    <polygon
                      points={areaViewsPoints.join(" ")}
                      fill="url(#viewsGrad)"
                    />
                    <polygon
                      points={areaClicksPoints.join(" ")}
                      fill="url(#clicksGrad)"
                    />

                    {/* Views Line Path */}
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsViews.join(" ")}
                    />

                    {/* Clicks Line Path */}
                    <polyline
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsClicks.join(" ")}
                    />

                    {/* Dot markers on nodes */}
                    {data.map((rec, idx) => {
                      const x = paddingX + (idx / (data.length - 1)) * (chartWidth - paddingX * 2);
                      const yViews = chartHeight - paddingY - (rec.views / maxVal) * (chartHeight - paddingY * 2);
                      const yClicks = chartHeight - paddingY - (rec.clicks / maxVal) * (chartHeight - paddingY * 2);

                      return (
                        <g key={idx}>
                          {/* Views Node */}
                          <circle
                            cx={x}
                            cy={yViews}
                            r="3"
                            fill="#6366f1"
                            stroke="#09090b"
                            strokeWidth="1"
                          />
                          {/* Clicks Node */}
                          <circle
                            cx={x}
                            cy={yClicks}
                            r="2.5"
                            fill="#d946ef"
                            stroke="#09090b"
                            strokeWidth="1"
                          />
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>

            {/* Legend info */}
            <div className="flex gap-6 justify-center text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-1.5 rounded bg-indigo-500" />
                <span className="text-zinc-400 font-medium">Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-1.5 rounded bg-pink-500" />
                <span className="text-zinc-400 font-medium">Link Clicks</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Analytics Table Log */}
      {data.length > 0 && (
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-base font-bold text-zinc-100">Daily Log</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Chronological list of visitor activity.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/30 text-zinc-400 font-semibold">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Page Views</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4 pr-6 text-right">Click Rate (CTR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {[...data].reverse().map((rec) => {
                  const recordDate = new Date(rec.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  });
                  const dayCtr = rec.views > 0 ? ((rec.clicks / rec.views) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={rec.id} className="hover:bg-white/2 transition duration-150">
                      <td className="p-4 pl-6 font-medium text-white">{recordDate}</td>
                      <td className="p-4">{rec.views}</td>
                      <td className="p-4">{rec.clicks}</td>
                      <td className="p-4 pr-6 text-right font-semibold text-zinc-400">
                        {dayCtr}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

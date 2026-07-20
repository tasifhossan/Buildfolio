import { getCurrentUserPortfolio } from "@/lib/get-current-user-portfolio";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  try {
    const portfolio = await getCurrentUserPortfolio();
    
    // Convert Dates to string if needed or pass directly since Next.js supports Date objects from Server to Client Components in modern versions,
    // but mapping to string or making sure it's serialized correctly is safe. Let's pass it.
    return (
      <DashboardClient
        initialPortfolio={{
          ...portfolio,
          createdAt: portfolio.createdAt.toISOString(),
        }}
      />
    );
  } catch (error) {
    console.error("Dashboard page error:", error);
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-[#1e1b4b]/80 to-[#09090b] text-[#f4f4f5] p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-900/60 border border-white/8 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Dashboard Error</h1>
          <p className="text-zinc-400 mb-6">
            {error instanceof Error ? error.message : "An unexpected error occurred while loading your portfolio."}
          </p>
          <a
            href="/login"
            className="inline-block w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }
}

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Chrome, Loader2 } from "lucide-react";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const error = searchParams.get("error");

  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-snowdrift flex flex-col md:grid md:grid-cols-2">
      {/* ─── Left: Branding ─── */}
      <div className="relative flex flex-col justify-center px-8 pt-20 pb-12 md:p-16 lg:p-24 clip-peak-down md:clip-none overflow-hidden">
        {/* Glacier accent strip — top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-glacier" />

        {/* Angular corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[hsl(var(--punctuation)/0.06)] [clip-path:polygon(100%_0%,0%_0%,100%_100%)]" />

        <div className="relative z-10 max-w-md">
          {/* Overline */}
          <p className="text-overline mb-3">
            AI-Powered<span className="text-[hsl(var(--punctuation))]">.</span>{" "}
            Personal Styling
          </p>

          {/* Wordmark */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[hsl(var(--peak))] leading-none">
            iDrip
            <span className="text-[hsl(var(--punctuation))]">.</span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Your wardrobe<span className="text-[hsl(var(--punctuation))]">,</span>{" "}
            intelligently styled
            <span className="text-[hsl(var(--punctuation))]">.</span> AI that
            knows what works together and what you're missing
            <span className="text-[hsl(var(--punctuation))]">.</span>
          </p>

          {/* Peak divider — mobile only */}
          <div className="mt-10 md:hidden">
            <svg
              viewBox="0 0 100 24"
              preserveAspectRatio="none"
              className="w-full h-6"
            >
              <polygon
                fill="hsl(var(--border))"
                opacity="0.4"
                points="0,24 15,6 30,16 50,2 70,14 85,4 100,12 100,24 0,24"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Right: Sign In ─── */}
      <div className="relative flex flex-col justify-center px-8 pb-20 pt-8 md:p-16 lg:p-24">
        {/* Glacier accent strip — left edge (desktop divider) */}
        <div className="hidden md:block absolute left-0 top-16 bottom-16 w-px bg-[hsl(var(--glacier)/0.3)]" />

        <div className="relative z-10 max-w-sm mx-auto w-full md:mx-0 md:ml-auto md:mr-0 lg:mr-16">
          {/* Section overline */}
          <p className="text-overline mb-8">
            Sign In<span className="text-[hsl(var(--punctuation))]">.</span>
          </p>

          {/* Error banner */}
          {error && (
            <div className="mb-8 p-3 rounded-xl bg-[hsl(var(--punctuation)/0.08)] border border-[hsl(var(--punctuation)/0.3)] text-sm text-[hsl(var(--punctuation))]">
              {error === "auth_failed"
                ? "Authentication failed. Please try again."
                : "Something went wrong. Please try again."}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[hsl(var(--glacier))] text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.3)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5" />
            )}
            Sign in with Google
          </button>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground mt-8 leading-relaxed">
            Sign in to access your wardrobe
            <span className="text-[hsl(var(--punctuation))]">,</span> generate
            outfits
            <span className="text-[hsl(var(--punctuation))]">,</span> and get
            personalized recommendations
            <span className="text-[hsl(var(--punctuation))]">.</span>
          </p>

          {/* Bottom angular accent */}
          <div className="absolute -bottom-8 right-0 w-16 h-16 bg-[hsl(var(--punctuation)/0.04)] [clip-path:polygon(100%_0%,0%_100%,100%_100%)]" />
        </div>
      </div>
    </div>
  );
}

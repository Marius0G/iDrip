import { Link } from "react-router-dom";
import { GlassCard } from "@/components/glass/GlassCard";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-snowdrift p-4">
      <GlassCard size="lg" className="text-center max-w-md">
        <h1 className="text-7xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[hsl(var(--glacier))] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </GlassCard>
    </div>
  );
}

import { Link } from "react-router-dom";
import { GlassCard } from "@/components/glass/GlassCard";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 p-4">
      <GlassCard size="lg" className="text-center max-w-md">
        <h1 className="text-7xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </GlassCard>
    </div>
  );
}

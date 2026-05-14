import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-snowdrift p-4">
      <p className="text-overline mb-3">
        ERROR<span className="text-[hsl(var(--punctuation))]">.</span>
      </p>
      <h1 className="text-display text-8xl md:text-9xl text-[hsl(var(--peak))] mb-4">
        404
      </h1>
      <p className="text-xl md:text-2xl font-bold text-[hsl(var(--peak)/0.85)] mb-2">
        Lost on the mountain<span className="text-[hsl(var(--punctuation))]">?</span>
      </p>
      <p className="text-base text-muted-foreground mb-8">
        This peak doesn't exist on our map<span className="text-[hsl(var(--punctuation))]">.</span>
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[hsl(var(--glacier))] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Home className="w-4 h-4" /> Go Home
      </Link>
    </div>
  );
}

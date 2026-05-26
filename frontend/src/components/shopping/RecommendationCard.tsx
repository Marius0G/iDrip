import { Trash2, Bookmark, Sparkles, ExternalLink } from "lucide-react";
import type { ShoppingRecommendation } from "@/types/shopping";

interface RecommendationCardProps {
  recommendation: ShoppingRecommendation;
  // Spotlight cards expose Save + Delete; History cards only expose Delete.
  variant?: "spotlight" | "saved";
  onSave?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  variant = "spotlight",
  onSave,
  onDelete,
}: RecommendationCardProps) {
  const hasLink = !!recommendation.productUrl;
  const showSave = variant === "spotlight" && !!onSave;

  const body = (
    <>
      <div className="relative kit-thumb aspect-[4/5] mb-3">
        <img
          src={recommendation.imageUrl}
          alt={recommendation.name}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fallback === "1") return;
            img.dataset.fallback = "1";
            img.src = "https://placehold.co/400x500/eeeeee/666666?text=Image+unavailable";
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="kit-badge-ai absolute top-2 left-2">
          <Sparkles className="w-3 h-3" />
          {recommendation.matchScore}%
        </span>

        {hasLink && (
          <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        )}

        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {showSave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave?.(recommendation.id);
              }}
              aria-label="Save to history"
              title="Save — moves to History to make room for new picks"
              className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(recommendation.id);
            }}
            aria-label="Delete permanently"
            title="Delete — never show this item again"
            className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[hsl(var(--punctuation))]/80"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-display text-sm font-semibold truncate kit-strong">
          {recommendation.name}
        </h3>
        <span className="font-sans text-sm font-bold kit-strong flex-shrink-0">
          ${recommendation.estimatedPrice}
        </span>
      </div>
      <p className="text-xs kit-muted">{recommendation.brand}</p>
      <p className="text-xs kit-muted mt-2 leading-relaxed line-clamp-2">
        {recommendation.reason}
      </p>
    </>
  );

  const className =
    "kit-card p-3 group transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] block";

  if (hasLink) {
    return (
      <a
        href={recommendation.productUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={className}
        aria-label={`Open ${recommendation.name} at ${recommendation.brand}`}
      >
        {body}
      </a>
    );
  }

  return <div className={className}>{body}</div>;
}

import type { ReactNode } from "react";
import { Trash2, Bookmark, EyeOff, Sparkles, ExternalLink, Undo2 } from "lucide-react";
import type { ShoppingRecommendation } from "@/types/shopping";

interface RecommendationCardProps {
  recommendation: ShoppingRecommendation;
  // Spotlight: Save + Hide + Delete · Saved: Hide + Delete · Hidden: Restore + Delete-forever
  variant?: "spotlight" | "saved" | "hidden";
  onSave?: (id: string) => void;
  onHide?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  variant = "spotlight",
  onSave,
  onHide,
  onDelete,
  onRestore,
}: RecommendationCardProps) {
  const hasLink = !!recommendation.productUrl;
  const showSave = variant === "spotlight" && !!onSave;
  const showHide = variant !== "hidden" && !!onHide;
  const showDelete = !!onDelete;
  const showRestore = variant === "hidden" && !!onRestore;

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
            <CardAction
              icon={<Bookmark className="w-3.5 h-3.5" />}
              label="Save"
              title="Save — moves to Saved tab to make room for new picks"
              onClick={() => onSave?.(recommendation.id)}
            />
          )}
          {showHide && (
            <CardAction
              icon={<EyeOff className="w-3.5 h-3.5" />}
              label="Hide"
              title="Hide for now — goes to Hidden tab, you can restore later"
              onClick={() => onHide?.(recommendation.id)}
            />
          )}
          {showRestore && (
            <CardAction
              icon={<Undo2 className="w-3.5 h-3.5" />}
              label="Restore"
              title="Restore — let the AI surface this item again"
              onClick={() => onRestore?.(recommendation.id)}
            />
          )}
          {showDelete && (
            <CardAction
              icon={<Trash2 className="w-3.5 h-3.5" />}
              label={variant === "hidden" ? "Delete forever" : "Delete"}
              title={variant === "hidden"
                ? "Delete forever — removes from Hidden, never shown again"
                : "Delete — never show this item again"}
              onClick={() => onDelete?.(recommendation.id)}
              danger
            />
          )}
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

interface CardActionProps {
  icon: ReactNode;
  label: string;
  title: string;
  onClick: () => void;
  danger?: boolean;
}

function CardAction({ icon, label, title, onClick, danger }: CardActionProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={title}
      className={
        "w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center transition-colors " +
        (danger ? "hover:bg-[hsl(var(--punctuation))]/80" : "hover:bg-black/70")
      }
    >
      {icon}
    </button>
  );
}

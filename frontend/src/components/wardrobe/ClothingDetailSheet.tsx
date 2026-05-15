import { useState, useCallback, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { useAnimatedMount } from "@/hooks/useAnimatedMount";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { ClothingItem } from "@/types/wardrobe";

interface ClothingDetailSheetProps {
  item: ClothingItem | null;
  onClose: () => void;
}

export function ClothingDetailSheet({
  item,
  onClose,
}: ClothingDetailSheetProps) {
  const deleteItem = useWardrobeStore((s) => s.deleteItem);
  const { phase, shouldRender, startExit } = useAnimatedMount({
    open: item !== null,
    enterDuration: 350,
    exitDuration: 300,
  });

  useScrollLock(item !== null);

  // Swipe-to-dismiss
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartY = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setDragOffset(delta);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    const panelHeight = panelRef.current?.offsetHeight || 400;
    if (dragOffset > panelHeight * 0.3) {
      startExit();
      setTimeout(onClose, 300);
    } else {
      setDragOffset(0);
    }
  }, [dragOffset, startExit, onClose]);

  if (!shouldRender || !item) return null;

  const handleDelete = () => {
    deleteItem(item.id);
    startExit();
    setTimeout(onClose, 300);
  };

  const isAnimating = phase === "enter" || phase === "exit";
  const panelTransform =
    phase === "enter"
      ? "translateY(100%)"
      : phase === "exit"
        ? "translateY(100%)"
        : dragOffset > 0
          ? `translateY(${dragOffset}px)`
          : "translateY(0)";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: phase === "visible" ? 1 : 0 }}
        onClick={() => {
          startExit();
          setTimeout(onClose, 300);
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full md:w-96 md:h-full max-h-[85vh] md:max-h-full overflow-y-auto bg-[hsl(var(--sidebar-surface))] backdrop-blur-2xl border-t md:border-l border-[hsl(var(--sidebar-border)/0.6)] rounded-t-3xl md:rounded-none shadow-2xl"
        style={{
          transform: panelTransform,
          transition: isAnimating
            ? "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
            : dragOffset > 0
              ? "none"
              : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header — swipe handle */}
        <div
          className="sticky top-0 bg-[hsl(var(--sidebar-surface)/0.92)] backdrop-blur-xl z-10 p-4 flex items-center justify-between border-b border-[hsl(var(--sidebar-border)/0.6)] touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle pill */}
          <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[hsl(var(--sidebar-border))]" />
          <div>
            <p className="kit-overline">Wardrobe</p>
            <h2 className="font-display text-lg font-semibold kit-strong mt-0.5">Item Details</h2>
          </div>
          <button
            onClick={() => {
              startExit();
              setTimeout(onClose, 300);
            }}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--sidebar-hover))] border border-[hsl(var(--sidebar-border)/0.7)] flex items-center justify-center hover:bg-[hsl(var(--sidebar-border)/0.4)] transition-colors kit-strong"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div className="rounded-xl overflow-hidden bg-[hsl(var(--sidebar-hover))]">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>

          <div>
            <h3 className="font-display text-xl md:text-2xl font-semibold kit-strong">{item.name}</h3>
            {item.brand && (
              <p className="text-sm kit-muted mt-1">
                {item.brand}
              </p>
            )}
          </div>

          <div>
            <span className="kit-overline">Category</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[hsl(var(--sidebar-accent))] text-black text-xs font-semibold capitalize">
                {item.category}
              </span>
            </div>
          </div>

          <div>
            <span className="kit-overline">Color</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[hsl(var(--sidebar-accent))] text-black text-xs font-semibold capitalize">
                {item.color}
              </span>
            </div>
          </div>

          <div>
            <span className="kit-overline">Seasons</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.season.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[hsl(var(--sidebar-accent))] text-black text-xs font-semibold capitalize"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {item.tags.length > 0 && (
            <div>
              <span className="kit-overline">Tags</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[hsl(var(--sidebar-accent))] text-black text-xs font-semibold capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 rounded-xl p-4 border border-[hsl(var(--sidebar-danger)/0.4)] bg-[hsl(var(--sidebar-danger)/0.05)]">
            <div className="flex flex-col gap-3">
              <div className="min-w-0">
                <h3 className="kit-overline" style={{ color: "hsl(var(--sidebar-danger))" }}>
                  Danger Zone
                </h3>
                <p className="text-xs kit-muted mt-2">
                  This will permanently remove this item from your wardrobe.
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="self-start inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors border-[hsl(var(--sidebar-danger)/0.4)] text-[hsl(var(--sidebar-danger))] hover:bg-[hsl(var(--sidebar-danger)/0.1)]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

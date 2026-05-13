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
        className="relative w-full md:w-96 md:h-full max-h-[85vh] md:max-h-full overflow-y-auto bg-[hsl(var(--frost)/0.95)] backdrop-blur-2xl border-t md:border-l border-[hsl(var(--border)/0.4)] rounded-t-3xl md:rounded-none shadow-2xl"
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
          className="sticky top-0 bg-[hsl(var(--frost)/0.9)] backdrop-blur-xl z-10 p-4 flex items-center justify-between border-b border-[hsl(var(--border)/0.3)] touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle pill */}
          <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[hsl(var(--border)/0.6)]" />
          <h2 className="text-lg font-bold">Item Details</h2>
          <button
            onClick={() => {
              startExit();
              setTimeout(onClose, 300);
            }}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--frost))] flex items-center justify-center hover:bg-[hsl(var(--border)/0.3)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold">{item.name}</h3>
            {item.brand && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.brand}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[hsl(var(--frost))]">
              <span className="text-xs text-muted-foreground">Category</span>
              <p className="text-sm font-medium capitalize">
                {item.category}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[hsl(var(--frost))]">
              <span className="text-xs text-muted-foreground">Color</span>
              <p className="text-sm font-medium capitalize">{item.color}</p>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground">Seasons</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.season.map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 rounded-lg bg-[hsl(var(--frost))] text-xs font-medium capitalize"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {item.tags.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-lg bg-[hsl(var(--frost))] text-xs font-medium capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-2xl border border-[hsl(var(--punctuation)/0.3)] text-[hsl(var(--punctuation))] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[hsl(var(--punctuation)/0.06)] transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Remove from Wardrobe
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { useAnimatedMount } from "@/hooks/useAnimatedMount";
import { useScrollLock } from "@/hooks/useScrollLock";
import { CLOTHING_CATEGORIES, CLOTHING_COLORS, SEASONS } from "@/data/categories";
import type { ClothingCategory, ClothingColor, Season } from "@/types/wardrobe";

interface ClothingUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ClothingUploadDialog({ open, onClose }: ClothingUploadDialogProps) {
  const { phase, shouldRender, startExit } = useAnimatedMount({
    open,
    enterDuration: 350,
    exitDuration: 300,
  });
  useScrollLock(open);

  const wrappedClose = useCallback(() => {
    startExit();
    setTimeout(onClose, 300);
  }, [startExit, onClose]);
  const addItem = useWardrobeStore((s) => s.addItem);
  const { preview, isProcessing, processFile, clearPreview } = useImageUpload();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("tops");
  const [color, setColor] = useState<ClothingColor>("black");
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(["all"]);
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");

  const resetForm = useCallback(() => {
    setName(""); setCategory("tops"); setColor("black"); setSelectedSeasons(["all"]); setBrand(""); setTags(""); clearPreview();
  }, [clearPreview]);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) return;
    addItem({
      name: name.trim(),
      category,
      subcategory: "",
      color,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      imageUrl: preview || `https://placehold.co/400x500/1a1a1a/ffffff?text=${encodeURIComponent(name)}`,
      season: selectedSeasons,
      brand: brand.trim() || undefined,
    });
    resetForm();
    wrappedClose();
  }, [name, category, color, selectedSeasons, brand, tags, preview, addItem, wrappedClose, resetForm]);

  const toggleSeason = (s: Season) => {
    if (s === "all") { setSelectedSeasons(["all"]); return; }
    setSelectedSeasons((prev) => {
      const without = prev.filter((p) => p !== "all" && p !== s);
      return prev.includes(s) ? (without.length ? without : ["all"]) : [...without, s];
    });
  };

  if (!shouldRender) return null;

  const panelTransform =
    phase === "enter"
      ? "translateY(100%)"
      : phase === "exit"
        ? "translateY(100%)"
        : "translateY(0)";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: phase === "visible" ? 1 : 0 }}
        onClick={wrappedClose}
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[hsl(var(--frost)/0.95)] backdrop-blur-2xl border border-[hsl(var(--border)/0.4)] rounded-t-3xl md:rounded-3xl shadow-2xl p-6"
        style={{
          transform: panelTransform,
          transition:
            phase === "enter" || phase === "exit"
              ? "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
              : "none",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Add New Item</h2>
          <button onClick={wrappedClose} className="w-8 h-8 rounded-full bg-[hsl(var(--frost))] flex items-center justify-center hover:bg-[hsl(var(--border)/0.3)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUploader preview={preview} onFileSelect={processFile} onClear={clearPreview} isProcessing={isProcessing} />

          <div>
            <label className="text-sm font-medium mb-1 block">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Black Oversized Tee" className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ClothingCategory)} className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]">
                {CLOTHING_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value as ClothingColor)} className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]">
                {CLOTHING_COLORS.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Season</label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <button key={s.value} onClick={() => toggleSeason(s.value as Season)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                    selectedSeasons.includes(s.value as Season)
                      ? "bg-[hsl(var(--glacier))] text-white border-transparent"
                      : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)]"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Brand</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="casual, streetwear (comma separated)" className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]" />
          </div>

          <button onClick={handleSubmit} disabled={!name.trim()}
            className="w-full py-3 rounded-2xl bg-[hsl(var(--glacier))] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            Add to Wardrobe
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { CLOTHING_CATEGORIES, CLOTHING_COLORS, SEASONS } from "@/data/categories";
import type { ClothingCategory, ClothingColor, Season } from "@/types/wardrobe";

interface ClothingUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ClothingUploadDialog({ open, onClose }: ClothingUploadDialogProps) {
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
    onClose();
  }, [name, category, color, selectedSeasons, brand, tags, preview, addItem, onClose, resetForm]);

  const toggleSeason = (s: Season) => {
    if (s === "all") { setSelectedSeasons(["all"]); return; }
    setSelectedSeasons((prev) => {
      const without = prev.filter((p) => p !== "all" && p !== s);
      return prev.includes(s) ? (without.length ? without : ["all"]) : [...without, s];
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Add New Item</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUploader preview={preview} onFileSelect={processFile} onClear={clearPreview} isProcessing={isProcessing} />

          <div>
            <label className="text-sm font-medium mb-1 block">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Black Oversized Tee" className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ClothingCategory)} className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm focus:outline-none">
                {CLOTHING_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value as ClothingColor)} className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm focus:outline-none">
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
                      ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                      : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/20 dark:border-white/10"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Brand</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="casual, streetwear (comma separated)" className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10" />
          </div>

          <button onClick={handleSubmit} disabled={!name.trim()}
            className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            Add to Wardrobe
          </button>
        </div>
      </div>
    </div>
  );
}

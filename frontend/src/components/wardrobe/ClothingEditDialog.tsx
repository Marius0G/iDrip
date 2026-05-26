import { useState, useCallback } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimatedMount } from "@/hooks/useAnimatedMount";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { wardrobeService } from "@/services/wardrobeService";
import { CLOTHING_CATEGORIES } from "@/data/categories";
import { FIELD_ENUMS } from "@/lib/fieldConfig";
import type { ClothingItem, ClothingCategory, Season } from "@/types/wardrobe";

interface ClothingEditDialogProps {
  item: ClothingItem | null;
  onClose: () => void;
}

const SEASONS: { value: Season; label: string }[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
  { value: "winter", label: "Winter" },
  { value: "all", label: "All seasons" },
];

function PillToggle({
  options,
  values,
  onChange,
}: {
  options: { value: string; label: string }[];
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  const toggle = (v: string) => {
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
            values.includes(opt.value)
              ? "bg-[hsl(var(--sidebar-accent))] text-black border-transparent"
              : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ClothingEditDialog({ item, onClose }: ClothingEditDialogProps) {
  const updateItem = useWardrobeStore((s) => s.updateItem);
  const { phase, shouldRender, startExit } = useAnimatedMount({
    open: item !== null,
    enterDuration: 300,
    exitDuration: 250,
  });
  useScrollLock(item !== null);

  const wrappedClose = useCallback(() => {
    startExit();
    setTimeout(onClose, 250);
  }, [startExit, onClose]);

  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<ClothingCategory>(item?.category ?? "tops");
  const [brand, setBrand] = useState(item?.brand ?? "");
  const [season, setSeason] = useState<Season[]>(item?.season ?? ["all"]);
  const [style, setStyle] = useState<string[]>(item?.style ?? []);
  const [occasion, setOccasion] = useState<string[]>(item?.occasion ?? []);
  const [primaryColor, setPrimaryColor] = useState(item?.primaryColor ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!item) return;
    setIsSaving(true);
    setError(null);
    try {
      let imageUrl = item.imageUrl;
      if (imageFile) {
        const res = await wardrobeService.uploadImage(imageFile);
        imageUrl = res.imageUrl;
      }
      await updateItem(item.id, {
        name,
        category,
        brand,
        season,
        style,
        occasion,
        primaryColor,
        imageUrl,
      });
      wrappedClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!shouldRender || !item) return null;

  const styleOptions = FIELD_ENUMS["style"] ?? [];
  const occasionOptions = FIELD_ENUMS["occasion"] ?? [];

  return (
    <div className="fixed inset-0 z-70 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: phase === "visible" ? 1 : 0 }}
        onClick={wrappedClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[90vh] overflow-y-auto",
          "bg-[hsl(var(--frost)/0.95)] backdrop-blur-2xl border border-[hsl(var(--border)/0.4)]",
          "rounded-t-3xl md:rounded-3xl shadow-2xl p-6 pb-24 md:pb-6 safe-area-bottom"
        )}
        style={{
          transform: phase === "visible" ? "translateY(0)" : "translateY(100%)",
          transition: phase === "enter" || phase === "exit"
            ? "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="kit-overline">Wardrobe</p>
            <h2 className="font-display text-lg font-semibold kit-strong mt-0.5">Edit Item</h2>
          </div>
          <button onClick={wrappedClose} className="w-8 h-8 rounded-full bg-[hsl(var(--frost))] flex items-center justify-center hover:bg-[hsl(var(--border)/0.3)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Image */}
          <div>
            <label className="kit-overline block mb-2">Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[hsl(var(--frost))] border border-[hsl(var(--border)/0.4)] shrink-0">
                <img
                  src={imagePreview ?? item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-[hsl(var(--border)/0.4)] text-sm hover:bg-[hsl(var(--frost))] transition-colors">
                Replace image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="kit-overline block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="kit-input w-full"
            />
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="kit-overline block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="kit-input w-full"
              >
                {CLOTHING_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="kit-overline block mb-2">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="kit-input w-full"
                placeholder="e.g. Nike"
              />
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="kit-overline block mb-2">Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg border border-[hsl(var(--border)/0.5)] shrink-0"
                style={{ backgroundColor: primaryColor || "#808080" }}
              />
              <input
                type="color"
                value={primaryColor || "#808080"}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#1a1a1a"
                className="kit-input flex-1 font-mono text-sm"
              />
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="kit-overline block mb-2">Season</label>
            <PillToggle
              options={SEASONS}
              values={season}
              onChange={(vals) => setSeason(vals as Season[])}
            />
          </div>

          {/* Style */}
          {styleOptions.length > 0 && (
            <div>
              <label className="kit-overline block mb-2">Style</label>
              <PillToggle options={styleOptions} values={style} onChange={setStyle} />
            </div>
          )}

          {/* Occasion */}
          {occasionOptions.length > 0 && (
            <div>
              <label className="kit-overline block mb-2">Occasion</label>
              <PillToggle options={occasionOptions} values={occasion} onChange={setOccasion} />
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="w-full py-3 rounded-2xl bg-[hsl(var(--sidebar-accent))] text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

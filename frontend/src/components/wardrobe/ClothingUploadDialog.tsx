import { useState, useCallback } from "react";
import { X, Sparkles, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { wardrobeService } from "@/services/wardrobeService";
import { featherlessService, type ClothingAnalysis } from "@/services/featherlessService";
import { useAnimatedMount } from "@/hooks/useAnimatedMount";
import { useScrollLock } from "@/hooks/useScrollLock";
import { CLOTHING_CATEGORIES } from "@/data/categories";
import { CATEGORY_FIELD_GROUPS, FIELD_ENUMS, MULTI_SELECT_FIELDS, TEXT_FIELDS } from "@/lib/fieldConfig";
import type { ClothingCategory, ClothingItemInput, Season } from "@/types/wardrobe";

type DialogState = "select" | "analyzing" | "review" | "saving";

interface ClothingUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

function SkeletonField() {
  return (
    <div className="h-10 rounded-xl bg-[hsl(var(--frost)/0.4)] animate-pulse" />
  );
}

function MultiSelectPills({
  values,
  onChange,
  options,
}: {
  values: string[];
  onChange: (vals: string[]) => void;
  options: { value: string; label: string }[];
}) {
  const toggle = (v: string) => {
    if (values.includes(v)) {
      onChange(values.filter((x) => x !== v));
    } else {
      onChange([...values, v]);
    }
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
              ? "bg-[hsl(var(--glacier))] text-white border-transparent"
              : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ClothingUploadDialog({ open, onClose }: ClothingUploadDialogProps) {
  const { phase, shouldRender, startExit } = useAnimatedMount({ open, enterDuration: 350, exitDuration: 300 });
  useScrollLock(open);

  const wrappedClose = useCallback(() => { startExit(); setTimeout(onClose, 300); }, [startExit, onClose]);
  const addItem = useWardrobeStore((s) => s.addItem);
  const { preview, rawFile, isProcessing, processFile, clearPreview } = useImageUpload();

  const [state, setState] = useState<DialogState>("select");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ClothingAnalysis | null>(null);
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [category, setCategory] = useState<ClothingCategory>("tops");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (group: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const resetForm = useCallback(() => {
    setState("select");
    setError(null);
    setImageUrl(null);
    setAnalysis(null);
    setMetadata({});
    setCategory("tops");
    setCollapsedSections(new Set());
    clearPreview();
  }, [clearPreview]);

  // State 2 → 3: Upload image, then analyze
  const handleAnalyze = useCallback(async () => {
    if (!rawFile) return;
    setState("analyzing");
    setError(null);
    try {
      const { imageUrl: url } = await wardrobeService.uploadImage(rawFile);
      setImageUrl(url);
      const result = await featherlessService.analyzeClothing(url);
      setAnalysis(result);
      setCategory((result.category as ClothingCategory) || "tops");
      // Populate metadata from AI result
      const initial: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(result)) {
        if (value !== null && value !== undefined) {
          initial[key] = value;
        }
      }
      setMetadata(initial);
      setState("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      // Fall back to manual: show review state with empty metadata
      setAnalysis(null);
      setMetadata({});
      setState("review");
    }
  }, [rawFile]);

  // State 3 → 4: Save to backend
  const handleSave = useCallback(async () => {
    setState("saving");
    setError(null);
    try {
      const name = (metadata.name as string) || "Untitled Item";
      const itemData: ClothingItemInput = {
        name,
        category,
        subcategory: "",
        primaryColor: "",
        secondaryColors: [],
        colorTemperature: "",
        colorIntensity: "",
        pattern: "",
        material: "",
        texture: "",
        transparency: "",
        printType: "",
        gender: "",
        formality: null,
        occasion: [],
        style: [],
        season: ["all"],
        aiConfidence: analysis?.confidence ?? null,
        aiAnalysis: (analysis as unknown as Record<string, unknown>) ?? {},
        fit: "",
        sleeveLength: "",
        sleeveStyle: "",
        neckline: "",
        collarType: "",
        cuffStyle: "",
        length: "",
        hemStyle: "",
        closureType: "",
        backDetail: "",
        strapStyle: "",
        rise: "",
        pleatStyle: "",
        distressing: "",
        waistbandStyle: "",
        legOpening: "",
        warmthLevel: "",
        waterResistance: "",
        hood: "",
        pockets: "",
        silhouette: "",
        heelHeight: "",
        heelStyle: "",
        toeStyle: "",
        soleType: "",
        shaftHeight: "",
        accessoryType: "",
        bandWidth: "",
        sockHeight: "",
        necklaceLength: "",
        hatStyle: "",
        earringStyle: "",
        tieStyle: "",
        watchStyle: "",
        lensColor: "",
        lining: "",
        publicId: "",
        color: "other",
        brand: "",
        tags: [],
        imageUrl: imageUrl || "",
        // Override with metadata (user's edits)
        ...metadata,
        category,
        color: (metadata.primaryColor as string) || "other",
        brand: (metadata.brand as string) || "",
        tags: (metadata.tags as string[]) || [],
        season: (metadata.season as Season[]) || ["all"],
      };
      await addItem(itemData);
      resetForm();
      wrappedClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item");
      setState("review");
    }
  }, [metadata, category, imageUrl, analysis, addItem, resetForm, wrappedClose]);

  // Update a single metadata field
  const setField = (key: string, value: unknown) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (newCat: ClothingCategory) => {
    setCategory(newCat);
    setMetadata((prev) => ({ ...prev, category: newCat }));
  };

  const onFileSelect = async (file: File) => {
    await processFile(file);
    setState("select");
    setError(null);
  };

  if (!shouldRender) return null;

  const panelTransform =
    phase === "enter" ? "translateY(100%)"
    : phase === "exit" ? "translateY(100%)"
    : "translateY(0)";

  const fieldGroups = CATEGORY_FIELD_GROUPS[category];

  // Render a dynamic field based on its type
  const renderField = (key: string) => {
    const val = metadata[key];
    const stringVal = typeof val === "string" ? val : "";
    const arrayVal = Array.isArray(val) ? val : [];
    const numVal = typeof val === "number" ? val : null;
    const isLowConfidence = analysis && analysis.confidence < 0.6;

    if (TEXT_FIELDS.has(key)) {
      return (
        <input
          value={stringVal}
          onChange={(e) => setField(key, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
        />
      );
    }

    if (key === "formality") {
      return (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20 text-right">{numVal ?? "—"}/10</span>
          <input
            type="range"
            min={1} max={10}
            value={numVal ?? 5}
            onChange={(e) => setField(key, parseInt(e.target.value))}
            className="flex-1 accent-[hsl(var(--glacier))]"
          />
        </div>
      );
    }

    if (key === "primaryColor") {
      return (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border border-[hsl(var(--border)/0.5)] shadow-sm shrink-0"
            style={{ backgroundColor: stringVal || "#808080" }}
          />
          <input
            type="color"
            value={stringVal || "#808080"}
            onChange={(e) => setField(key, e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
            id="primaryColorPicker"
          />
          <label
            htmlFor="primaryColorPicker"
            className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          >
            Pick
          </label>
          <input
            value={stringVal}
            onChange={(e) => setField(key, e.target.value)}
            placeholder="#1a1a1a"
            className="flex-1 px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
          />
        </div>
      );
    }

    if (key === "secondaryColors") {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {arrayVal.map((color: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[hsl(var(--frost))] border border-[hsl(var(--border)/0.3)] text-xs">
                <span className="w-4 h-4 rounded-sm border border-[hsl(var(--border)/0.3)]" style={{ backgroundColor: color }} />
                <span className="font-mono">{color}</span>
                <button type="button" onClick={() => setField(key, arrayVal.filter((_: string, j: number) => j !== i))} className="ml-0.5 text-muted-foreground hover:text-red-400">&times;</button>
              </span>
            ))}
            {arrayVal.length === 0 && (
              <span className="text-xs text-muted-foreground">No additional colors detected</span>
            )}
          </div>
          <input
            placeholder="Add hex color and press Enter (e.g. #c0c0c0)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && /^#[0-9a-fA-F]{6}$/.test(val)) {
                  setField(key, [...arrayVal, val]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
            className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
          />
        </div>
      );
    }

    if (MULTI_SELECT_FIELDS.has(key)) {
      const options = FIELD_ENUMS[key];
      if (!options) {
        return (
          <input
            value={stringVal}
            onChange={(e) => setField(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
          />
        );
      }
      return <MultiSelectPills values={arrayVal} onChange={(vals) => setField(key, vals)} options={options} />;
    }

    // Regular select
    const options = FIELD_ENUMS[key];
    if (!options) {
      // Free text field
      return (
        <input
          value={stringVal}
          onChange={(e) => setField(key, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
        />
      );
    }

    return (
      <div className="relative">
        <select
          value={stringVal}
          onChange={(e) => setField(key, e.target.value || null)}
          className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)] appearance-none"
        >
          <option value="">—</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {isLowConfidence && !stringVal && (
          <AlertTriangle className="absolute right-8 top-2.5 w-3.5 h-3.5 text-amber-400" />
        )}
      </div>
    );
  };

  const fieldLabel = (key: string) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: phase === "visible" ? 1 : 0 }}
        onClick={wrappedClose}
      />

      <div
        className="relative w-full max-w-2xl max-h-[85vh] md:max-h-[92vh] overflow-y-auto bg-[hsl(var(--frost)/0.95)] backdrop-blur-2xl border border-[hsl(var(--border)/0.4)] rounded-t-3xl md:rounded-3xl shadow-2xl p-6 pb-24 md:pb-6 safe-area-bottom"
        style={{
          transform: panelTransform,
          transition: phase === "enter" || phase === "exit"
            ? "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">
            {state === "select" && "Add New Item"}
            {state === "analyzing" && "Analyzing..."}
            {state === "review" && (analysis ? "Review AI Results" : "Enter Details Manually")}
            {state === "saving" && "Saving..."}
          </h2>
          <div className="flex items-center gap-2">
            {analysis && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                analysis.confidence >= 0.7 ? "bg-green-500/10 text-green-600" :
                analysis.confidence >= 0.4 ? "bg-amber-500/10 text-amber-600" :
                "bg-red-500/10 text-red-600"
              )}>
                {Math.round(analysis.confidence * 100)}% confidence
              </span>
            )}
            <button onClick={wrappedClose} className="w-8 h-8 rounded-full bg-[hsl(var(--frost))] flex items-center justify-center hover:bg-[hsl(var(--border)/0.3)] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* State 1: Image Selection */}
        {state === "select" && (
          <div className="space-y-4">
            <ImageUploader preview={preview} onFileSelect={onFileSelect} onClear={clearPreview} isProcessing={isProcessing} />
            <button
              onClick={handleAnalyze}
              disabled={!rawFile}
              className="w-full py-3 rounded-2xl bg-[hsl(var(--glacier))] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze with AI
            </button>
          </div>
        )}

        {/* State 2: Analyzing */}
        {state === "analyzing" && (
          <div className="space-y-4">
            {preview && (
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
                <img src={preview} alt="Upload preview" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <style>{`
                @keyframes idrip-spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <div
                className="w-6 h-6 border-2 border-[hsl(var(--glacier)/0.3)] border-t-[hsl(var(--glacier))] rounded-full"
                style={{ animation: "idrip-spin 0.8s linear infinite" }}
              />
              <span className="text-sm text-muted-foreground">AI is analyzing your clothing...</span>
            </div>
            <div className="space-y-3 opacity-50">
              <SkeletonField />
              <SkeletonField />
              <div className="grid grid-cols-2 gap-3">
                <SkeletonField />
                <SkeletonField />
              </div>
              <SkeletonField />
            </div>
          </div>
        )}

        {/* State 3: Review & Edit */}
        {state === "review" && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="md:w-2/5 shrink-0">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-black/5 sticky top-0">
                {preview ? (
                  <img src={preview} alt="Item" className="w-full h-full object-cover" />
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Item" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
              </div>
              {analysis && (
                <button
                  onClick={handleAnalyze}
                  className="w-full mt-2 py-2 rounded-xl border border-[hsl(var(--border)/0.4)] text-xs text-muted-foreground hover:bg-[hsl(var(--frost))] transition-colors"
                >
                  Re-analyze
                </button>
              )}
            </div>

            {/* Form */}
            <div className="md:w-3/5 space-y-4">
              {/* Name + Category + Brand (always visible) */}
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Name *</label>
                {renderField("name")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block text-muted-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as ClothingCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
                  >
                    {CLOTHING_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block text-muted-foreground">Brand</label>
                  {renderField("brand")}
                </div>
              </div>

              {/* Dynamic category sections */}
              {fieldGroups.map((group) => {
                const isCollapsed = collapsedSections.has(group.group);
                return (
                  <div key={group.group}>
                    <button
                      type="button"
                      onClick={() => toggleSection(group.group)}
                      className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {group.group}
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                    {!isCollapsed && (
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {group.fields.map((key) => (
                          <div key={key} className={group.fields.length % 2 === 1 && key === group.fields[group.fields.length - 1] ? "col-span-2" : ""}>
                            <label className="text-xs font-medium mb-1 block text-muted-foreground">
                              {fieldLabel(key)}
                            </label>
                            {renderField(key)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={state === "saving" || !metadata.name}
                className="w-full py-3 rounded-2xl bg-[hsl(var(--glacier))] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state === "saving" && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: "idrip-spin 0.8s linear infinite" }} />
                )}
                Save to Wardrobe
              </button>
            </div>
          </div>
        )}

        {/* State 4: Saving */}
        {state === "saving" && (
          <div className="flex items-center justify-center gap-3 py-12">
            <div
              className="w-6 h-6 border-2 border-[hsl(var(--glacier)/0.3)] border-t-[hsl(var(--glacier))] rounded-full"
              style={{ animation: "idrip-spin 0.8s linear infinite" }}
            />
            <span className="text-sm text-muted-foreground">Saving to your wardrobe...</span>
          </div>
        )}
      </div>
    </div>
  );
}

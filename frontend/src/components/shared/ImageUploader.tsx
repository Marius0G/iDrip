import { useCallback, useRef } from "react";
import { Upload, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  preview: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  isProcessing?: boolean;
  className?: string;
  /** Multi-file mode */
  multiple?: boolean;
  previews?: string[];
  onFilesSelect?: (files: File[]) => void;
  onRemove?: (index: number) => void;
}

export function ImageUploader({
  preview,
  onFileSelect,
  onClear,
  isProcessing,
  className,
  multiple,
  previews = [],
  onFilesSelect,
  onRemove,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Multi-file handlers ──
  const handleDropMulti = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) onFilesSelect?.(files);
  }, [onFilesSelect]);

  const handleChangeMulti = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) onFilesSelect?.(files);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFilesSelect]);

  // ── Single-file handlers ──
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  // ── Multi-file: gallery mode ──
  if (multiple) {
    return (
      <div className={cn("space-y-3", className)}>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/5 group">
                <img src={src} alt={`Item ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemove?.(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDropMulti}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[hsl(var(--border)/0.5)] cursor-pointer hover:border-[hsl(var(--glacier)/0.4)] transition-colors bg-[hsl(var(--frost)/0.4)]",
            previews.length > 0 ? "h-24" : "h-48",
            isProcessing && "opacity-50 pointer-events-none",
          )}
        >
          {previews.length > 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Plus className="w-5 h-5" />
              Add more images
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isProcessing ? "Processing..." : "Drop images or click to upload"}
              </p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChangeMulti}
          className="hidden"
        />
      </div>
    );
  }

  // ── Single-file: existing behavior ──
  if (preview) {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden", className)}>
        <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-[hsl(var(--border)/0.5)] cursor-pointer hover:border-[hsl(var(--glacier)/0.4)] transition-colors bg-[hsl(var(--frost)/0.4)]",
        isProcessing && "opacity-50 pointer-events-none",
        className
      )}
    >
      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        {isProcessing ? "Processing..." : "Drop image or click to upload"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

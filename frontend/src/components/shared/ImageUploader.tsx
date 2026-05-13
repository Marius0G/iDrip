import { useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  preview: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  isProcessing?: boolean;
  className?: string;
}

export function ImageUploader({ preview, onFileSelect, onClear, isProcessing, className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  if (preview) {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden", className)}>
        <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        <button onClick={onClear} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
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
      <p className="text-sm text-muted-foreground">{isProcessing ? "Processing..." : "Drop image or click to upload"}</p>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}

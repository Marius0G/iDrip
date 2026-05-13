import { Wand2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function GenerateButton({ onClick, isGenerating, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={cn(
        "w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-300",
        isGenerating
          ? "bg-[hsl(var(--glacier)/0.8)] text-white"
          : "bg-[hsl(var(--glacier))] text-white hover:opacity-90 hover:shadow-xl hover:scale-[1.01]",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      )}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating your outfit...
        </>
      ) : (
        <>
          <Wand2 className="w-5 h-5" />
          Generate Outfit with AI
        </>
      )}
    </button>
  );
}

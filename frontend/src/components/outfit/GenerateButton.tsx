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
        "kit-btn-primary w-full py-3.5 text-sm",
        "disabled:opacity-40 disabled:cursor-not-allowed"
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

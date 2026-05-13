import { cn } from "@/lib/utils";

type BlurLevel = "sm" | "md" | "lg";
type OpacityLevel = "light" | "medium" | "heavy";

interface FrostOverlayProps {
  blur?: BlurLevel;
  opacity?: OpacityLevel;
  className?: string;
  children?: React.ReactNode;
}

const blurMap: Record<BlurLevel, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-xl",
};

const opacityMap: Record<OpacityLevel, string> = {
  light: "bg-[hsl(var(--frost)/0.3)]",
  medium: "bg-[hsl(var(--frost)/0.5)]",
  heavy: "bg-[hsl(var(--frost)/0.7)]",
};

export function FrostOverlay({
  blur = "md",
  opacity = "light",
  className,
  children,
}: FrostOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0",
        blurMap[blur],
        opacityMap[opacity],
        "border border-[hsl(var(--border)/0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}

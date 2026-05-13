import { cn } from "@/lib/utils";

type DiagonalDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface DiagonalCutProps {
  direction?: DiagonalDirection;
  children: React.ReactNode;
  className?: string;
}

const clipPaths: Record<DiagonalDirection, string> = {
  "top-left": "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
  "top-right": "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
  "bottom-left": "polygon(0 0, 100% 5%, 100% 100%, 0 100%)",
  "bottom-right": "polygon(0 5%, 100% 0, 100% 100%, 0 100%)",
};

export function DiagonalCut({
  direction = "top-right",
  children,
  className,
}: DiagonalCutProps) {
  return (
    <div
      className={cn("bg-[hsl(var(--frost)/0.7)]", className)}
      style={{ clipPath: clipPaths[direction] }}
    >
      {children}
    </div>
  );
}

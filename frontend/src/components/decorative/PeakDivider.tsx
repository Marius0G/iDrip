import { cn } from "@/lib/utils";

interface PeakDividerProps {
  color?: string;
  height?: number;
  className?: string;
}

export function PeakDivider({
  color = "var(--color-border)",
  height = 32,
  className,
}: PeakDividerProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)} aria-hidden="true">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height }}
      >
        <polygon
          fill={color}
          opacity={0.4}
          points="0,32 25,8 50,20 75,4 100,16 100,32 0,32"
        />
      </svg>
    </div>
  );
}

import { cn } from "@/lib/utils";

type GlassPanelProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassPanel({ className, children, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "bg-[hsl(var(--frost)/0.6)] backdrop-blur-2xl border border-[hsl(var(--border)/0.4)] rounded-3xl shadow-[0_20px_48px_-8px_hsl(220_30%_15%/0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

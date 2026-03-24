import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GlassPanel({ className, children, ...props }: GlassPanelProps) {
  return (
    <div className={cn("bg-white/50 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl", className)} {...props}>
      {children}
    </div>
  );
}

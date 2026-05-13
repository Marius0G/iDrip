import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.5)] rounded-2xl p-5 shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] transition-all duration-300 hover:border-[hsl(var(--glacier)/0.3)] hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-overline">{label}</p>
          <p className="text-3xl font-bold mt-1 text-[hsl(var(--peak))]">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--glacier)/0.1)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[hsl(var(--glacier))]" />
        </div>
      </div>
    </div>
  );
}

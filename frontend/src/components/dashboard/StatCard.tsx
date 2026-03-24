import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, subtitle, className }: StatCardProps) {
  return (
    <div className={cn("bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 shadow-lg dark:shadow-black/20 transition-all duration-300 hover:border-black/10 dark:hover:border-white/15 dark:hover:bg-white/[0.09]", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/[0.08] flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>
  );
}

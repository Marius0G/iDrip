import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div
        className="kit-icon-box kit-icon-box-accent mb-4"
        style={{ width: 64, height: 64, borderRadius: 16 }}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display text-xl font-semibold kit-strong mb-2">
        {title}
      </h3>
      <p className="text-sm kit-muted max-w-sm mb-6">{description}</p>
      {action && (
        <button onClick={action.onClick} className="kit-btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}

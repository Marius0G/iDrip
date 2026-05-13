import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glassCardVariants = cva(
  "backdrop-blur-xl border shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--frost)/0.7)] border-[hsl(var(--border)/0.5)] shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)]",
        elevated:
          "bg-[hsl(var(--frost)/0.85)] border-[hsl(var(--border)/0.6)] shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)]",
        outline:
          "bg-transparent border-[hsl(var(--border))] shadow-none hover:border-[hsl(var(--primary)/0.4)]",
      },
      size: {
        default: "rounded-2xl p-6",
        lg: "rounded-3xl p-8",
        sm: "rounded-xl p-4",
      },
      hover: {
        true: "hover:scale-[1.02] cursor-pointer active:scale-[0.98] touch-press",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: false,
    },
  }
);

interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

export function GlassCard({
  className,
  variant,
  size,
  hover,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(glassCardVariants({ variant, size, hover }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

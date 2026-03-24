import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glassCardVariants = cva(
  "bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg transition-all duration-300",
  {
    variants: {
      size: {
        default: "rounded-2xl p-6",
        lg: "rounded-3xl p-8",
        sm: "rounded-xl p-4",
      },
      hover: {
        true: "hover:shadow-xl hover:scale-[1.02] cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      hover: false,
    },
  }
);

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof glassCardVariants> {}

export function GlassCard({ className, size, hover, children, ...props }: GlassCardProps) {
  return (
    <div className={cn(glassCardVariants({ size, hover }), className)} {...props}>
      {children}
    </div>
  );
}

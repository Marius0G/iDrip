import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glassCardVariants = cva(
  "bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-lg dark:shadow-black/20 transition-all duration-300",
  {
    variants: {
      size: {
        default: "rounded-2xl p-6",
        lg: "rounded-3xl p-8",
        sm: "rounded-xl p-4",
      },
      hover: {
        true: "hover:shadow-xl hover:scale-[1.02] hover:border-black/10 dark:hover:border-white/15 dark:hover:bg-white/[0.09] cursor-pointer",
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

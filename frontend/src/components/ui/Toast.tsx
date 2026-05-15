import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "error" | "success" | "info";

type ToastProps = {
  open: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
};

const VARIANT_STYLES: Record<ToastVariant, string> = {
  error:
    "border-red-500/60 bg-red-500/10 text-red-300 [&_svg]:text-red-400",
  success:
    "border-[#39ff14]/60 bg-[#39ff14]/10 text-[#39ff14] [&_svg]:text-[#39ff14]",
  info:
    "border-white/30 bg-white/5 text-white [&_svg]:text-white/80",
};

export function Toast({
  open,
  message,
  variant = "error",
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -32 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          aria-live="assertive"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] safe-area-top"
        >
          <div
            className={cn(
              "flex items-center gap-3 max-w-sm px-4 py-3 rounded-full backdrop-blur-md border shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
              VARIANT_STYLES[variant],
            )}
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            <p className="text-sm font-medium leading-tight pr-1">{message}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className="cursor-pointer p-1 -mr-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

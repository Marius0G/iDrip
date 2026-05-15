import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { DrizzyMascot } from "@/components/shared/DrizzyMascot";

const ease = [0.16, 1, 0.3, 1] as const;

export function DrizzyChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-40 bottom-20 md:bottom-0 right-4 md:right-6 flex items-end gap-1 md:gap-2 pointer-events-none">
      {/* <DrizzyMascot className="w-[72px] h-[72px] md:w-[120px] md:h-[120px] drop-shadow-[0_8px_18px_hsl(0_0%_0%/0.22)]" /> */}

      <motion.div
        initial={false}
        animate={{
          width: open ? 320 : 224,
          padding: open ? 16 : 8,
        }}
        transition={{ duration: 0.32, ease }}
        onClick={!open ? () => setOpen(true) : undefined}
        onKeyDown={(e) => {
          if (!open && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role={!open ? "button" : undefined}
        tabIndex={!open ? 0 : -1}
        aria-label={!open ? "Open Drizzy chat" : undefined}
        whileHover={!open ? { y: -2 } : undefined}
        whileTap={!open ? { scale: 0.97 } : undefined}
        style={{
          maxWidth: "calc(100vw - 8rem)",
          cursor: open ? "default" : "pointer",
          boxShadow: open
            ? "0 24px 56px -16px hsl(0 0% 0% / 0.28), 0 8px 16px -8px hsl(0 0% 0% / 0.18)"
            : "0 12px 32px -12px hsl(0 0% 0% / 0.28), 0 4px 12px -4px hsl(0 0% 0% / 0.15)",
        }}
        className="kit-card md:mb-6 pointer-events-auto flex-shrink-0"
      >
        <motion.div layout className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="kit-icon-box kit-icon-box-accent flex-shrink-0 animate-pulse"
              style={{ width: 36, height: 36 }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-display text-sm font-semibold kit-strong truncate">
                Drizzy is dressing...
              </p>
              <p className="text-[10px] kit-muted">
                It might take a while...
              </p>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.button
                key="close"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18, ease }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                aria-label="Close chat"
                className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[hsl(var(--sidebar-border))] hover:bg-[hsl(var(--sidebar-surface))] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.26, ease }}
              style={{ overflow: "hidden" }}
            >
              <p className="kit-bubble">
                Hang tight — I'm picking pieces from your wardrobe that match
                your style.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

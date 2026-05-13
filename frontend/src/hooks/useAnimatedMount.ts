import { useState, useEffect, useCallback } from "react";

interface UseAnimatedMountOptions {
  open: boolean;
  enterDuration?: number;
  exitDuration?: number;
}

/**
 * Keeps the element in the DOM during exit animation, then removes it.
 * Returns `phase`: "enter" | "visible" | "exit" | "hidden"
 */
export function useAnimatedMount({
  open,
  enterDuration = 300,
  exitDuration = 250,
}: UseAnimatedMountOptions) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit" | "hidden">(
    open ? "enter" : "hidden"
  );

  useEffect(() => {
    if (open) {
      setPhase("enter");
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("visible"));
      });
      return () => cancelAnimationFrame(t);
    } else {
      setPhase("exit");
      const t = setTimeout(() => setPhase("hidden"), exitDuration);
      return () => clearTimeout(t);
    }
  }, [open, exitDuration]);

  useEffect(() => {
    if (phase === "enter") {
      const t = setTimeout(() => setPhase("visible"), enterDuration);
      return () => clearTimeout(t);
    }
  }, [phase, enterDuration]);

  const shouldRender = phase !== "hidden";

  const startExit = useCallback(() => {
    setPhase("exit");
    setTimeout(() => setPhase("hidden"), exitDuration);
  }, [exitDuration]);

  return { phase, shouldRender, startExit };
}

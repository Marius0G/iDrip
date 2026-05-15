"use client";
import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LampProps {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
}

const NEON = "#39ff14";

/**
 * Simple neon top wash: a thin bright line at the very top + a vertical
 * gradient that fades from neon green to transparent on the way down.
 */
export const Lamp = ({ children, className, duration = 0.8 }: LampProps) => {
  return (
    <div
      className={cn(
        "relative w-full h-44 pointer-events-none",
        className
      )}
    >
      {/* Neon dome — wide soft ellipse so the falloff dissolves into the bg */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 h-44"
        style={{
          background: `radial-gradient(ellipse 95% 140% at 50% -15%, rgba(57,255,20,0.85) 0%, rgba(57,255,20,0.5) 5%, rgba(57,255,20,0.25) 10%, rgba(57,255,20,0.1) 20%, rgba(57,255,20,0.04) 38%, transparent 100%)`,
          filter: "blur(1px)",
        }}
      />

      {/* Thin neon line at the very top — soft bell-curve falloff at the edges */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration, ease: "easeInOut" }}
        style={{
          background: `linear-gradient(to right, transparent 0%, rgba(57,255,20,0.15) 15%, rgba(57,255,20,0.65) 35%, ${NEON} 50%, rgba(57,255,20,0.65) 65%, rgba(57,255,20,0.15) 85%, transparent 100%)`,
        }}
        className="absolute top-0 inset-x-0 h-[2px] origin-left"
      />

      {children && (
        <div className="relative z-10 flex flex-col items-center">
          {children}
        </div>
      )}
    </div>
  );
};

export { Lamp as LampContainer };

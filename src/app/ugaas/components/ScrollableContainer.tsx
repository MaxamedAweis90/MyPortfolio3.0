"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  scrollStep?: number;
  showFadeGradients?: boolean;
}

export function ScrollableContainer({
  children,
  className,
  containerClassName,
  scrollStep = 220,
  showFadeGradients = true,
}: ScrollableContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll bounds
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Allow a small 4px buffer to avoid jitter
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    // Observe size changes of children
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, [checkScroll]);

  // Scroll programmatic action
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const delta = direction === "left" ? -scrollStep : scrollStep;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={cn("relative group w-full overflow-hidden", containerClassName)}>
      {/* Left Scroll Indicator (<<) */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-0 top-0 bottom-0 z-20 flex items-center pl-1 pr-5 pointer-events-none",
              showFadeGradients &&
                "bg-gradient-to-r from-surface via-surface/90 to-transparent"
            )}
          >
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="pointer-events-auto p-1.5 rounded-xl bg-mainBg/90 hover:bg-[#0B82EC] border border-borderSubtle text-mutedText hover:text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center group/btn hover:scale-105 active:scale-95"
              title="Scroll left (more options)"
            >
              <ChevronsLeft className="w-4 h-4 text-cyan-400 group-hover/btn:text-white transition-colors animate-pulse" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content Viewport */}
      <div
        ref={scrollRef}
        className={cn(
          "overflow-x-auto custom-scrollbar scroll-smooth w-full select-none",
          className
        )}
      >
        {children}
      </div>

      {/* Right Scroll Indicator (>>) */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 top-0 bottom-0 z-20 flex items-center pr-1 pl-5 pointer-events-none",
              showFadeGradients &&
                "bg-gradient-to-l from-surface via-surface/90 to-transparent"
            )}
          >
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="pointer-events-auto p-1.5 rounded-xl bg-mainBg/90 hover:bg-[#0B82EC] border border-borderSubtle text-mutedText hover:text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center group/btn hover:scale-105 active:scale-95"
              title="Scroll right (more options)"
            >
              <ChevronsRight className="w-4 h-4 text-cyan-400 group-hover/btn:text-white transition-colors animate-pulse" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

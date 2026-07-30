"use client";

import type { ReactNode } from "react";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset window scroll position to top (0,0) on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full min-h-[80vh] flex-1 relative"
    >
      {children}
    </motion.div>
  );
}

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
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen relative"
    >
      {children}
    </motion.div>
  );
}

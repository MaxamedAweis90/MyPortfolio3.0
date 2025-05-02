// components/Template.js
"use client";

import React, { useEffect } from "react";
import { animatedPageIn } from "@/utils/animations";

export default function Template({ children }) {
  useEffect(() => {
    animatedPageIn();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Your page content */}
      <div className="relative z-0">{children}</div>

      {/* BACK-LAYER: colorful panels behind */}
      <div
        id="banner-back-1"
        className="fixed top-0 left-0 w-1/4 h-screen bg-gradient-to-br from-blue-700 to-blue-300 z-[9998] pointer-events-none"
      />
      <div
        id="banner-back-2"
        className="fixed top-0 left-1/4 w-1/4 h-screen bg-gradient-to-br from-green-700 to-green-300 z-[9998] pointer-events-none"
      />
      <div
        id="banner-back-3"
        className="fixed top-0 left-2/4 w-1/4 h-screen bg-gradient-to-br from-purple-700 to-purple-300 z-[9998] pointer-events-none"
      />
      <div
        id="banner-back-4"
        className="fixed top-0 left-3/4 w-1/4 h-screen bg-gradient-to-br from-red-700 to-red-300 z-[9998] pointer-events-none"
      />

      {/* FRONT-LAYER: original black panels with text */}
      {[1,2,3,4].map(n => (
        <div
          key={n}
          id={`banner-${n}`}
          className="fixed top-0 left-[calc((n-1)*25%)] w-1/4 h-screen bg-neutral-950 z-[9999] pointer-events-none flex items-center justify-center"
          style={{ left: `${(n-1)*25}%` }}
        >

        </div>
      ))}
    </div>
  );
}

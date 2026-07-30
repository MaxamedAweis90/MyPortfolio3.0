"use client";
import React, { useState, useEffect } from "react";
import { RiArrowUpLine } from "react-icons/ri";

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalHeight > 0) {
        const progress = (currentScroll / totalHeight) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
      }

      // Hide when on top of screen (scrollY <= 150)
      if (currentScroll > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG Circle stroke dash calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-20 right-5 z-40 transition-all duration-300 transform ${
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-75 pointer-events-none"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="relative group w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md border border-borderSubtle flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 hover:border-brandAccent"
      >
        {/* SVG Circular Scroll Progress Indicator Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 52 52"
        >
          {/* Background track circle */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-borderSubtle/50"
            strokeWidth="3"
            fill="none"
          />
          {/* Progress fill circle */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-brandAccent transition-all duration-150"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Center Up Arrow Icon */}
        <RiArrowUpLine className="text-xl text-primaryText group-hover:text-brandAccent group-hover:-translate-y-0.5 transition-all duration-200" />
      </button>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types/portfolio";
import ProjectCard from "@/components/ProjectCard";
import { RiFilter3Line } from "react-icons/ri";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.12,
      duration: 0.4,
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.25,
    },
  },
};

type ClientProjectGridProps = {
  projects: Project[];
};

export default function ClientProjectGrid({ projects }: ClientProjectGridProps) {
  // Default Load States: Category = "All", Sort = "Latest"
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Latest");

  const categories = ["All", "Web", "Mobile", "Design"];

  // Filter & Sort Pipeline
  const filteredAndSortedProjects = useMemo(() => {
    // 1. Category Filter
    const result =
      activeCategory === "All"
        ? [...projects]
        : projects.filter((p) => p.category === activeCategory);

    // 2. Sort Pipeline
    result.sort((a, b) => {
      if (activeSort === "Latest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }
      if (activeSort === "Oldest / First") {
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      }
      if (activeSort === "Popular") {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      return 0;
    });

    return result;
  }, [projects, activeCategory, activeSort]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Sort Filter Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-surface/90 border border-borderSubtle shadow-xl backdrop-blur-md">
        {/* Left Side: Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-brandAccent text-white shadow-lg shadow-brandAccent/30 scale-105 border border-brandAccent/50"
                  : "bg-mainBg border border-borderSubtle text-primaryText hover:border-brandAccent hover:text-brandAccent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Side: Sort Order Filter Dropdown */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <RiFilter3Line className="text-brandAccent text-base" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-mutedText">
            Sort By:
          </span>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="bg-mainBg border border-borderSubtle text-primaryText font-bold text-xs sm:text-sm rounded-full px-4 py-2 outline-none cursor-pointer hover:border-brandAccent transition-colors shadow-sm"
          >
            <option value="Latest">Latest</option>
            <option value="Oldest / First">Oldest / First</option>
            <option value="Popular">Popular</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      {filteredAndSortedProjects.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          layout
          key={`${activeCategory}-${activeSort}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {filteredAndSortedProjects.map((proj, idx) => (
              <motion.div
                key={proj._id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <ProjectCard proj={proj} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="py-16 text-center text-mutedText font-medium bg-surface/50 border border-borderSubtle rounded-3xl">
          No projects found matching the selected category.
        </div>
      )}
    </div>
  );
}

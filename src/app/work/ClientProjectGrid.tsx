"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Project } from "@/types/portfolio";
import ProjectCard from "@/components/ProjectCard";
import { RiFilter3Line } from "react-icons/ri";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(index * 0.05, 0.2),
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};

type ClientProjectGridProps = {
  projects: Project[];
  initialCategories?: string[];
};

export default function ClientProjectGrid({
  projects,
  initialCategories,
}: ClientProjectGridProps) {
  // Default Load States: Category = "All", Sort = "Latest"
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Latest");

  // Dynamic live categories from database
  const [categoryList, setCategoryList] = useState<string[]>(() => {
    if (initialCategories && initialCategories.length > 0) {
      return ["All", ...initialCategories];
    }
    const projectCategories = Array.from(
      new Set(projects.map((p) => p.category).filter(Boolean))
    );
    return ["All", ...(projectCategories.length > 0 ? projectCategories : ["Web", "Mobile", "Design"])];
  });

  // Client-side fetch on mount to guarantee 100% fresh categories after any CMS mutation
  useEffect(() => {
    fetch(`/api/ugaas/projects/categories?t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const names = data.categories.map((c: any) => c.name);
          setCategoryList(["All", ...names]);
        }
      })
      .catch(() => {});
  }, []);

  const categories = categoryList;

  // Identify the 2 most recently created projects across catalog
  const latestTwoProjectIds = useMemo(() => {
    const sortedByLatest = [...projects].sort((a, b) => {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
    return new Set(
      sortedByLatest
        .slice(0, 2)
        .map((p) => p._id || p.id || p.slug)
        .filter(Boolean)
    );
  }, [projects]);

  // Filter & Sort Pipeline
  const filteredAndSortedProjects = useMemo(() => {
    // 1. Category Filter
    const filtered =
      activeCategory === "All"
        ? [...projects]
        : projects.filter(
            (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
          );

    // 2. Sort Pipeline
    if (activeSort === "Popular") {
      // Pin the 2 latest projects at top, followed by remaining sorted by popularity
      const pinned: Project[] = [];
      const remaining: Project[] = [];

      filtered.forEach((p) => {
        const id = p._id || p.id || p.slug;
        if (id && latestTwoProjectIds.has(id)) {
          pinned.push(p);
        } else {
          remaining.push(p);
        }
      });

      pinned.sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });

      remaining.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      return [...pinned, ...remaining];
    }

    if (activeSort === "Oldest" || activeSort === "Oldest / First") {
      filtered.sort((a, b) => {
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      });
      return filtered;
    }

    // Default: "Latest" (curated sortOrder from CMS)
    filtered.sort((a, b) => {
      const orderA = a.sortOrder !== undefined ? a.sortOrder : (a.projectNumber || 0);
      const orderB = b.sortOrder !== undefined ? b.sortOrder : (b.projectNumber || 0);
      return orderA - orderB;
    });

    return filtered;
  }, [projects, activeCategory, activeSort, latestTwoProjectIds]);

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
          <label htmlFor="project-sort" className="text-xs font-extrabold uppercase tracking-wider text-mutedText">
            Sort By:
          </label>
          <select
            id="project-sort"
            aria-label="Sort projects by"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="bg-mainBg border border-borderSubtle text-primaryText font-bold text-xs sm:text-sm rounded-full px-4 py-2 outline-none cursor-pointer hover:border-brandAccent transition-colors shadow-sm"
          >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest / Creation Order</option>
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
            {filteredAndSortedProjects.map((proj, idx) => {
              const projId = proj._id || proj.id || proj.slug || `proj-${idx}`;
              const isNew = latestTwoProjectIds.has(proj._id || proj.id || proj.slug || "");
              return (
                <motion.div
                  key={projId}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <ProjectCard proj={proj} index={idx} isNew={isNew} />
                </motion.div>
              );
            })}
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

"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projectsData } from "@/data/portfolioData";
import type { Project } from "@/types/portfolio";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightLine,
  RiSparklingFill,
} from "react-icons/ri";

const ITEMS_PER_PAGE = 6;

interface MyWorkSectionProps {
  initialProjects?: Project[];
}

export default function MyWorkSection({ initialProjects }: MyWorkSectionProps = {}) {
  // Only render projects where isFeatured: true (capped at max 6 items)
  const featuredProjects = React.useMemo(() => {
    const raw = initialProjects && initialProjects.length > 0 ? initialProjects : projectsData;
    const featured = raw.filter((p) => p.isFeatured);
    return (featured.length > 0 ? featured : raw).slice(0, 6);
  }, [initialProjects]);

  const [projects, setProjects] = useState<Project[]>(featuredProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setProjects(featuredProjects);
    setCurrentPage(1);
  }, [featuredProjects]);

  const totalProjects = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / ITEMS_PER_PAGE));

  // Identify the 2 most recently created projects across catalog for consistency with /work
  const latestTwoProjectIds = React.useMemo(() => {
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

  // Dynamic pagination slicing: 6 items per page (2 rows of 3 columns)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Smooth scroll back to section header on page change
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-20 lg:py-28 px-4 sm:px-8 lg:px-16 bg-mainBg border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandAccent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondaryAccent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-borderSubtle/60 pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brandAccent">
              <RiSparklingFill className="text-xs" />
              Featured Projects & Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primaryText tracking-tight">
              Selected Work<span className="text-brandAccent">.</span>
            </h2>
          </div>
          <p className="text-mutedText text-sm sm:text-base max-w-md">
            Production web applications, mobile platforms, and full-stack software built with React, Next.js, and TypeScript.
          </p>
        </div>

        {/* 6 Projects Grid: 2 rows of 3 columns matching /work screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {currentProjects.map((proj, idx) => {
            const isNew = latestTwoProjectIds.has(proj._id || proj.id || proj.slug || "");
            return (
              <ProjectCard
                key={proj._id || proj.id || proj.slug || idx}
                proj={proj}
                index={startIndex + idx}
                isNew={isNew}
              />
            );
          })}
        </div>

        {/* Single Bottom Action & Pagination Control Row */}
        <div className="pt-6 border-t border-borderSubtle/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Combined Navigation & Pagination Controls on Single Row */}
          {totalPages > 1 ? (
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-surface/40 border-borderSubtle/30 text-mutedText/30 cursor-not-allowed opacity-40"
                    : "bg-surface border-borderSubtle text-primaryText hover:border-brandAccent hover:text-brandAccent hover:scale-105 shadow-sm cursor-pointer"
                }`}
                aria-label="Previous Page"
              >
                <RiArrowLeftSLine className="text-lg" />
                <span>Prev</span>
              </button>

              {/* Dynamic Page Numbers */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                          isActive
                            ? "bg-brandAccent text-white shadow-md shadow-brandAccent/30 scale-105"
                            : "bg-surface border border-borderSubtle text-mutedText hover:text-primaryText hover:border-brandAccent/50"
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-surface/40 border-borderSubtle/30 text-mutedText/30 cursor-not-allowed opacity-40"
                    : "bg-surface border-borderSubtle text-primaryText hover:border-brandAccent hover:text-brandAccent hover:scale-105 shadow-sm cursor-pointer"
                }`}
                aria-label="Next Page"
              >
                <span>Next</span>
                <RiArrowRightSLine className="text-lg" />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Direct Link to Dedicated Full Projects Gallery / Archive Page */}
          <Link
            href="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface border border-borderSubtle hover:border-brandAccent/60 text-primaryText text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-brandAccent/10 hover:scale-105 transition-all duration-300 group"
          >
            <span>View All Works & Case Studies</span>
            <RiArrowRightLine className="text-base text-brandAccent group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

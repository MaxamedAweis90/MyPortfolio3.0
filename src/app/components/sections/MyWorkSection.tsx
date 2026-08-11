"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projectsData } from "@/data/portfolioData";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightLine,
} from "react-icons/ri";

const ITEMS_PER_PAGE = 6;

export default function MyWorkSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement | null>(null);

  const totalProjects = projectsData.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / ITEMS_PER_PAGE));

  // Dynamic pagination slicing: 6 items per page (2 rows of 3 columns)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projectsData.slice(
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
      className="py-20 px-4 sm:px-8 lg:px-16 bg-mainBg border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondaryAccent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-borderSubtle/60 pb-6">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brandAccent">
              Portfolio Showcase
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primaryText tracking-tight">
              My Work
            </h2>
          </div>
          <p className="text-mutedText text-sm sm:text-base max-w-md">
            Explore recent web applications, mobile products, and engineering projects crafted with modern tech stacks.
          </p>
        </div>

        {/* 6 Projects Grid: 2 rows of 3 columns on desktop, responsive 1 column fallback */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch min-h-[500px]">
          {currentProjects.map((proj, idx) => (
            <ProjectCard
              key={proj._id}
              proj={proj}
              index={startIndex + idx}
            />
          ))}
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
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "bg-brandAccent border-brandAccent text-white shadow-lg shadow-brandAccent/25 scale-105"
                            : "bg-surface border-borderSubtle text-primaryText hover:border-brandAccent hover:text-brandAccent"
                        }`}
                        aria-label={`Page ${pageNum}`}
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

          {/* View All Work Link */}
          <Link
            href="/work"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-surface border border-borderSubtle text-primaryText font-extrabold text-xs sm:text-sm hover:bg-borderSubtle hover:border-brandAccent hover:text-brandAccent transition-all duration-300 shadow-md group whitespace-nowrap cursor-pointer"
          >
            <span>View All Work</span>
            <RiArrowRightLine className="text-base group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

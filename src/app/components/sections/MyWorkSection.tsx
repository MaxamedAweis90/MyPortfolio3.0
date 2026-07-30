"use client";
import React from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projectsData } from "@/data/portfolioData";
import { RiArrowRightLine } from "react-icons/ri";

export default function MyWorkSection() {
  // 1. Card 1 ("Best Project"): find project with isBest === true, fallback to first project
  const bestProject =
    projectsData.find((p) => p.isBest) || projectsData[0];

  // 2. Cards 2 & 3 ("Latest Projects"): remaining projects sorted by createdAt (descending)
  const remainingLatest = projectsData
    .filter((p) => p._id !== bestProject?._id)
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

  // Combine into strictly 3 cards: Card 1 = Best, Cards 2 & 3 = Latest 2
  const homeProjects = bestProject
    ? [bestProject, ...remainingLatest.slice(0, 2)]
    : projectsData.slice(0, 3);

  return (
    <section
      id="work"
      className="py-20 px-4 sm:px-8 lg:px-16 bg-mainBg border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondaryAccent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
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

        {/* 3 Featured Projects Desktop Row (1 column on mobile, 3 columns on md/lg) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {homeProjects.map((proj, idx) => (
            <ProjectCard key={proj._id} proj={proj} index={idx} />
          ))}
        </div>

        {/* Bottom Right Action Button: "More →" redirecting to ./work */}
        <div className="flex justify-end pt-4">
          <Link
            href="/work"
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-surface border border-borderSubtle text-primaryText font-extrabold text-sm sm:text-base hover:bg-borderSubtle hover:border-brandAccent hover:text-brandAccent transition-all duration-300 shadow-md group"
          >
            <span>More</span>
            <RiArrowRightLine className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

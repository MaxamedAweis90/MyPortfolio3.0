"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { experiencesData } from "@/data/experienceData";
import {
  RiBriefcase4Line,
  RiArrowRightLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiSparklingFill,
} from "react-icons/ri";

export default function ExperienceSection() {
  // Show the 3 latest experiences on the home page as requested
  const latestExperiences = experiencesData.slice(0, 3);

  return (
    <section
      id="experience"
      className="py-20 lg:py-28 bg-mainBg border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-brandAccent/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondaryAccent/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Header (Matching Reference Design: "WHAT I HAVE DONE SO FAR" / "Work Experience.") */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-2"
        >
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-mutedText/80">
            WHAT I HAVE DONE SO FAR
          </p>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-primaryText tracking-tight">
            Work Experience<span className="text-brandAccent">.</span>
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Central Glowing Vertical Spine Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-12 -translate-x-1/2 w-[3px] bg-gradient-to-b from-brandAccent via-cyan-400 to-borderSubtle/30 shadow-[0_0_15px_rgba(11,130,236,0.6)]" />

          {/* Left Vertical Spine Line (Mobile / Tablet) */}
          <div className="block lg:hidden absolute left-6 sm:left-8 top-4 bottom-12 w-[3px] bg-gradient-to-b from-brandAccent via-cyan-400 to-borderSubtle/30 shadow-[0_0_12px_rgba(11,130,236,0.5)]" />

          {/* Experience Items List */}
          <div className="space-y-12 lg:space-y-20">
            {latestExperiences.map((exp, index) => {
              const isEven = index % 2 === 0; // Left on desktop if even, Right if odd

              return (
                <div
                  key={exp.id}
                  className="relative flex flex-col lg:flex-row items-center justify-between"
                >
                  {/* Desktop Date on Left (for odd items) OR Card on Left (for even items) */}
                  <div className="w-full lg:w-[45%] flex justify-start lg:justify-end order-2 lg:order-1 pl-16 sm:pl-20 lg:pl-0">
                    {isEven ? (
                      /* Left Card (Even Index) */
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="w-full bg-surface/90 backdrop-blur-xl border border-borderSubtle hover:border-brandAccent/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 relative group text-left"
                      >
                        {/* Header */}
                        <div className="border-b border-borderSubtle/60 pb-4 mb-4">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-primaryText group-hover:text-brandAccent transition-colors">
                              {exp.role}
                            </h3>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${exp.badgeColor} ${exp.badgeBg}`}>
                              {exp.type}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-mutedText mt-1">
                            {exp.company} • <span className="text-xs text-mutedText/80">{exp.location}</span>
                          </p>
                          {/* Mobile-only date indicator */}
                          <p className="text-xs font-mono text-brandAccent font-semibold mt-2 lg:hidden flex items-center gap-1.5">
                            <RiTimeLine /> {exp.period}
                          </p>
                        </div>

                        {/* Bullet Highlights */}
                        <ul className="space-y-2.5 text-xs sm:text-sm text-mutedText leading-relaxed mb-5">
                          {exp.highlights.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brandAccent mt-1.5 shrink-0 shadow-[0_0_6px_#0B82EC]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-borderSubtle/50">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-mainBg text-primaryText/90 border border-borderSubtle/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      /* Left Date Display (Odd Index on Desktop) */
                      <div className="hidden lg:flex items-center gap-2 text-base font-mono font-bold text-mutedText/90 pr-8">
                        <RiTimeLine className="text-brandAccent text-lg" />
                        <span>{exp.period}</span>
                      </div>
                    )}
                  </div>

                  {/* Central Node Badge */}
                  <div className="absolute left-6 sm:left-8 lg:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center top-0 lg:top-1/2 lg:-translate-y-1/2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface border-2 border-cyan-400 shadow-[0_0_20px_rgba(11,130,236,0.6)] flex items-center justify-center text-primaryText font-extrabold text-sm sm:text-base tracking-wider ring-4 ring-mainBg">
                      {exp.companyShort}
                    </div>
                  </div>

                  {/* Desktop Date on Right (for even items) OR Card on Right (for odd items) */}
                  <div className="w-full lg:w-[45%] flex justify-start order-3 lg:order-3 pl-16 sm:pl-20 lg:pl-0 mt-4 lg:mt-0">
                    {!isEven ? (
                      /* Right Card (Odd Index) */
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="w-full bg-surface/90 backdrop-blur-xl border border-borderSubtle hover:border-brandAccent/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 relative group text-left"
                      >
                        {/* Header */}
                        <div className="border-b border-borderSubtle/60 pb-4 mb-4">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-primaryText group-hover:text-brandAccent transition-colors">
                              {exp.role}
                            </h3>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${exp.badgeColor} ${exp.badgeBg}`}>
                              {exp.type}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-mutedText mt-1">
                            {exp.company} • <span className="text-xs text-mutedText/80">{exp.location}</span>
                          </p>
                          {/* Mobile-only date indicator */}
                          <p className="text-xs font-mono text-cyan-400 font-semibold mt-2 lg:hidden flex items-center gap-1.5">
                            <RiTimeLine /> {exp.period}
                          </p>
                        </div>

                        {/* Bullet Highlights */}
                        <ul className="space-y-2.5 text-xs sm:text-sm text-mutedText leading-relaxed mb-5">
                          {exp.highlights.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brandAccent mt-1.5 shrink-0 shadow-[0_0_6px_#0B82EC]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-borderSubtle/50">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-mainBg text-primaryText/90 border border-borderSubtle/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      /* Right Date Display (Even Index on Desktop) */
                      <div className="hidden lg:flex items-center gap-2 text-base font-mono font-bold text-mutedText/90 pl-8">
                        <RiTimeLine className="text-brandAccent text-lg" />
                        <span>{exp.period}</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Load More / Extended Career Path Action Button at the end */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <Link
            href="/experience"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-brandAccent to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-brandAccent/25 hover:shadow-brandAccent/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-cyan-300/40 group"
          >
            <RiBriefcase4Line className="text-xl group-hover:rotate-12 transition-transform" />
            <span>VIEW FULL EXPERIENCE & CAREER TIMELINE</span>
            <RiArrowRightLine className="text-lg group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-mutedText mt-3">
            Includes education, software certifications, and detailed project archives.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  experiencesData,
  educationData,
  certificationsData,
} from "@/data/experienceData";
import {
  RiArrowLeftLine,
  RiBriefcase4Line,
  RiGraduationCapLine,
  RiAwardLine,
  RiTimeLine,
  RiSparklingFill,
  RiCheckDoubleLine,
  RiSendPlaneFill,
} from "react-icons/ri";

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-mainBg text-primaryText pt-28 pb-20 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brandAccent/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-secondaryAccent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/90 border border-borderSubtle text-sm font-semibold text-mutedText hover:text-primaryText hover:border-brandAccent/40 transition-colors shadow-sm"
          >
            <RiArrowLeftLine className="text-base" /> Back to Home
          </Link>
          <span className="text-xs font-mono font-bold text-brandAccent bg-brandAccent/10 px-3 py-1 rounded-full border border-brandAccent/30">
            CAREER & EDUCATION
          </span>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandAccent/10 border border-brandAccent/30 text-brandAccent text-xs font-bold uppercase tracking-widest">
            <RiSparklingFill className="text-sm" /> Detailed Career Archive
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-primaryText tracking-tight">
            Complete Experience Timeline<span className="text-brandAccent">.</span>
          </h1>
          <p className="text-mutedText text-sm sm:text-base leading-relaxed">
            A comprehensive overview of my software engineering positions, internships, university education, and professional development certifications.
          </p>
        </motion.div>

        {/* Section 1: Professional Experience Timeline */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-borderSubtle/70 pb-4">
            <span className="p-3 rounded-2xl bg-brandAccent/10 text-brandAccent border border-brandAccent/20 text-2xl shadow-inner">
              <RiBriefcase4Line />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primaryText">
                Work Experience & Internships
              </h2>
              <p className="text-xs text-mutedText">
                Production web applications, API engineering, and software delivery
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {experiencesData.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface/90 backdrop-blur-xl border border-borderSubtle hover:border-brandAccent/50 rounded-3xl p-6 sm:p-8 shadow-xl transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderSubtle/60 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-mainBg border border-borderSubtle flex items-center justify-center font-extrabold text-brandAccent text-base shadow-inner">
                      {exp.companyShort}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-primaryText">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-mutedText">
                        {exp.company} • <span className="text-xs text-mutedText/80">{exp.location}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-brandAccent bg-mainBg px-3 py-1 rounded-xl border border-borderSubtle flex items-center gap-1.5">
                      <RiTimeLine /> {exp.period}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${exp.badgeColor} ${exp.badgeBg}`}>
                      {exp.type}
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-primaryText uppercase tracking-wider">
                    Key Contributions & Responsibilities:
                  </p>
                  <ul className="space-y-2 text-sm text-mutedText leading-relaxed">
                    {exp.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brandAccent mt-2 shrink-0 shadow-[0_0_6px_#0B82EC]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Chips */}
                <div className="pt-2 flex flex-wrap gap-2 border-t border-borderSubtle/50">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-semibold px-3 py-1 rounded-xl bg-mainBg text-primaryText/90 border border-borderSubtle shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: Education & Academic Background */}
        <div className="space-y-8 pt-6">
          <div className="flex items-center gap-3 border-b border-borderSubtle/70 pb-4">
            <span className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-2xl shadow-inner">
              <RiGraduationCapLine />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primaryText">
                Education
              </h2>
              <p className="text-xs text-mutedText">
                Academic foundation in computer science and information technology
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {educationData.map((edu, idx) => (
              <div
                key={idx}
                className="bg-surface/90 backdrop-blur-xl border border-borderSubtle rounded-3xl p-6 sm:p-8 shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-primaryText">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-emerald-400">
                      {edu.institution} • <span className="text-xs text-mutedText">{edu.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-mutedText bg-mainBg px-3 py-1 rounded-xl border border-borderSubtle w-max">
                    {edu.period}
                  </span>
                </div>
                <p className="text-sm text-mutedText leading-relaxed">
                  {edu.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Professional Certifications */}
        <div className="space-y-8 pt-6">
          <div className="flex items-center gap-3 border-b border-borderSubtle/70 pb-4">
            <span className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-2xl shadow-inner">
              <RiAwardLine />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primaryText">
                Certifications & Specializations
              </h2>
              <p className="text-xs text-mutedText">
                Verified industry credentials & professional continuous learning
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificationsData.map((cert, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface/85 backdrop-blur-md border border-borderSubtle hover:border-purple-400/40 transition-all flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 text-lg">
                    <RiAwardLine />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-primaryText">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-mutedText mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 shrink-0 ml-2">
                  {cert.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-surface/90 border border-brandAccent/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-primaryText">
              Interested in working together?
            </h3>
            <p className="text-sm text-mutedText">
              Feel free to reach out for full-time opportunities, contracts, or engineering collaborations.
            </p>
          </div>
          <Link
            href="/#contact"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-brandAccent/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <RiSendPlaneFill /> Get in Touch
          </Link>
        </div>

      </div>
    </div>
  );
}

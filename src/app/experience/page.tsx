"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type {
  ExperienceItem,
  CertificateItem,
} from "@/data/experienceData";
import {
  RiBriefcase4Line,
  RiGraduationCapLine,
  RiAwardLine,
  RiTimeLine,
  RiSparklingFill,
  RiSendPlaneFill,
} from "react-icons/ri";
import {
  ExternalLink,
  Eye,
  FileText,
  Download,
  Copy,
  Check,
  X,
  Award,
  Building2,
  ShieldCheck,
  Maximize2,
} from "lucide-react";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<CertificateItem[]>([]);
  const [activeSection, setActiveSection] = useState<"experience" | "education" | "certificates">("experience");

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [certViewMode, setCertViewMode] = useState<"image" | "pdf">("image");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetch("/api/ugaas/experience", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const careerDocs = (data.experiences || []).filter((e: any) => e.type === "career");
          const eduDocs = (data.experiences || []).filter((e: any) => e.type === "education");

          const sortedCareer = careerDocs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          setExperiences(
            sortedCareer.map((doc: any) => ({
              id: doc.id || doc._id,
              role: doc.role,
              company: doc.company,
              companyShort:
                doc.company
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 4) || "EXP",
              location: doc.badges?.[0] || "Banadir, Somalia",
              period: doc.duration || "Present",
              type: doc.badges?.[1] || doc.badges?.[0] || "Career Experience",
              badgeBg: "bg-blue-500/10",
              badgeColor: "text-blue-400 border-blue-500/30",
              highlights: doc.highlights || [],
              technologies: doc.techStack || [],
            }))
          );

          const sortedEdu = eduDocs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          setEducation(
            sortedEdu.map((doc: any) => ({
              degree: doc.role,
              institution: doc.company,
              period: doc.duration,
              location: doc.badges?.[0] || "Somalia",
              details: doc.highlights?.[0] || "",
              relevantCourses: doc.techStack || [],
            }))
          );

          // 1. Merge certificates collection and certification experience entries
          const allCertItems: (CertificateItem & { order?: number })[] = [];

          if (Array.isArray(data.certificates)) {
            data.certificates.forEach((c: any) => {
              allCertItems.push({
                name: c.title,
                issuer: c.issuer || "Certificate Authority",
                date: c.createdAt ? new Date(c.createdAt).getFullYear().toString() : "2024",
                image: c.image || "/Hero3DMe.png",
                pdfUrl: c.pdfUrl || (c.link && c.link.endsWith(".pdf") ? c.link : (c.image?.endsWith(".pdf") ? c.image : "/resume.pdf")),
                verifyUrl: c.link || c.credentialUrl || "",
                credentialId: c.code || c.credentialId || "",
                badge: c.category || "Professional Certification",
                category: c.category || "Certification",
                order: c.order || 0,
              });
            });
          }

          if (Array.isArray(data.experiences)) {
            data.experiences
              .filter((e: any) => e.type === "certification")
              .forEach((e: any) => {
                allCertItems.push({
                  name: e.role,
                  issuer: e.company || "Certificate Authority",
                  date: e.duration || "2024",
                  image: e.image || "/Hero3DMe.png",
                  pdfUrl: e.image?.endsWith(".pdf") ? e.image : "/resume.pdf",
                  verifyUrl: e.credentialUrl || "",
                  credentialId: e.credentialId || "",
                  badge: e.badges?.[0] || "Verified Credential",
                  category: e.badges?.[0] || "Certification",
                  order: e.order || 0,
                });
              });
          }

          // Deduplicate by name
          const uniqueMap = new Map();
          allCertItems.forEach((item) => {
            if (item.name && !uniqueMap.has(item.name)) {
              uniqueMap.set(item.name, item);
            }
          });
          const sortedCerts = Array.from(uniqueMap.values()).sort(
            (a: any, b: any) => (a.order || 0) - (b.order || 0)
          );
          setCertifications(sortedCerts);
        }
      })
      .catch(() => {});
  }, []);

  // ScrollSpy listener to update active section pill
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const expEl = document.getElementById("experience");
      const eduEl = document.getElementById("education");
      const certEl = document.getElementById("certificates");

      if (certEl && scrollPos >= certEl.offsetTop) {
        setActiveSection("certificates");
      } else if (eduEl && scrollPos >= eduEl.offsetTop) {
        setActiveSection("education");
      } else if (expEl) {
        setActiveSection("experience");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleCopyCredential = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-mainBg text-primaryText pt-28 md:pt-32 pb-20 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brandAccent/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-secondaryAccent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
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
            A comprehensive overview of my software engineering positions, internships, university education, and verified certifications.
          </p>
        </motion.div>

        {/* Sticky In-Page Navigation Bar */}
        <div className="sticky top-20 md:top-24 z-40 flex justify-center py-2">
          <div className="p-1.5 rounded-full bg-surface/85 backdrop-blur-xl border border-borderSubtle shadow-xl flex items-center gap-1.5 sm:gap-2">
            {[
              { id: "experience", label: "Work Experience", icon: RiBriefcase4Line },
              { id: "education", label: "Education", icon: RiGraduationCapLine },
              { id: "certificates", label: "Certificates", icon: RiAwardLine },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#0B82EC] text-white shadow-lg shadow-[#0B82EC]/25 scale-105"
                      : "text-mutedText hover:text-primaryText hover:bg-mainBg/60"
                  }`}
                >
                  <Icon className="text-sm sm:text-base" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: Professional Experience Timeline */}
        <section id="experience" className="space-y-8 scroll-mt-28">
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

          {experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
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
          ) : (
            <div className="p-8 text-center bg-surface/50 border border-borderSubtle rounded-3xl text-mutedText">
              <p className="text-sm">No work experience records found yet.</p>
            </div>
          )}
        </section>

        {/* Section 2: Education & Academic Background */}
        <section id="education" className="space-y-8 pt-6 scroll-mt-28">
          <div className="flex items-center gap-3 border-b border-borderSubtle/70 pb-4">
            <span className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-2xl shadow-inner">
              <RiGraduationCapLine />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primaryText">
                Education & Degrees
              </h2>
              <p className="text-xs text-mutedText">
                Academic foundation in computer science and information technology
              </p>
            </div>
          </div>

          {education.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {education.map((edu, idx) => (
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
          ) : (
            <div className="p-8 text-center bg-surface/50 border border-borderSubtle rounded-3xl text-mutedText">
              <p className="text-sm">No education records found yet.</p>
            </div>
          )}
        </section>

        {/* Section 3: Professional Certifications (Consistent 16:10 Ratio & Interactive PDF/Image Preview) */}
        <section id="certificates" className="space-y-8 pt-6 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderSubtle/70 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-2xl shadow-inner">
                <RiAwardLine />
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primaryText">
                  Certifications & Accreditations
                </h2>
                <p className="text-xs text-mutedText">
                  Verified credentials with interactive image and PDF document previews
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 self-start sm:self-auto">
              {certifications.length} Credentials
            </span>
          </div>

          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.2) }}
                className="group bg-surface/90 backdrop-blur-xl border border-borderSubtle hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* 1. Consistent 16:10 Certificate Image Preview Container */}
                <div
                  onClick={() => {
                    setSelectedCert(cert);
                    setCertViewMode(cert.pdfUrl ? "image" : "image");
                  }}
                  className="relative aspect-[16/10] w-full bg-gradient-to-br from-purple-900/20 via-mainBg to-surface cursor-pointer overflow-hidden border-b border-borderSubtle/80 flex items-center justify-center group"
                >
                  <Image
                    src={cert.image || "/intro-Cover.jpg"}
                    alt={cert.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay & Hover Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-purple-300 flex items-center gap-1.5 shadow-md">
                        <ShieldCheck className="w-3 h-3 text-purple-400" />
                        <span>{cert.badge || "Verified"}</span>
                      </span>

                      <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-white text-xs font-semibold">
                      <span className="flex items-center gap-1 text-purple-200">
                        <Eye className="w-3.5 h-3.5" /> Click to Preview
                      </span>
                      {cert.pdfUrl && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                          <FileText className="w-3 h-3" /> PDF Included
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Certificate Meta Details */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{cert.issuer}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-mutedText bg-mainBg px-2.5 py-0.5 rounded-lg border border-borderSubtle">
                        {cert.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-primaryText group-hover:text-purple-400 transition-colors line-clamp-2">
                      {cert.name}
                    </h3>

                    {cert.credentialId && (
                      <p className="text-[11px] font-mono text-mutedText flex items-center gap-1.5">
                        <span>ID:</span>
                        <span className="bg-mainBg px-2 py-0.5 rounded border border-borderSubtle text-primaryText/90">
                          {cert.credentialId}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* 3. Action Buttons Row */}
                  <div className="pt-3 border-t border-borderSubtle/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCert(cert);
                        setCertViewMode("image");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primaryText hover:text-purple-400 transition-colors py-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Preview</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {cert.pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCert(cert);
                            setCertViewMode("pdf");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mainBg border border-borderSubtle hover:border-purple-400/50 text-xs font-semibold text-mutedText hover:text-purple-400 transition-all cursor-pointer"
                          title="Open PDF Document View"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      )}

                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-xs font-bold text-purple-400 transition-all cursor-pointer"
                          title="Verify Certificate"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          ) : (
            <div className="p-8 text-center bg-surface/50 border border-borderSubtle rounded-3xl text-mutedText">
              <p className="text-sm">No certificate records found yet.</p>
            </div>
          )}
        </section>

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

      {/* 4. Interactive Full Certificate Preview Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-4xl bg-surface border border-borderSubtle rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-borderSubtle flex items-center justify-between gap-4 bg-surface/90">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
                      <Award className="w-4 h-4" />
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-primaryText truncate">
                      {selectedCert.name}
                    </h3>
                  </div>
                  <p className="text-xs text-mutedText truncate pl-8">
                    Issued by <strong className="text-primaryText">{selectedCert.issuer}</strong> • {selectedCert.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View Mode Switcher (Image vs PDF) */}
                  {selectedCert.pdfUrl && (
                    <div className="p-1 rounded-xl bg-mainBg border border-borderSubtle flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCertViewMode("image")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          certViewMode === "image"
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-mutedText hover:text-primaryText"
                        }`}
                      >
                        Image View
                      </button>
                      <button
                        type="button"
                        onClick={() => setCertViewMode("pdf")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          certViewMode === "pdf"
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-mutedText hover:text-primaryText"
                        }`}
                      >
                        PDF Document
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-full bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body Preview */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-mainBg flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px]">
                {certViewMode === "image" ? (
                  <div className="relative w-full max-w-2xl aspect-[16/10] rounded-2xl overflow-hidden border border-borderSubtle shadow-2xl bg-black/40">
                    <Image
                      src={selectedCert.image || "/intro-Cover.jpg"}
                      alt={selectedCert.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 672px"
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-borderSubtle bg-surface">
                    <iframe
                      src={selectedCert.pdfUrl || "/resume.pdf"}
                      className="w-full h-full border-none"
                      title={`${selectedCert.name} PDF Preview`}
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer with Actions */}
              <div className="p-4 sm:p-5 border-t border-borderSubtle bg-surface/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedCert.credentialId && (
                    <button
                      type="button"
                      onClick={() => handleCopyCredential(selectedCert.credentialId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText transition-all font-mono"
                      title="Copy Credential ID"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">ID Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>ID: {selectedCert.credentialId}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  {selectedCert.pdfUrl && (
                    <a
                      href={selectedCert.pdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mainBg border border-borderSubtle hover:border-purple-400 text-primaryText font-bold transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </a>
                  )}

                  {selectedCert.verifyUrl && (
                    <a
                      href={selectedCert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-600/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify Credential</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


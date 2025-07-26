"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiReact,
  SiVite,
  SiNextdotjs,
  SiTailwindcss,
  SiFirebase,
  SiSupabase,
  SiJavascript,
  SiTypescript,
  SiFlutter,
  SiSanity,
} from "react-icons/si";

const TOOL_ICONS = {
  "Vite + React": (
    <>
      <SiVite className="text-purple-500" />
      <SiReact className="text-blue-500" />
    </>
  ),
  "Next.js": <SiNextdotjs className="text-black" />,
  Tailwind: <SiTailwindcss className="text-teal-400" />,
  Firebase: <SiFirebase className="text-yellow-500" />,
  Supabase: <SiSupabase className="text-green-500" />,
  JavaScript: <SiJavascript className="text-yellow-400" />,
  TypeScript: <SiTypescript className="text-blue-600" />,
  Flutter: <SiFlutter className="text-blue-400" />,
  "Sanity.io": <SiSanity className="text-red-500" />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.4 },
  }),
};

export default function ClientProjectGrid({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Web", "Mobile", "Design"];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="sticky top-0 z-10 py-6">
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-full px-4 py-2 shadow-md gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
        layout
      >
        <AnimatePresence>
          {filtered.map((proj, idx) => (
            <ProjectCard key={proj._id} proj={proj} index={idx} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ProjectCard({ proj, index }) {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      className="relative bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => router.push(`/work/${proj.slug}`)}
    >
      {/* Image */}
      <div className="relative h-[480px] overflow-hidden rounded-t-2xl">
        <img
          src={proj.images?.[0]}
          alt={proj.title}
          className="w-full h-full object-cover"
        />

        {/* Hover Content Overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 px-6 text-center text-white transition-opacity duration-300 ${
            hovering ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-xl font-semibold">{proj.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{proj.description}</p>

          {/* Tools Icons */}
          {proj.tools?.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center mt-4 text-xl">
              {proj.tools.map((tool) => (
                <span key={tool} title={tool}>
                  {TOOL_ICONS[tool] || "🔧"}
                </span>
              ))}
            </div>
          )}

          {/* Live View link */}
          {proj.liveProjectUrl && (
            <a
              href={proj.liveProjectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Live View →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

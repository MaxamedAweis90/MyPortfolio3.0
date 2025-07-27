"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ClientProjectGrid.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { TOOL_ICONS } from "@/components/toolIcons";

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
      <div className={styles.filterBarContainer}>
        <div className={styles.filterBar}>
          <div className={styles.filterButtons}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.filterButton} ${
                  activeCategory === cat ? styles.filterButtonActive : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div className={styles.projectGrid} layout>
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
  const toolCount = proj.tools?.length || 0;

  const toolClass =
    toolCount > 3
      ? styles.manyToolsDesktop
      : toolCount > 2
      ? styles.manyToolsTablet
      : styles.fewTools;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      className={styles.projectCard}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={proj.images?.[0]}
          alt={proj.title}
          className={styles.image}
        />

        <div
          className={`${styles.cardOverlay} ${hovering ? styles.hovering : ""}`}
        >
          <div className="flex justify-start">
            <h2 className={styles.cardTitle}>{proj.title}</h2>
          </div>

          <div className={styles.cardDescription}>
            <p>{proj.description}</p>
          </div>

          <div className={styles.cardFooter}>
            <div className={`${styles.toolList} ${toolClass}`}>
            {proj.tools?.map((tool) => {
  if (!tool || !tool.icon || !tool.title || !tool.color) return null;

  const IconComponent = TOOL_ICONS[tool.icon]; // 🟢 use icon field from Sanity
  const isTailwind = tool.color.startsWith("text-");

  return (
    <span
      key={tool._id || tool.title}
      className={`${styles.cardTool} ${isTailwind ? tool.color : ""}`}
      style={!isTailwind ? { color: tool.color } : {}}
    >
      {IconComponent ? (
        <IconComponent className="text-base" />
      ) : (
        "🔧"
      )}
      <span className={styles.toolLabel}>{tool.title}</span>
      <div className={styles.tooltip}>
        {tool.title}
        <div className={styles.tooltipArrow} />
      </div>
    </span>
  );
})}


            </div>

            {proj.liveProjectUrl && (
              <a
                href={proj.liveProjectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={styles.cardLiveLink}
              >
                Live View →
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

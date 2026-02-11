"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ClientProjectGrid.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { TOOL_ICONS } from "@/components/toolIcons";
import type { Project, Tool } from "@/types/sanity";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.15,
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
  const [activeCategory, setActiveCategory] = useState("Web");
  const categories = ["Web", "Mobile", "Design"];

  const filtered = projects.filter((p) => p.category === activeCategory);

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

      <motion.div
        className={styles.projectGrid}
        layout
        key={activeCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {filtered.map((proj, idx) => (
            <ProjectCard key={proj._id} proj={proj} index={idx} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

type ProjectCardProps = {
  proj: Project;
  index: number;
};

function ProjectCard({ proj, index }: ProjectCardProps) {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const isMobileApp = proj.category === "Mobile";
  const detailHref = proj.slug ? `/work/${proj.slug}` : undefined;
  const toolCount = proj.tools?.length || 0;

  const toolClass =
    toolCount > 3
      ? styles.manyToolsDesktop
      : toolCount > 2
      ? styles.manyToolsTablet
      : styles.fewTools;

  if (isMobileApp) {
    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        exit="exit"
        layout
        layoutId={proj._id}
        className={styles.mobileAppCard}
        onClick={() => detailHref && router.push(detailHref)}
      >
        <div className={styles.mobileAppBanner}>
          {proj.images?.[0] && (
            <img
              src={proj.images[0]}
              alt={proj.title}
              className={styles.mobileAppBannerImage}
            />
          )}
          <div className={styles.mobileAppBannerOverlay} />
        </div>

        <div className={styles.mobileAppMeta}>
          {proj.appIconUrl && (
            <img
              src={proj.appIconUrl}
              alt={`${proj.title} icon`}
              className={styles.mobileAppIcon}
            />
          )}
          <div className={styles.mobileAppText}>
            <h3 className={styles.mobileAppTitle}>{proj.title}</h3>
            {proj.shortTagline && (
              <p className={styles.mobileAppTagline}>{proj.shortTagline}</p>
            )}
          </div>
          {detailHref && (
            <Link
              href={`${detailHref}?install=1`}
              onClick={(e) => e.stopPropagation()}
              className={styles.mobileInstallButton}
            >
              Install
            </Link>
          )}
        </div>

        <div className={styles.mobileAppRow}>
          <div className={styles.mobileAppRowLeft}>
            {proj.appIconUrl && (
              <img
                src={proj.appIconUrl}
                alt={`${proj.title} icon`}
                className={styles.mobileAppIcon}
              />
            )}
            <div>
              <h3 className={styles.mobileAppTitle}>{proj.title}</h3>
              {proj.shortTagline && (
                <p className={styles.mobileAppTagline}>{proj.shortTagline}</p>
              )}
            </div>
          </div>
          {detailHref && (
            <Link
              href={`${detailHref}?install=1`}
              onClick={(e) => e.stopPropagation()}
              className={styles.mobileInstallButton}
            >
              Install
            </Link>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      exit="exit"
      layout
      layoutId={proj._id}
      className={styles.projectCard}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => detailHref && router.push(detailHref)}
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
                if (!tool || !tool.icon || !tool.title || !tool.color)
                  return null;

                const IconComponent = TOOL_ICONS[tool.icon];
                const isTailwind = tool.color.startsWith("text-");

                return (
                  <span
                    key={tool._id || tool.title}
                    className={`${styles.cardTool} ${
                      isTailwind ? tool.color : ""
                    }`}
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

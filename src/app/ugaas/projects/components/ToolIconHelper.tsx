import React from "react";
import { TOOL_ICONS } from "@/components/toolIcons";
import { Code, Terminal } from "lucide-react";
import type { IconType } from "react-icons";

// Popular tool preset catalogue mapped to exact/sanitized toolIcons keys
export const POPULAR_TOOLS: { name: string; iconKey: string; color: string }[] = [
  { name: "Next.js", iconKey: "SiNextdotjs", color: "#ffffff" },
  { name: "React", iconKey: "SiReact", color: "#61DAFB" },
  { name: "TypeScript", iconKey: "SiTypescript", color: "#3178C6" },
  { name: "JavaScript", iconKey: "SiJavascript", color: "#F7DF1E" },
  { name: "TailwindCSS", iconKey: "SiTailwindcss", color: "#06B6D4" },
  { name: "Node.js", iconKey: "SiNodedotjs", color: "#5FA04E" },
  { name: "MongoDB", iconKey: "SiMongodb", color: "#47A248" },
  { name: "Flutter", iconKey: "SiFlutter", color: "#02569B" },
  { name: "Firebase", iconKey: "SiFirebase", color: "#FFCA28" },
  { name: "Python", iconKey: "SiPython", color: "#3776AB" },
  { name: "PostgreSQL", iconKey: "SiPostgresql", color: "#4169E1" },
  { name: "Docker", iconKey: "SiDocker", color: "#2496ED" },
  { name: "Figma", iconKey: "SiFigma", color: "#F24E1E" },
  { name: "GraphQL", iconKey: "SiGraphql", color: "#E10098" },
  { name: "Redux", iconKey: "SiRedux", color: "#764ABC" },
  { name: "Supabase", iconKey: "SiSupabase", color: "#3ECF8E" },
  { name: "Prisma", iconKey: "SiPrisma", color: "#2D3748" },
  { name: "Express", iconKey: "SiExpress", color: "#ffffff" },
  { name: "NestJS", iconKey: "SiNestjs", color: "#E0234E" },
  { name: "Stripe", iconKey: "SiStripe", color: "#635BFF" },
  { name: "Swift", iconKey: "SiSwift", color: "#F05138" },
  { name: "Kotlin", iconKey: "SiKotlin", color: "#7F52FF" },
  { name: "Android", iconKey: "SiAndroid", color: "#3DDC84" },
  { name: "Apple", iconKey: "FaApple", color: "#ffffff" },
  { name: "Google Play", iconKey: "FaGooglePlay", color: "#00E676" },
  { name: "Vercel", iconKey: "SiVercel", color: "#ffffff" },
  { name: "AWS", iconKey: "SiAmazonwebservices", color: "#FF9900" },
  { name: "Git", iconKey: "SiGit", color: "#F05032" },
  { name: "GitHub", iconKey: "SiGithub", color: "#ffffff" },
  { name: "Linux", iconKey: "SiLinux", color: "#FCC624" },
  { name: "Framer Motion", iconKey: "SiFramer", color: "#0055FF" },
  { name: "Three.js", iconKey: "SiThreedotjs", color: "#ffffff" },
  { name: "GSAP", iconKey: "SiGreensock", color: "#88CE02" },
  { name: "HTML5", iconKey: "SiHtml5", color: "#E34F26" },
  { name: "CSS3", iconKey: "SiCss3", color: "#1572B6" },
  { name: "Sass", iconKey: "SiSass", color: "#CC6699" },
  { name: "Vite", iconKey: "SiVite", color: "#646CFF" },
  { name: "Sanity", iconKey: "SiSanity", color: "#F03E2F" },
];

/**
 * Returns the matching icon component for a tool name
 */
export function getToolIcon(toolName: string): IconType | React.ComponentType<{ className?: string }> {
  if (!toolName) return Code;

  // 1. Exact match in TOOL_ICONS
  if (TOOL_ICONS[toolName]) {
    return TOOL_ICONS[toolName];
  }

  // 2. Check in POPULAR_TOOLS catalogue
  const found = POPULAR_TOOLS.find(
    (t) => t.name.toLowerCase() === toolName.toLowerCase()
  );
  if (found && TOOL_ICONS[found.iconKey]) {
    return TOOL_ICONS[found.iconKey];
  }

  // 3. Sanitized match (e.g. "React" -> "SiReact", "Next.js" -> "SiNextdotjs")
  const sanitized =
    "Si" +
    toolName
      .replace(/\.js/i, "dotjs")
      .replace(/\.ts/i, "dotts")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

  const matchingKey = Object.keys(TOOL_ICONS).find(
    (k) => k.toLowerCase() === sanitized
  );
  if (matchingKey && TOOL_ICONS[matchingKey]) {
    return TOOL_ICONS[matchingKey];
  }

  // 4. Check "Fa" or "Bi" prefix
  const faKey = "Fa" + toolName.replace(/[^a-zA-Z0-9]/g, "");
  if (TOOL_ICONS[faKey]) return TOOL_ICONS[faKey];

  // 5. Fallback generic icon
  return Terminal;
}

interface ToolBadgeProps {
  tool: string;
  onRemove?: () => void;
  className?: string;
}

export function ToolBadge({ tool, onRemove, className = "" }: ToolBadgeProps) {
  const IconComponent = getToolIcon(tool);

  return (
    <span
      data-tool-badge
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#111622] border border-[#222938] text-primaryText shadow-sm hover:border-[#0B82EC]/50 transition-colors ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 text-[#0B82EC] shrink-0" />
      <span className="text-primaryText font-medium">{tool}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-mutedText hover:text-red-400 focus:outline-none cursor-pointer"
          aria-label={`Remove ${tool}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

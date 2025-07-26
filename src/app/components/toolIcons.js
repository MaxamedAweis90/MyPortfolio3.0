// src/app/components/toolIcons.js
import { BiLogoVisualStudio } from "react-icons/bi";
import {
	// Frontend & Frameworks
	SiReact,
	SiVite,
	SiNextdotjs,
	SiTailwindcss,
	SiJavascript,
	SiTypescript,
	SiFlutter,
  
	// Backend & DB
	SiFirebase,
	SiSupabase,
	SiMongodb,
	SiExpress,
	SiNodedotjs,
	SiMysql,
	SiPostgresql,
  
	// CMS & Hosting
	SiSanity,
	SiWordpress,
	SiVercel,
	SiNetlify,
  
	// DevOps
	SiDocker,
  
	// Design & Productivity
	SiFigma,
	SiCanva,
	SiAdobexd,
	SiAdobephotoshop,
	SiAdobeillustrator,
  
	// Dev & Team Tools
	SiGithub,
	SiGit,
	SiNotion,
	SiTrello,
	SiSlack,
	SiZoom,
  } from "react-icons/si";
  
  export const TOOL_ICONS = {
	// Frontend
	"Vite + React": (
	  <>
		<SiVite className="text-purple-500" />
		<SiReact className="text-blue-500" />
	  </>
	),
	"Next.js": <SiNextdotjs className="text-black" />,
	Tailwind: <SiTailwindcss className="text-teal-400" />,
	JavaScript: <SiJavascript className="text-yellow-400" />,
	TypeScript: <SiTypescript className="text-blue-600" />,
	Flutter: <SiFlutter className="text-blue-400" />,
  
	// Backend / DB
	Firebase: <SiFirebase className="text-yellow-500" />,
	Supabase: <SiSupabase className="text-green-500" />,
	MongoDB: <SiMongodb className="text-green-600" />,
	Express: <SiExpress className="text-gray-700" />,
	NodeJS: <SiNodedotjs className="text-green-700" />,
	MySQL: <SiMysql className="text-blue-700" />,
	PostgreSQL: <SiPostgresql className="text-blue-500" />,
  
	// CMS & Hosting
	"Sanity.io": <SiSanity className="text-red-500" />,
	WordPress: <SiWordpress className="text-blue-600" />,
	Vercel: <SiVercel className="text-black" />,
	Netlify: <SiNetlify className="text-green-500" />,
  
	// DevOps
	Docker: <SiDocker className="text-blue-500" />,
  
	// Design Tools
	Figma: <SiFigma className="text-pink-500" />,
	Canva: <SiCanva className="text-cyan-500" />,
	"Adobe XD": <SiAdobexd className="text-pink-600" />,
	Photoshop: <SiAdobephotoshop className="text-blue-800" />,
	Illustrator: <SiAdobeillustrator className="text-orange-600" />,
  
	// Dev & Team Tools
	GitHub: <SiGithub className="text-black" />,
	Git: <SiGit className="text-orange-600" />,
	VSCode: <BiLogoVisualStudio className="text-blue-500" />,
	Notion: <SiNotion className="text-black" />,
	Trello: <SiTrello className="text-blue-400" />,
	Slack: <SiSlack className="text-purple-500" />,
	Zoom: <SiZoom className="text-blue-600" />,
  };
  
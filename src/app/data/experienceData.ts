export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  companyShort: string;
  location: string;
  period: string;
  type: string;
  badgeBg: string;
  badgeColor: string;
  highlights: string[];
  technologies: string[];
};

export const experiencesData: ExperienceItem[] = [
  {
    id: "almaas",
    role: "Web Developer Intern",
    company: "Almaas University",
    companyShort: "AU",
    location: "Banadir, Somalia",
    period: "Aug 2026 - Present",
    type: "Internship & Development",
    badgeBg: "bg-blue-500/10",
    badgeColor: "text-blue-400 border-blue-500/30",
    highlights: [
      "Re-architected and migrated the primary university website from legacy WordPress to a modern MERN stack.",
      "Engineered a custom Content Management System (CMS) and admin panel for internal site management.",
      "Optimized frontend page speed, client-side logic, and Search Engine Optimization (SEO) metrics.",
      "Designed responsive UI components aligning with academic administrative standards.",
    ],
    technologies: ["React", "Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "SEO"],
  },
  {
    id: "itcommerz",
    role: "Full Stack Developer",
    company: "ITCommerz Software Solution",
    companyShort: "ITC",
    location: "Mogadishu, Somalia",
    period: "Dec 2025 - Apr 2026",
    type: "Contract / Software Engineering",
    badgeBg: "bg-emerald-500/10",
    badgeColor: "text-emerald-400 border-emerald-500/30",
    highlights: [
      "Designed and developed scalable RESTful APIs using Node.js, Express.js, Prisma, and PostgreSQL.",
      "Built authentication and authorization systems with JWT, role-based access control, and secure sessions.",
      "Implemented responsive web interfaces and mobile views with TypeScript and Tailwind CSS.",
      "Optimized database queries and API response times for production workloads.",
    ],
    technologies: ["PostgreSQL", "Prisma ORM", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "JWT"],
  },
  {
    id: "somnog",
    role: "Software Developer Intern",
    company: "Somali Network Operators Group (SomNOG)",
    companyShort: "SOG",
    location: "Banadir, Somalia",
    period: "Nov 2024 - Apr 2025",
    type: "Agile Software Team",
    badgeBg: "bg-cyan-500/10",
    badgeColor: "text-cyan-400 border-cyan-500/30",
    highlights: [
      "Collaborated in an agile team to design, configure, and ship a full-stack web application project.",
      "Developed responsive user interfaces and integrated backend API endpoints seamlessly.",
      "Applied industry-standard Git workflows, PR reviews, and team-based continuous development practices.",
      "Participated in technical sprints and software architecture discussions.",
    ],
    technologies: ["React", "JavaScript", "REST APIs", "Git & GitHub", "Tailwind CSS", "Agile"],
  },
  {
    id: "freelance-mobile",
    role: "Mobile & Frontend Engineer",
    company: "Freelance & Independent Projects",
    companyShort: "ENG",
    location: "Remote / Banadir",
    period: "2023 - 2024",
    type: "Freelance",
    badgeBg: "bg-purple-500/10",
    badgeColor: "text-purple-400 border-purple-500/30",
    highlights: [
      "Built modern cross-platform mobile applications using React Native and Expo CLI.",
      "Translated complex Figma visual specifications into high-performance, pixel-perfect frontend code.",
      "Integrated AI-driven workflows (LLM APIs, prompt toolchains) to accelerate feature development velocity.",
      "Implemented state management, offline data caching, and seamless screen navigation.",
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Figma to Code", "OpenAI APIs", "Supabase"],
  },
];

export const educationData = [
  {
    degree: "Bachelor of Science in Information Technology",
    institution: "SIMAD University",
    location: "Banadir, Somalia",
    period: "2022 - 2026",
    details: "Focused on Software Engineering, Database Systems, Computer Networks, and Full-Stack Web Development.",
  },
];

export const certificationsData = [
  {
    name: "Software Development Certification",
    issuer: "Somali Network Operators Group (SomNOG)",
    date: "2024",
  },
  {
    name: "MERN Stack Development",
    issuer: "LinkedIn Learning",
    date: "2024",
  },
  {
    name: "Web Development Specialist",
    issuer: "CodSoft",
    date: "2024",
  },
  {
    name: "IBM Full Stack Software Developer",
    issuer: "IBM (Professional Certificate)",
    date: "In Progress",
  },
];

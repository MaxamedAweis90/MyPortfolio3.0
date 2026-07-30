import { AppContext, Certificate, CertificateCategory, Project } from "../types/portfolio";

export const appContextData: AppContext = {
  name: "Eng_Aweis",
  siteUrl: "https://myportfolio.dev",
  address: "Mogadishu, Somalia",
  phone: "+252 61 0000000",
  email: "maxamedaweys3@gmail.com",
  resume: "/resume.pdf",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/mohamed-aweys",
    youtube: "https://www.youtube.com/@Eng_Aweis",
    instagram: "https://www.instagram.com/eng_aweis",
    behance: "https://www.behance.net/maxamedaweys3",
  },
};

export const categoriesData: CertificateCategory[] = [
  { _id: "all", title: "All" },
  { _id: "web", title: "Web Development" },
  { _id: "mobile", title: "Mobile Apps" },
  { _id: "design", title: "UI/UX & Graphic Design" },
];

export const certificatesData: Certificate[] = [
  {
    _id: "cert-1",
    title: "Full-Stack Web Development",
    issuer: "SIMAD University / Tech Hub",
    issuedDate: "2024",
    category: { _ref: "web", title: "Web Development" },
    imageUrl: "/myProfile.png",
    verificationUrl: "https://example.com/verify/fullstack",
    verificationCode: "FSWD-2024-001",
  },
  {
    _id: "cert-2",
    title: "Flutter & Mobile App Development",
    issuer: "Coursera / Meta",
    issuedDate: "2023",
    category: { _ref: "mobile", title: "Mobile Apps" },
    imageUrl: "/myProfile.png",
    verificationUrl: "https://example.com/verify/flutter",
    verificationCode: "FLUTTER-2023-089",
  },
  {
    _id: "cert-3",
    title: "UI/UX & Product Design Masterclass",
    issuer: "Udemy",
    issuedDate: "2023",
    category: { _ref: "design", title: "UI/UX & Graphic Design" },
    imageUrl: "/myProfile.png",
    verificationUrl: "https://example.com/verify/uiux",
    verificationCode: "UIUX-9921",
  },
];

export const projectsData: Project[] = [
  {
    _id: "proj-1",
    title: "Modern E-Commerce Store",
    slug: "ecommerce-store",
    category: "Web",
    shortTagline: "A fast, scalable e-commerce application built with Next.js & React",
    description: "Full-featured online store with responsive UI, cart state management, and product filtering.",
    longDescription: [
      "This project showcases a complete e-commerce solution designed for seamless online shopping.",
      "Key features include dynamic product search, category filtering, cart management, and sleek UI animations for enhanced user conversion."
    ],
    appIconUrl: "/Hero3DMe.png",
    liveProjectUrl: "https://example.com",
    tools: [
      { _id: "t1", title: "Next.js", icon: "SiNextdotjs", color: "text-cyan-400" },
      { _id: "t2", title: "React", icon: "SiReact", color: "text-cyan-400" },
      { _id: "t3", title: "Tailwind CSS", icon: "SiNextdotjs", color: "text-sky-400" },
    ],
    images: ["/Hero3DMe.png", "/HeroMe.png"],
    screenshots: ["/Hero3DMe.png", "/HeroMe.png"],
  },
  {
    _id: "proj-2",
    title: "Cross-Platform Mobile App",
    slug: "mobile-app",
    category: "Mobile",
    shortTagline: "Sleek iOS and Android app built with Flutter & Firebase",
    description: "Intuitive mobile app providing real-time data sync and offline support.",
    longDescription: [
      "A cross-platform mobile application engineered for optimal performance on both iOS and Android.",
      "Features state management with Provider/Riverpod, secure user authentication, and push notifications."
    ],
    appIconUrl: "/HeroMe.png",
    playStoreUrl: "https://play.google.com",
    appStoreUrl: "https://apple.com/app-store",
    tools: [
      { _id: "t4", title: "Flutter", icon: "SiFlutter", color: "text-sky-400" },
      { _id: "t5", title: "Firebase", icon: "SiFirebase", color: "text-yellow-500" },
    ],
    images: ["/HeroMe.png"],
    screenshots: ["/HeroMe.png"],
  },
  {
    _id: "proj-3",
    title: "Brand & Graphic Design Showcase",
    slug: "brand-design",
    category: "Design",
    shortTagline: "Creative visual identity and UI/UX design components",
    description: "Collection of vector graphics, logo designs, and interactive UI prototypes.",
    longDescription: [
      "A creative design showcase highlighting brand identity development, typography systems, and UI component libraries created in Figma and Photoshop."
    ],
    appIconUrl: "/myProfile.png",
    liveProjectUrl: "https://behance.net",
    tools: [
      { _id: "t6", title: "Figma", icon: "SiFigma", color: "text-pink-500" },
      { _id: "t7", title: "Photoshop", icon: "SiAdobephotoshop", color: "text-blue-300" },
    ],
    images: ["/myProfile.png"],
    screenshots: ["/myProfile.png"],
  },
];

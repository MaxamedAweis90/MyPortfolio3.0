"use client";
import React from "react";
import { appContextData } from "@/data/portfolioData";
import {
  FaLinkedin,
  FaGithub,
  FaBehance,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

const SocialBar = () => {
  const socials = [
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="text-xl" />,
      url: appContextData.socialLinks?.linkedin || "https://linkedin.com",
    },
    {
      name: "GitHub",
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com",
    },
    {
      name: "Behance",
      icon: <FaBehance className="text-xl" />,
      url: appContextData.socialLinks?.behance || "https://behance.net",
    },
    {
      name: "YouTube",
      icon: <FaYoutube className="text-xl" />,
      url: appContextData.socialLinks?.youtube || "https://youtube.com",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-xl" />,
      url: appContextData.socialLinks?.instagram || "https://instagram.com",
    },
  ];

  return (
    <aside
      aria-label="Social Links"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3 p-2 bg-surface/80 backdrop-blur-md border-y border-r border-borderSubtle rounded-r-2xl shadow-2xl"
    >
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="p-2.5 rounded-xl bg-mainBg border border-borderSubtle text-primaryText hover:bg-brandAccent hover:text-white hover:border-brandAccent transition-all duration-300 shadow-sm hover:scale-110 flex items-center justify-center group"
        >
          {social.icon}
        </a>
      ))}
    </aside>
  );
};

export default SocialBar;

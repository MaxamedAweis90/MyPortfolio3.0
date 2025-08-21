import React from "react";
import { FaLinkedin, FaYoutube, FaBehance, FaDribbble, FaFacebook } from "react-icons/fa";
import "@/styles/socials.css";

const iconMap = {
  linkedin: <FaLinkedin size={30} color="#0A66C2" />,
  youtube: <FaYoutube size={30} color="#FF0000" />,
  behance: <FaBehance size={30} color="#1769FF" />,
  dribbble: <FaDribbble size={30} color="#EA4C89" />,
  facebook: <FaFacebook size={30} color="#1877F2" />,
};

const colorMap = {
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  behance: "#1769FF",
  dribbble: "#EA4C89",
  facebook: "#1877F2",
};

const Socials = ({ socialLinks = {}, name }) => {
  // socialLinks is an object: { linkedin, youtube, behance, ... }
  const entries = Object.entries(socialLinks || {});
  if (!entries.length) return null;
  return (
    <div className="card">
      {entries.map(([key, url], index) => {
        if (!url) return null;
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === "linkedin" && name) label = name;
        if (key === "youtube") label = "@Eng_Aweis";
        return (
          <div key={index} className="social-icons">
            {/* Tooltip label */}
            <a
              className="social-label"
              style={{ backgroundColor: colorMap[key] || "#333", pointerEvents: "none" }}
            >
              {label}
            </a>
            {/* Clickable icon */}
            <a
              className="social-link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {iconMap[key] || key}
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default Socials;

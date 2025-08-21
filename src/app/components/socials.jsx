import React from "react";
import { FaLinkedin, FaYoutube, FaBehance, FaDribbble, FaFacebook } from "react-icons/fa";
import "@/styles/socials.css";

const iconMap = {
  linkedin: <FaLinkedin size={30} color="#0A66C2" />,
  youtube: <FaYoutube size={30} color="#FF0000" />,
  behance: <FaBehance size={30} color="#1769FF" />,
};

const colorMap = {
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  behance: "#1769FF",
};

const Socials = ({ socialLinks = {}, name }) => {
  // Always show Behance as hardcoded, others from socialLinks
  const socialsToShow = [];
  if (socialLinks.linkedin) {
    socialsToShow.push({
      key: 'linkedin',
      url: socialLinks.linkedin,
      label: name || 'LinkedIn',
    });
  }
  if (socialLinks.youtube) {
    socialsToShow.push({
      key: 'youtube',
      url: socialLinks.youtube,
      label: '@Eng_Aweis',
    });
  }
  // Always show Behance
  socialsToShow.push({
    key: 'behance',
    url: 'https://www.behance.net/maxamedaweys3',
    label: 'Behance',
  });

  if (!socialsToShow.length) return null;
  return (
    <div className="card">
      {socialsToShow.map((social, index) => (
        <div key={index} className="social-icons">
          {/* Tooltip label */}
          <a
            className="social-label"
            style={{ backgroundColor: colorMap[social.key] || "#333", pointerEvents: "none" }}
          >
            {social.label}
          </a>
          {/* Clickable icon */}
          <a
            className="social-link"
            href={social.url}
            target="_blank"

            rel="noopener noreferrer"
          >
            {iconMap[social.key] || social.key}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Socials;

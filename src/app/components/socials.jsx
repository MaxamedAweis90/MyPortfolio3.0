import React from "react";
import { FaLinkedin, FaYoutube, FaBehance, FaDribbble, FaFacebook } from "react-icons/fa";
import "@/styles/socials.css";

const socialLinks = [
  {
    name: "Mohammed Aweys Iiman",
    url: "https://www.linkedin.com/in/eng-aweis/",
    icon: <FaLinkedin size={30} color="#0A66C2" />,
    color: "#0A66C2"
  },
  {
    name: "@Eng_Aweis",
    url: "https://www.youtube.com/@Eng_Aweis",
    icon: <FaYoutube size={30} color="#FF0000" />,
    color: "#FF0000"
  },
  {
    name: "maxamedaweys3",
    url: "https://www.behance.net/maxamedaweys3",
    icon: <FaBehance size={30} color="#1769FF" />,
    color: "#1769FF"
  },
//   {
//     name: "Dribbble",
//     url: "https://www.dribbble.com",
//     icon: <FaDribbble size={30} color="#EA4C89" />,
//     color: "#EA4C89"
//   },
//   {
//     name: "Facebook",
//     url: "https://www.facebook.com",
//     icon: <FaFacebook size={30} color="#1877F2" />,
//     color: "#1877F2"
//   }
];

const Socials = () => {
  return (
    <div className="card">
      {socialLinks.map((social, index) => (
        <div key={index} className="social-icons">
          {/* Tooltip label */}
          <a
            className="social-label"
            style={{ backgroundColor: social.color, pointerEvents: "none" }}
          >
            {social.name}
          </a>
          {/* Clickable icon */}
          <a
            className="social-link"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.icon}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Socials;

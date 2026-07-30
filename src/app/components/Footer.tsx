"use client";
import React from 'react';
import Link from 'next/link';
import { appContextData } from "@/data/portfolioData";

const Footer = () => {
  const footerData = appContextData;

  return (
    <div className="footer mt-0 py-6 text-center backdrop-blur-md rounded-lg">
      <div className="container wrapper flex items-center justify-between flex-col">
        <p className="text-brandAccent font-bold text-lg">Thank you for stopping by! 👋</p>
        <p className="text-mutedText mt-2 font-medium">Let&apos;s connect:</p>
        <div className="socials flex space-x-8 max-md:space-x-0 text-nowrap max-md:text-sm justify-center text-primaryText">
          {footerData.email && (
            <a href={`mailto:${footerData.email}`} className="hover:text-brandAccent text-nowrap transition-colors">
              📧 Email Me
            </a>
          )}
          {footerData.socialLinks?.linkedin && (
            <a href={footerData.socialLinks.linkedin} className="hover:text-brandAccent transition-colors">
              🔗 Linkedin
            </a>
          )}
          {footerData.resume && (
            <a href={footerData.resume} className="hover:text-brandAccent transition-colors">
              📝 Resume
            </a>
          )}
          <Link href="/work" className="hover:text-brandAccent transition-colors">
            💼 Work
          </Link>
          {footerData.socialLinks?.youtube && (
            <a href={footerData.socialLinks.youtube} className="hover:text-brandAccent transition-colors">
              🎬 Youtube
            </a>
          )}
          {footerData.socialLinks?.instagram && (
            <a href={footerData.socialLinks.instagram} className="hover:text-brandAccent transition-colors">
              📸 Instagram
            </a>
          )}
        </div>
        <p className="text-mutedText mt-4 text-sm">&copy; {new Date().getFullYear()} {footerData.name}. All rights reserved. ⚡</p>
      </div>
    </div>
  );
};

export default Footer;

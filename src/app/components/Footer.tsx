"use client";
import React from 'react';
import Link from 'next/link';
import { appContextData } from "@/data/portfolioData";

const Footer = () => {
  const footerData = appContextData;

  return (
    <footer className="footer w-full bg-surface border-t border-borderSubtle mt-0 py-8 text-center backdrop-blur-md transition-colors duration-300">
      <div className="container wrapper flex items-center justify-between flex-col space-y-4">
        <p className="text-brandAccent font-bold text-lg">Thank you for stopping by! 👋</p>
        <p className="text-mutedText font-medium">Let&apos;s connect:</p>
        <div className="socials flex flex-wrap gap-4 sm:gap-8 text-nowrap text-sm sm:text-base justify-center text-primaryText">
          {footerData.email && (
            <a
              href={`mailto:${footerData.email}`}
              aria-label="Send email to Mohamed Aweis"
              className="hover:text-brandAccent text-nowrap transition-colors focus:outline-none focus-visible:underline"
            >
              📧 Email Me
            </a>
          )}
          {footerData.socialLinks?.linkedin && (
            <a
              href={footerData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              🔗 Linkedin
            </a>
          )}
          {footerData.resume && (
            <a
              href={footerData.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Resume (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              📝 Resume
            </a>
          )}
          <Link
            href="/work"
            aria-label="View portfolio projects"
            className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
          >
            💼 Work
          </Link>
          {footerData.socialLinks?.youtube && (
            <a
              href={footerData.socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit YouTube channel (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              🎬 Youtube
            </a>
          )}
          {footerData.socialLinks?.instagram && (
            <a
              href={footerData.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Instagram profile (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              📸 Instagram
            </a>
          )}
        </div>
        <p className="text-mutedText text-xs sm:text-sm pt-2">&copy; {new Date().getFullYear()} {footerData.name}. All rights reserved. ⚡</p>
      </div>
    </footer>
  );
};

export default Footer;

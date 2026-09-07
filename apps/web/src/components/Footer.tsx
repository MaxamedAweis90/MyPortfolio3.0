"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { appContextData } from "@/data/portfolioData";
import { SocialLinkItem, defaultSocialLinks } from "@portfolio/types";

interface FooterProps {
  settings?: any;
}

export default function Footer({ settings }: FooterProps = {}) {
  const [footerSettings, setFooterSettings] = useState(() => ({
    name: settings?.fullName || appContextData.name,
    email: settings?.email || appContextData.email,
    resume: settings?.resumeUrl || appContextData.resume,
    socialLinks: (settings?.socialLinks && Array.isArray(settings.socialLinks) && settings.socialLinks.length > 0)
      ? settings.socialLinks
      : (defaultSocialLinks as SocialLinkItem[]),
    linkedinUrl: settings?.linkedinUrl || appContextData.socialLinks?.linkedin || "https://linkedin.com",
    linkedinEnabled: settings?.linkedinEnabled !== false,
    behanceUrl: settings?.behanceUrl || appContextData.socialLinks?.behance || "https://behance.net/maxamedaweys3",
    behanceEnabled: settings?.behanceEnabled !== false,
    youtubeUrl: settings?.youtubeUrl || appContextData.socialLinks?.youtube || "https://youtube.com/@Eng_Aweis",
    youtubeEnabled: settings?.youtubeEnabled !== false,
    instagramUrl: settings?.instagramUrl || appContextData.socialLinks?.instagram || "https://instagram.com/eng_aweis",
    instagramEnabled: settings?.instagramEnabled !== false,
    githubUrl: settings?.githubUrl || "https://github.com/MaxamedAweis90",
    githubEnabled: settings?.githubEnabled !== false,
    twitterUrl: settings?.twitterUrl || "https://x.com/maxamedaweis90",
    twitterEnabled: Boolean(settings?.twitterEnabled),
  }));

  useEffect(() => {
    if (settings) {
      setFooterSettings((prev) => ({
        ...prev,
        name: settings.fullName || prev.name,
        email: settings.email || prev.email,
        resume: settings.resumeUrl || prev.resume,
        ...settings,
      }));
    }
  }, [settings]);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail?.settings) {
        setFooterSettings((prev) => ({
          ...prev,
          name: e.detail.settings.fullName || prev.name,
          email: e.detail.settings.email || prev.email,
          resume: e.detail.settings.resumeUrl || prev.resume,
          ...e.detail.settings,
        }));
      }
    };

    window.addEventListener("social_links_updated", handleUpdate);
    return () => window.removeEventListener("social_links_updated", handleUpdate);
  }, []);

  return (
    <footer className="footer w-full bg-surface border-t border-borderSubtle mt-0 py-8 text-center backdrop-blur-md transition-colors duration-300">
      <div className="container wrapper flex items-center justify-between flex-col space-y-4">
        <p className="text-blue-700 dark:text-brandAccent font-bold text-lg">Thank you for stopping by! 👋</p>
        <p className="text-mutedText font-medium">Let&apos;s connect:</p>
        <div className="socials flex flex-wrap gap-4 sm:gap-8 text-nowrap text-sm sm:text-base justify-center text-primaryText">
          {footerSettings.email && (
            <a
              href={`mailto:${footerSettings.email}`}
              aria-label="Email Me - Send email to Mohamed Aweis"
              className="hover:text-brandAccent text-nowrap transition-colors focus:outline-none focus-visible:underline"
            >
              📧 Email Me
            </a>
          )}
          {footerSettings.linkedinEnabled && footerSettings.linkedinUrl && (
            <a
              href={footerSettings.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              🔗 Linkedin
            </a>
          )}
          {footerSettings.githubEnabled && footerSettings.githubUrl && (
            <a
              href={footerSettings.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              🐙 GitHub
            </a>
          )}
          {footerSettings.resume && (
            <a
              href={footerSettings.resume}
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
            aria-label="Work - View portfolio projects"
            className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
          >
            💼 Work
          </Link>
          {footerSettings.youtubeEnabled && footerSettings.youtubeUrl && (
            <a
              href={footerSettings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit YouTube channel (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              🎬 Youtube
            </a>
          )}
          {footerSettings.behanceEnabled && footerSettings.behanceUrl && (
            <a
              href={footerSettings.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Behance portfolio (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              🎨 Behance
            </a>
          )}
          {footerSettings.instagramEnabled && footerSettings.instagramUrl && (
            <a
              href={footerSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Instagram profile (opens in new tab)"
              className="hover:text-brandAccent transition-colors focus:outline-none focus-visible:underline"
            >
              📸 Instagram
            </a>
          )}
        </div>
        <p className="text-mutedText text-xs sm:text-sm pt-2">&copy; {new Date().getFullYear()} {footerSettings.name}. All rights reserved. ⚡</p>
      </div>
    </footer>
  );
}

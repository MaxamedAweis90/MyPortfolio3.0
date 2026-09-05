"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaBehance,
  FaYoutube,
  FaInstagram,
  FaDiscord,
  FaTiktok,
  FaDribbble,
  FaMedium,
  FaTwitch,
  FaTelegram,
  FaWhatsapp,
  FaFacebook,
  FaReddit,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SocialLinkItem, defaultSocialLinks } from "@/ugaas/types/settings";

const getPlatformIcon = (key?: string, name?: string) => {
  const normalized = (key || name || "").toLowerCase();
  if (normalized.includes("linkedin")) return <FaLinkedin className="text-xl" />;
  if (normalized.includes("github")) return <FaGithub className="text-xl" />;
  if (normalized.includes("behance")) return <FaBehance className="text-xl" />;
  if (normalized.includes("youtube")) return <FaYoutube className="text-xl" />;
  if (normalized.includes("instagram")) return <FaInstagram className="text-xl" />;
  if (normalized.includes("twitter") || normalized === "x") return <FaXTwitter className="text-xl" />;
  if (normalized.includes("discord")) return <FaDiscord className="text-xl" />;
  if (normalized.includes("tiktok")) return <FaTiktok className="text-xl" />;
  if (normalized.includes("dribbble")) return <FaDribbble className="text-xl" />;
  if (normalized.includes("medium")) return <FaMedium className="text-xl" />;
  if (normalized.includes("twitch")) return <FaTwitch className="text-xl" />;
  if (normalized.includes("telegram")) return <FaTelegram className="text-xl" />;
  if (normalized.includes("whatsapp")) return <FaWhatsapp className="text-xl" />;
  if (normalized.includes("facebook")) return <FaFacebook className="text-xl" />;
  if (normalized.includes("reddit")) return <FaReddit className="text-xl" />;
  return <FaGlobe className="text-xl" />;
};

export default function SocialBar() {
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(defaultSocialLinks);

  const fetchLiveSettings = useCallback(async () => {
    try {
      const res = await fetch(`/api/ugaas/settings?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.settings) {
        if (Array.isArray(data.settings.socialLinks) && data.settings.socialLinks.length > 0) {
          setSocialLinks(data.settings.socialLinks);
        } else {
          // Fallback reconstruction from discrete settings if legacy
          const reconstructed: SocialLinkItem[] = [
            { id: "linkedin", name: "LinkedIn", url: data.settings.linkedinUrl || "https://linkedin.com", enabled: data.settings.linkedinEnabled !== false, iconKey: "linkedin" },
            { id: "github", name: "GitHub", url: data.settings.githubUrl || "https://github.com/MaxamedAweis90", enabled: data.settings.githubEnabled !== false, iconKey: "github" },
            { id: "behance", name: "Behance", url: data.settings.behanceUrl || "https://behance.net/maxamedaweys3", enabled: data.settings.behanceEnabled !== false, iconKey: "behance" },
            { id: "youtube", name: "YouTube", url: data.settings.youtubeUrl || "https://youtube.com/@Eng_Aweis", enabled: data.settings.youtubeEnabled !== false, iconKey: "youtube" },
            { id: "instagram", name: "Instagram", url: data.settings.instagramUrl || "https://instagram.com/eng_aweis", enabled: data.settings.instagramEnabled !== false, iconKey: "instagram" },
            { id: "twitter", name: "Twitter / X", url: data.settings.twitterUrl || "https://x.com/maxamedaweis90", enabled: Boolean(data.settings.twitterEnabled), iconKey: "twitter" },
            { id: "discord", name: "Discord", url: data.settings.discordTag ? (data.settings.discordTag.startsWith("http") ? data.settings.discordTag : `https://discord.com/users/${data.settings.discordTag}`) : "", enabled: Boolean(data.settings.discordEnabled), iconKey: "discord" },
          ];
          setSocialLinks(reconstructed);
        }
      }
    } catch {
      // Graceful fallback to defaultSocialLinks
    }
  }, []);

  useEffect(() => {
    fetchLiveSettings();

    const handleUpdate = (e: any) => {
      if (e.detail?.settings?.socialLinks && Array.isArray(e.detail.settings.socialLinks)) {
        setSocialLinks(e.detail.settings.socialLinks);
      } else {
        fetchLiveSettings();
      }
    };

    window.addEventListener("social_links_updated", handleUpdate);
    return () => window.removeEventListener("social_links_updated", handleUpdate);
  }, [fetchLiveSettings]);

  // Filter active and valid URLs in user-ordered drag sequence, capped strictly to max 5
  const activeItems = (socialLinks || defaultSocialLinks)
    .filter((s) => s.enabled && s.url && s.url.trim() !== "")
    .slice(0, 5);

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Social Links"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3 p-2 bg-surface/80 backdrop-blur-md border-y border-r border-borderSubtle rounded-r-2xl shadow-2xl transition-all duration-300"
    >
      {activeItems.map((social) => {
        const href = social.url.startsWith("http") ? social.url : `https://${social.url}`;
        return (
          <a
            key={social.id || social.name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="p-2.5 rounded-xl bg-mainBg border border-borderSubtle text-primaryText hover:bg-brandAccent hover:text-white hover:border-brandAccent transition-all duration-300 shadow-sm hover:scale-110 flex items-center justify-center group cursor-pointer"
          >
            {getPlatformIcon(social.iconKey, social.name)}
          </a>
        );
      })}
    </aside>
  );
}

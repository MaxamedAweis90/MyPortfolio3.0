export interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  iconKey: string;
}

export const defaultSocialLinks: SocialLinkItem[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://linkedin.com/in/maxamedaweis90",
    enabled: true,
    iconKey: "linkedin",
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/MaxamedAweis90",
    enabled: true,
    iconKey: "github",
  },
  {
    id: "behance",
    name: "Behance",
    url: "https://behance.net/maxamedaweys3",
    enabled: true,
    iconKey: "behance",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://youtube.com/@Eng_Aweis",
    enabled: true,
    iconKey: "youtube",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://instagram.com/eng_aweis",
    enabled: true,
    iconKey: "instagram",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    url: "https://x.com/maxamedaweis90",
    enabled: false,
    iconKey: "twitter",
  },
  {
    id: "discord",
    name: "Discord",
    url: "https://discord.com/users/aweis90",
    enabled: false,
    iconKey: "discord",
  },
];

export interface SettingsState {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;

  socialLinks: SocialLinkItem[];
  githubUrl: string;
  githubEnabled: boolean;
  linkedinUrl: string;
  linkedinEnabled: boolean;
  behanceUrl: string;
  behanceEnabled: boolean;
  youtubeUrl: string;
  youtubeEnabled: boolean;
  instagramUrl: string;
  instagramEnabled: boolean;
  twitterUrl: string;
  twitterEnabled: boolean;
  discordTag: string;
  discordEnabled: boolean;
  portfolioUrl: string;

  appsShortcut: string;
  terminalShortcut: string;
  defaultSidebarCollapsed: boolean;
  enableNotifications: boolean;
  maxConcurrentSessions: number;
  timeoutOverrideKey?: string;
}

export const defaultSettings: SettingsState = {
  fullName: "Mohamed Aweis",
  headline: "Full-Stack Software Engineer & Mobile Developer",
  email: "aweis90@example.com",
  phone: "+252 61 000 0000",
  location: "Mogadishu, Somalia",
  bio: "Passionate engineer crafting scalable web applications, mobile experiences, and modern cloud architectures.",
  avatarUrl: "/myProfile.png",
  resumeUrl: "/resume.pdf",

  socialLinks: defaultSocialLinks,
  githubUrl: "https://github.com/MaxamedAweis90",
  githubEnabled: true,
  linkedinUrl: "https://linkedin.com/in/maxamedaweis90",
  linkedinEnabled: true,
  behanceUrl: "https://behance.net/maxamedaweys3",
  behanceEnabled: true,
  youtubeUrl: "https://youtube.com/@Eng_Aweis",
  youtubeEnabled: true,
  instagramUrl: "https://instagram.com/eng_aweis",
  instagramEnabled: true,
  twitterUrl: "https://x.com/maxamedaweis90",
  twitterEnabled: false,
  discordTag: "aweis90",
  discordEnabled: false,
  portfolioUrl: "https://aweis.dev",

  appsShortcut: "Ctrl+K",
  terminalShortcut: "Ctrl+`",
  defaultSidebarCollapsed: false,
  enableNotifications: true,
  maxConcurrentSessions: 3,
  timeoutOverrideKey: "Hooyo Mcn",
};

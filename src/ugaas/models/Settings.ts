import mongoose, { Schema, Document, Model } from "mongoose";
import { SocialLinkItem, defaultSocialLinks } from "@/ugaas/types/settings";

export type { SocialLinkItem };
export { defaultSocialLinks };

export interface ISettings extends Document {
  // Developer Profile
  fullName: string;
  headline: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  resumeUrl?: string;

  // Social Links List & Fallbacks
  socialLinks?: SocialLinkItem[];
  githubUrl?: string;
  githubEnabled?: boolean;
  linkedinUrl?: string;
  linkedinEnabled?: boolean;
  behanceUrl?: string;
  behanceEnabled?: boolean;
  youtubeUrl?: string;
  youtubeEnabled?: boolean;
  instagramUrl?: string;
  instagramEnabled?: boolean;
  twitterUrl?: string;
  twitterEnabled?: boolean;
  discordTag?: string;
  discordEnabled?: boolean;
  portfolioUrl?: string;

  // System & Keyboard Shortcuts
  appsShortcut: string; // e.g. "Ctrl+K", "Alt+A", "Ctrl+Space"
  terminalShortcut?: string; // e.g. "Ctrl+`"
  defaultSidebarCollapsed?: boolean;
  enableNotifications?: boolean;
  maxConcurrentSessions?: number; // e.g. 1, 2, 3, 5, 10, or 0 for unlimited
  timeoutOverrideKey?: string; // Secret passphrase for 'timeout -r' command (default: 'Hooyo Mcn')

  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema<ISettings>(
  {
    fullName: { type: String, default: "Mohamed Aweis" },
    headline: {
      type: String,
      default: "Full-Stack Software Engineer & Mobile Developer",
    },
    email: { type: String, default: "aweis90@example.com" },
    phone: { type: String, default: "+252 61 000 0000" },
    location: { type: String, default: "Mogadishu, Somalia" },
    bio: {
      type: String,
      default:
        "Passionate engineer crafting scalable web applications, mobile experiences, and modern cloud architectures.",
    },
    avatarUrl: { type: String, default: "/myProfile.png" },
    resumeUrl: { type: String, default: "/resume.pdf" },

    socialLinks: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          url: { type: String, default: "" },
          enabled: { type: Boolean, default: true },
          iconKey: { type: String, default: "globe" },
        },
      ],
      default: defaultSocialLinks,
    },

    githubUrl: {
      type: String,
      default: "https://github.com/MaxamedAweis90",
    },
    githubEnabled: { type: Boolean, default: true },
    linkedinUrl: {
      type: String,
      default: "https://linkedin.com/in/maxamedaweis90",
    },
    linkedinEnabled: { type: Boolean, default: true },
    behanceUrl: {
      type: String,
      default: "https://behance.net/maxamedaweys3",
    },
    behanceEnabled: { type: Boolean, default: true },
    youtubeUrl: {
      type: String,
      default: "https://youtube.com/@Eng_Aweis",
    },
    youtubeEnabled: { type: Boolean, default: true },
    instagramUrl: {
      type: String,
      default: "https://instagram.com/eng_aweis",
    },
    instagramEnabled: { type: Boolean, default: true },
    twitterUrl: { type: String, default: "https://x.com/maxamedaweis90" },
    twitterEnabled: { type: Boolean, default: false },
    discordTag: { type: String, default: "aweis90" },
    discordEnabled: { type: Boolean, default: false },
    portfolioUrl: { type: String, default: "https://aweis.dev" },

    appsShortcut: { type: String, default: "Ctrl+K" },
    terminalShortcut: { type: String, default: "Ctrl+`" },
    defaultSidebarCollapsed: { type: Boolean, default: false },
    enableNotifications: { type: Boolean, default: true },
    maxConcurrentSessions: { type: Number, default: 3 },
    timeoutOverrideKey: { type: String, default: "Hooyo Mcn" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Safely invalidate cached Mongoose model across hot reloads
if (typeof mongoose !== "undefined" && mongoose.models && mongoose.models.Settings) {
  try {
    delete (mongoose.models as any).Settings;
  } catch {}
}

export const Settings: Model<ISettings> =
  (typeof mongoose !== "undefined" && mongoose.models && mongoose.models.Settings)
    ? (mongoose.models.Settings as Model<ISettings>)
    : (typeof mongoose !== "undefined" && mongoose.model
        ? mongoose.model<ISettings>("Settings", SettingsSchema)
        : ({} as Model<ISettings>));

export default Settings;

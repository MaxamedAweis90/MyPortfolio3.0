import mongoose, { Schema, Document, Model } from "mongoose";

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

  // Social Links
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  discordTag?: string;
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

    githubUrl: {
      type: String,
      default: "https://github.com/MaxamedAweis90",
    },
    linkedinUrl: {
      type: String,
      default: "https://linkedin.com/in/maxamedaweis90",
    },
    twitterUrl: { type: String, default: "https://x.com/maxamedaweis90" },
    discordTag: { type: String, default: "aweis90" },
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
  }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;

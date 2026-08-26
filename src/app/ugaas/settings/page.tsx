"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  User,
  Share2,
  Keyboard,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  FileText,
  Command,
  LayoutGrid,
  Eye,
  EyeOff,
  Sliders,
  CheckCircle2,
  Laptop,
  Smartphone,
  Tablet,
  MonitorSmartphone,
  Trash2,
  RefreshCw,
  Globe,
  Clock,
  ShieldAlert,
  Key,
  Terminal as TerminalIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { SettingsSkeleton } from "./components/SettingsSkeleton";
import { ScrollableContainer } from "../components/ScrollableContainer";

export interface SettingsState {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;

  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  discordTag: string;
  portfolioUrl: string;

  appsShortcut: string;
  terminalShortcut: string;
  defaultSidebarCollapsed: boolean;
  enableNotifications: boolean;
  maxConcurrentSessions: number;
  timeoutOverrideKey?: string;
}

const defaultSettings: SettingsState = {
  fullName: "Mohamed Aweis",
  headline: "Full-Stack Software Engineer & Mobile Developer",
  email: "aweis90@example.com",
  phone: "+252 61 000 0000",
  location: "Mogadishu, Somalia",
  bio: "Passionate engineer crafting scalable web applications, mobile experiences, and modern cloud architectures.",
  avatarUrl: "/myProfile.png",
  resumeUrl: "/resume.pdf",

  githubUrl: "https://github.com/MaxamedAweis90",
  linkedinUrl: "https://linkedin.com/in/maxamedaweis90",
  twitterUrl: "https://x.com/maxamedaweis90",
  discordTag: "aweis90",
  portfolioUrl: "https://aweis.dev",

  appsShortcut: "Ctrl+K",
  terminalShortcut: "Ctrl+`",
  defaultSidebarCollapsed: false,
  enableNotifications: true,
  maxConcurrentSessions: 3,
  timeoutOverrideKey: "Hooyo Mcn",
};

const SHORTCUT_PRESETS = [
  "Ctrl+K",
  "Cmd+K",
  "Alt+A",
  "Ctrl+Space",
  "Ctrl+/",
  "Ctrl+J",
  "Ctrl+B",
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "social" | "shortcuts" | "sessions" | "security"
  >("profile");

  // Custom shortcut recording state
  const [isRecordingShortcut, setIsRecordingShortcut] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // SESSIONS STATE
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/ugaas/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
        }));
        if (data.settings.appsShortcut) {
          localStorage.setItem("ugaas_apps_shortcut", data.settings.appsShortcut);
        }
        if (data.settings.timeoutOverrideKey) {
          localStorage.setItem("ugaas_timeout_override_key", data.settings.timeoutOverrideKey);
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch active sessions
  const fetchSessions = useCallback(async () => {
    try {
      setSessionsLoading(true);
      const res = await fetch("/api/ugaas/sessions");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (activeTab === "sessions") {
      fetchSessions();
    }
  }, [activeTab, fetchSessions]);

  // Handle Revoking Single Session
  const handleRevokeSession = async (sessionId: string) => {
    try {
      setRevokingId(sessionId);
      const res = await fetch(`/api/ugaas/sessions?id=${sessionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Session revoked successfully");
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        toast.error(data.error || "Failed to revoke session");
      }
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  // Handle Revoke All Other Devices
  const handleRevokeAllOtherSessions = async () => {
    if (
      !confirm(
        "Are you sure you want to terminate all other active device sessions? You will stay logged in on this browser."
      )
    ) {
      return;
    }

    try {
      setRevokingAll(true);
      const res = await fetch(`/api/ugaas/sessions?action=revoke_others`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "All other sessions revoked");
        fetchSessions();
      } else {
        toast.error(data.error || "Failed to revoke sessions");
      }
    } catch {
      toast.error("Failed to revoke sessions");
    } finally {
      setRevokingAll(false);
    }
  };

  // Shortcut Recorder Listener
  useEffect(() => {
    if (!isRecordingShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const modifiers: string[] = [];
      if (e.ctrlKey) modifiers.push("Ctrl");
      if (e.metaKey) modifiers.push("Cmd");
      if (e.altKey) modifiers.push("Alt");
      if (e.shiftKey) modifiers.push("Shift");

      let key = e.key;
      if (["Control", "Meta", "Alt", "Shift"].includes(key)) {
        return;
      }

      if (key === " ") key = "Space";
      else if (key.length === 1) key = key.toUpperCase();

      const finalShortcut =
        modifiers.length > 0 ? `${modifiers.join("+")}+${key}` : key;

      setSettings((prev) => ({ ...prev, appsShortcut: finalShortcut }));
      setIsRecordingShortcut(false);
      toast.info(`Shortcut set to "${finalShortcut}". Click "Save Changes" to apply.`);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isRecordingShortcut]);

  // Save Settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/ugaas/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
        localStorage.setItem("ugaas_apps_shortcut", settings.appsShortcut);
        if (settings.timeoutOverrideKey) {
          localStorage.setItem("ugaas_timeout_override_key", settings.timeoutOverrideKey);
        }
        window.dispatchEvent(
          new CustomEvent("ugaas_shortcut_updated", {
            detail: { shortcut: settings.appsShortcut },
          })
        );
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm("Reset all settings back to default values?")) {
      setSettings(defaultSettings);
      toast.info("Settings reset to defaults. Click 'Save Changes' to commit.");
    }
  };

  // Update Password
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch {
      toast.error("Error communicating with authentication service");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  const getDeviceIcon = (type?: string) => {
    if (type === "mobile") return Smartphone;
    if (type === "tablet") return Tablet;
    return Laptop;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primaryText flex items-center gap-2">
              <span>Settings & Preferences</span>
              <span className="text-[#0B82EC]">.</span>
            </h1>
            <Badge variant="teal" className="text-xs font-bold px-2.5 py-0.5">
              Live Console
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-mutedText">
            Configure your developer profile, active device sessions, security, and administrative preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            onClick={handleResetDefaults}
            className="text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle text-xs sm:text-sm h-10 px-3.5"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span>Reset</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-bold shadow-lg shadow-[#0B82EC]/20 active:scale-[0.98] transition-all text-xs sm:text-sm h-10 px-5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs Bar with Scroll Indicators (<< / >>) */}
      <ScrollableContainer containerClassName="rounded-2xl border border-borderSubtle bg-surface">
        <div className="p-1.5 flex items-center gap-2 w-full min-w-full">
          {[
            { id: "profile", label: "Developer Profile", icon: User },
            { id: "social", label: "Social & Links", icon: Share2 },
            { id: "shortcuts", label: "Shortcuts & System", icon: Keyboard },
            { id: "sessions", label: "Sessions & Devices", icon: MonitorSmartphone },
            { id: "security", label: "Security & Credentials", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0B82EC] text-white shadow-md shadow-[#0B82EC]/20"
                    : "text-mutedText hover:text-primaryText hover:bg-surface/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </ScrollableContainer>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: DEVELOPER PROFILE */}
      {activeTab === "profile" && (
        <Card className="bg-surface/90 border-borderSubtle overflow-hidden">
          <CardHeader className="border-b border-borderSubtle pb-4">
            <CardTitle className="text-lg font-bold text-primaryText flex items-center gap-2">
              <User className="w-5 h-5 text-[#0B82EC]" />
              <span>Personal Identity & Headline</span>
            </CardTitle>
            <CardDescription className="text-xs text-mutedText">
              These details represent you across your public portfolio, hero banner, and about section.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold text-mutedText">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={settings.fullName}
                  onChange={(e) =>
                    setSettings({ ...settings, fullName: e.target.value })
                  }
                  placeholder="e.g. Mohamed Aweis"
                  className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm"
                />
              </div>

              {/* Headline / Title */}
              <div className="space-y-1.5">
                <Label htmlFor="headline" className="text-xs font-semibold text-mutedText">
                  Professional Title / Headline *
                </Label>
                <Input
                  id="headline"
                  value={settings.headline}
                  onChange={(e) =>
                    setSettings({ ...settings, headline: e.target.value })
                  }
                  placeholder="e.g. Full-Stack Software Engineer & Mobile Developer"
                  className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0B82EC]" />
                  Public Contact Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  placeholder="aweis90@example.com"
                  className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0B82EC]" />
                  Contact Phone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  placeholder="+252 61 000 0000"
                  className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  Current Base Location
                </Label>
                <Input
                  id="location"
                  value={settings.location}
                  onChange={(e) =>
                    setSettings({ ...settings, location: e.target.value })
                  }
                  placeholder="Mogadishu, Somalia"
                  className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm"
                />
              </div>

              {/* Resume / CV Link */}
              <div className="space-y-1.5">
                <Label htmlFor="resumeUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
                  Resume / CV Document URL
                </Label>
                <Input
                  id="resumeUrl"
                  value={settings.resumeUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, resumeUrl: e.target.value })
                  }
                  placeholder="/resume.pdf or Google Drive link"
                  className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Avatar URL & Preview */}
            <div className="space-y-2 pt-2 border-t border-borderSubtle">
              <Label htmlFor="avatarUrl" className="text-xs font-semibold text-mutedText">
                Profile Avatar Image URL
              </Label>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-surface border border-borderSubtle shrink-0">
                  <Image
                    src={settings.avatarUrl || "/myProfile.png"}
                    alt="Avatar Preview"
                    fill
                    sizes="56px"
                    className="object-cover"
                    onError={() => {}}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    id="avatarUrl"
                    value={settings.avatarUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, avatarUrl: e.target.value })
                    }
                    placeholder="/myProfile.png or https://..."
                    className="bg-surface border-borderSubtle text-primaryText text-xs"
                  />
                  <p className="text-[11px] text-mutedText">
                    Supports local public assets (e.g. /myProfile.png) or remote CDN URLs.
                  </p>
                </div>
              </div>
            </div>

            {/* Bio / Summary */}
            <div className="space-y-1.5 pt-2 border-t border-borderSubtle">
              <Label htmlFor="bio" className="text-xs font-semibold text-mutedText">
                Executive Bio & Tagline
              </Label>
              <Textarea
                id="bio"
                rows={3}
                value={settings.bio}
                onChange={(e) =>
                  setSettings({ ...settings, bio: e.target.value })
                }
                placeholder="Write a brief professional overview about yourself..."
                className="bg-surface border-borderSubtle text-primaryText text-xs sm:text-sm leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: SOCIAL & LINKS */}
      {activeTab === "social" && (
        <Card className="bg-surface/90 border-borderSubtle overflow-hidden">
          <CardHeader className="border-b border-borderSubtle pb-4">
            <CardTitle className="text-lg font-bold text-primaryText flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#0B82EC]" />
              <span>Developer Social Links & Domain</span>
            </CardTitle>
            <CardDescription className="text-xs text-mutedText">
              Manage your connected profiles, GitHub repositories, and live domain.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* GitHub */}
              <div className="space-y-1.5">
                <Label htmlFor="githubUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-primaryText" /> GitHub Profile
                </Label>
                <Input
                  id="githubUrl"
                  value={settings.githubUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/MaxamedAweis90"
                  className="bg-surface border-borderSubtle text-primaryText text-xs"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1.5">
                <Label htmlFor="linkedinUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-[#0B82EC]" /> LinkedIn Profile
                </Label>
                <Input
                  id="linkedinUrl"
                  value={settings.linkedinUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, linkedinUrl: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/maxamedaweis90"
                  className="bg-surface border-borderSubtle text-primaryText text-xs"
                />
              </div>

              {/* Twitter / X */}
              <div className="space-y-1.5">
                <Label htmlFor="twitterUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter / X Handle
                </Label>
                <Input
                  id="twitterUrl"
                  value={settings.twitterUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, twitterUrl: e.target.value })
                  }
                  placeholder="https://x.com/maxamedaweis90"
                  className="bg-surface border-borderSubtle text-primaryText text-xs"
                />
              </div>

              {/* Discord */}
              <div className="space-y-1.5">
                <Label htmlFor="discordTag" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Discord Handle
                </Label>
                <Input
                  id="discordTag"
                  value={settings.discordTag}
                  onChange={(e) =>
                    setSettings({ ...settings, discordTag: e.target.value })
                  }
                  placeholder="aweis90"
                  className="bg-surface border-borderSubtle text-primaryText text-xs"
                />
              </div>

              {/* Live Portfolio Domain */}
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="portfolioUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#2DD4BF]" /> Production Portfolio Domain
                </Label>
                <Input
                  id="portfolioUrl"
                  value={settings.portfolioUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, portfolioUrl: e.target.value })
                  }
                  placeholder="https://aweis.dev"
                  className="bg-surface border-borderSubtle text-primaryText text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: SHORTCUTS & SYSTEM */}
      {activeTab === "shortcuts" && (
        <div className="space-y-6">
          {/* Quick Apps Shortcut Launcher */}
          <Card className="bg-surface/90 border-borderSubtle">
            <CardHeader className="border-b border-borderSubtle pb-4">
              <CardTitle className="text-lg font-bold text-primaryText flex items-center gap-2">
                <Command className="w-5 h-5 text-cyan-400" />
                <span>Application Launcher Shortcut</span>
              </CardTitle>
              <CardDescription className="text-xs text-mutedText">
                Customize the global key combination that toggles the slide-up Apps Launcher drawer anywhere in the Admin CMS.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-borderSubtle">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-primaryText flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-cyan-400" /> Current Launcher Shortcut
                  </span>
                  <p className="text-[11px] text-mutedText">
                    Press this combination anytime to open or close the Apps switcher.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <kbd className="px-3.5 py-1.5 rounded-lg bg-surface border border-borderSubtle text-cyan-400 font-mono text-sm font-bold shadow-inner">
                    {isRecordingShortcut ? "Press Key Combo..." : settings.appsShortcut}
                  </kbd>

                  <Button
                    type="button"
                    variant={isRecordingShortcut ? "default" : "outline"}
                    onClick={() => setIsRecordingShortcut(!isRecordingShortcut)}
                    className={`text-xs h-9 ${
                      isRecordingShortcut
                        ? "bg-amber-500 hover:bg-amber-600 text-white animate-pulse"
                        : "border-borderSubtle bg-surface text-primaryText hover:text-primaryText"
                    }`}
                  >
                    {isRecordingShortcut ? "Listening..." : "Record New Shortcut"}
                  </Button>
                </div>
              </div>

              {/* Shortcut Presets */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-mutedText">
                  Popular Preset Shortcuts
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SHORTCUT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSettings({ ...settings, appsShortcut: preset });
                        toast.info(`Selected "${preset}". Click 'Save Changes' to apply.`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        settings.appsShortcut === preset
                          ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm"
                          : "bg-surface border-borderSubtle text-mutedText hover:text-primaryText"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Toggles Card */}
          <Card className="bg-surface/90 border-borderSubtle">
            <CardHeader className="border-b border-borderSubtle pb-4">
              <CardTitle className="text-lg font-bold text-primaryText flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#2DD4BF]" />
                <span>Console Behavior & Layout Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-borderSubtle">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-primaryText">
                    Compact Sidebar by Default
                  </Label>
                  <p className="text-[11px] text-mutedText">
                    Automatically collapse the navigation sidebar to icon-only mode on desktop load.
                  </p>
                </div>
                <Switch
                  checked={settings.defaultSidebarCollapsed}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, defaultSidebarCollapsed: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-borderSubtle">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-primaryText">
                    Inquiry Alert Notifications
                  </Label>
                  <p className="text-[11px] text-mutedText">
                    Display toast banners when new client inquiries or project briefs arrive.
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: SESSIONS & ACTIVE DEVICES */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {/* Top Capacity Banner */}
          <div className="p-5 rounded-2xl bg-surface border border-borderSubtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
                </span>
                <h2 className="text-base sm:text-lg font-bold text-primaryText">
                  Active Logged-in Devices
                </h2>
                <Badge variant="teal" className="text-xs font-mono font-bold">
                  {sessions.length} Active
                </Badge>
              </div>
              <p className="text-xs text-mutedText">
                Manage all active browser sessions, hardware devices, and locations accessing your administrative console.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSessions}
                disabled={sessionsLoading}
                className="h-9 px-3 text-xs text-mutedText hover:text-primaryText border border-borderSubtle"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${sessionsLoading ? "animate-spin text-[#0B82EC]" : ""}`} />
                Refresh
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleRevokeAllOtherSessions}
                disabled={revokingAll || sessions.length <= 1}
                className="h-9 px-3.5 text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Revoke All Other Devices
              </Button>
            </div>
          </div>

          {/* Max Concurrent Devices Setting Card */}
          <Card className="bg-surface/90 border-borderSubtle">
            <CardHeader className="border-b border-borderSubtle pb-4">
              <CardTitle className="text-base font-bold text-primaryText flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#0B82EC]" />
                <span>Adjustable Maximum Allowed Concurrent Devices</span>
              </CardTitle>
              <CardDescription className="text-xs text-mutedText">
                Limit how many simultaneous devices can be logged in under your administrative account at the same time.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-borderSubtle">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-primaryText">
                    Max Allowed Active Devices
                  </span>
                  <p className="text-[11px] text-mutedText">
                    When this limit is reached, older sessions will be automatically retired to protect account access.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={settings.maxConcurrentSessions}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxConcurrentSessions: parseInt(e.target.value, 10),
                      })
                    }
                    className="bg-surface border border-borderSubtle rounded-lg px-3 py-1.5 text-xs font-bold text-primaryText focus:outline-none focus:border-[#0B82EC]"
                  >
                    <option value="1">1 Device (Strict Single-Device)</option>
                    <option value="2">2 Devices</option>
                    <option value="3">3 Devices (Recommended)</option>
                    <option value="5">5 Devices</option>
                    <option value="10">10 Devices</option>
                    <option value="0">0 (Unlimited Devices)</option>
                  </select>

                  <Badge variant="teal" className="text-xs font-mono">
                    Limit: {settings.maxConcurrentSessions === 0 ? "Unlimited" : `${settings.maxConcurrentSessions} max`}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminal Lockout Override Passphrase Card */}
          <Card className="bg-surface/90 border-borderSubtle">
            <CardHeader className="border-b border-borderSubtle pb-4">
              <CardTitle className="text-base font-bold text-primaryText flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Terminal Timeout Override Passphrase</span>
              </CardTitle>
              <CardDescription className="text-xs text-mutedText">
                Configure the secret passphrase used to instantly clear and bypass the 30-minute terminal lockout on any device via command.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-borderSubtle">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-primaryText flex items-center gap-2">
                    <TerminalIcon className="w-3.5 h-3.5 text-[#2DD4BF]" /> Override Command Format
                  </span>
                  <p className="text-[11px] text-mutedText">
                    Run in terminal: <code className="text-cyan-400 font-mono font-bold bg-surface px-1.5 py-0.5 rounded border border-borderSubtle">timeout -r &apos;{settings.timeoutOverrideKey || "Hooyo Mcn"}&apos;</code>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="text"
                    value={settings.timeoutOverrideKey || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        timeoutOverrideKey: e.target.value,
                      })
                    }
                    placeholder="Hooyo Mcn"
                    className="bg-surface border-borderSubtle text-primaryText text-xs font-mono w-full sm:w-60"
                  />
                  <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                    Secret Key
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Devices List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-mutedText px-1">
              Connected Devices & Hardware
            </h3>

            {sessionsLoading && sessions.length === 0 ? (
              <div className="p-12 text-center text-mutedText space-y-2 rounded-2xl bg-surface border border-borderSubtle">
                <RefreshCw className="w-6 h-6 animate-spin text-[#0B82EC] mx-auto" />
                <p className="text-xs font-semibold text-primaryText">Scanning active sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-12 text-center text-mutedText space-y-2 rounded-2xl bg-surface border border-borderSubtle">
                <Laptop className="w-8 h-8 text-mutedText/40 mx-auto" />
                <p className="text-xs font-semibold text-primaryText">No other sessions detected</p>
                <p className="text-[11px] text-mutedText">Your current device is the only one connected.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {sessions.map((session, index) => {
                  const DeviceIcon = getDeviceIcon(session.device?.type);
                  const isCurrent = session.isCurrent || index === 0;

                  return (
                    <div
                      key={session.id || index}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCurrent
                          ? "bg-surface border-[#0B82EC]/40 shadow-sm"
                          : "bg-surface border-borderSubtle hover:border-borderSubtle/80"
                      }`}
                    >
                      {/* Left: Device Info */}
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                            isCurrent
                              ? "bg-[#0B82EC]/15 border-[#0B82EC]/30 text-[#0B82EC]"
                              : "bg-surface border-borderSubtle text-mutedText"
                          }`}
                        >
                          <DeviceIcon className="w-5 h-5" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-primaryText">
                              {session.device?.browser || "Web Browser"} on {session.device?.os || "Operating System"}
                            </span>

                            {isCurrent ? (
                              <Badge variant="teal" className="text-[10px] font-bold px-2 py-0.2 uppercase">
                                This Device (Current)
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] font-mono">
                                Active Session
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-mutedText">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-[#0B82EC]" />
                              {session.location?.city || "Localhost"}, {session.location?.country || "Development"}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-mutedText/90">
                              IP: {session.ipAddress || session.location?.ip || "127.0.0.1"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-mutedText" />
                              Logged in {new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {isCurrent ? (
                          <span className="text-[11px] font-mono text-[#2DD4BF] flex items-center gap-1 font-semibold px-3 py-1 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Now
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={revokingId === session.id}
                            className="h-8 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            {revokingId === session.id ? "Revoking..." : "Revoke"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Active Admin Session Card */}
          <Card className="bg-surface/90 border-borderSubtle">
            <CardHeader className="border-b border-borderSubtle pb-4">
              <CardTitle className="text-lg font-bold text-primaryText flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2DD4BF]" />
                <span>Active Administrator Session</span>
              </CardTitle>
              <CardDescription className="text-xs text-mutedText">
                Better Auth session diagnostics and authentication status.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-surface border border-borderSubtle">
                  <span className="text-[10px] uppercase font-mono text-mutedText">
                    Status
                  </span>
                  <p className="text-xs font-bold text-[#2DD4BF] flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-borderSubtle">
                  <span className="text-[10px] uppercase font-mono text-mutedText">
                    Admin Role
                  </span>
                  <p className="text-xs font-bold text-primaryText mt-1">
                    Superuser (Root)
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-borderSubtle">
                  <span className="text-[10px] uppercase font-mono text-mutedText">
                    Database Provider
                  </span>
                  <p className="text-xs font-bold text-primaryText mt-1">
                    MongoDB Atlas Cluster
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card className="bg-surface/90 border-borderSubtle">
            <CardHeader className="border-b border-borderSubtle pb-4">
              <CardTitle className="text-lg font-bold text-primaryText">
                Update Admin Password
              </CardTitle>
              <CardDescription className="text-xs text-mutedText">
                Ensure your console credentials remain robust with a secure password.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-mutedText">
                      Current Password
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-surface border-borderSubtle text-primaryText text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-mutedText">
                      New Password (Min 8 chars)
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-surface border-borderSubtle text-primaryText text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-semibold text-mutedText">
                      Confirm New Password
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-surface border-borderSubtle text-primaryText text-xs"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-borderSubtle bg-surface/60 p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-mutedText hover:text-primaryText flex items-center gap-1.5"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hide Password
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Show Password
                    </>
                  )}
                </button>

                <Button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs font-bold h-9"
                >
                  {updatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

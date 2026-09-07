"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Terminal as TerminalIcon,
  Loader2,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { signIn } from "@/lib/auth-client";

interface AdminLoginFormProps {
  callbackUrl: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSwitchToTerminal: () => void;
  onSuccess: () => void;
}

export function AdminLoginForm({
  callbackUrl,
  isDarkMode,
  onToggleTheme,
  onSwitchToTerminal,
  onSuccess,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Required credentials missing.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn.email({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      onSuccess();
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication failed.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`w-full max-w-sm relative z-10 rounded-2xl border transition-all duration-300 overflow-hidden ${
        isDarkMode
          ? "border-[#1E293B] bg-[#0A0D14] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-slate-200"
          : "border-[#CBD5E1] bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)] text-slate-800"
      }`}
    >
      {/* Minimal Title Bar */}
      <div
        className={`h-11 px-4 flex items-center justify-between border-b select-none transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#0F141F] border-[#1E293B]"
            : "bg-[#F8FAFC] border-[#E2E8F0]"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#DC2626]/80" />
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-[#D97706]/80" />
          <span className="w-3 h-3 rounded-full bg-[#10B981] border border-[#059669]/80" />
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle Terminal Toggle */}
          <button
            onClick={onSwitchToTerminal}
            type="button"
            aria-label="Terminal"
            title="Terminal"
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? "bg-[#161D2B] border-[#2A374A] text-slate-400 hover:text-white hover:bg-[#1E283A]"
                : "bg-[#F1F5F9] border-[#CBD5E1] text-slate-600 hover:text-slate-900 hover:bg-[#E2E8F0]"
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            type="button"
            aria-label="Theme"
            title="Theme"
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? "bg-[#161D2B] border-[#2A374A] text-amber-400 hover:text-amber-300 hover:bg-[#1E283A]"
                : "bg-[#F1F5F9] border-[#CBD5E1] text-slate-600 hover:text-slate-900 hover:bg-[#E2E8F0]"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Minimal Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono">
        {errorMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs transition-colors ${
              isDarkMode
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {errorMessage}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="email"
            required
            autoComplete="email"
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition-all duration-200 ${
              isDarkMode
                ? "bg-[#111622] border-[#1E293B] text-white placeholder:text-slate-600 focus:border-cyan-500"
                : "bg-[#F8FAFC] border-[#CBD5E1] text-slate-900 placeholder:text-slate-400 focus:border-cyan-600"
            }`}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="password"
            required
            autoComplete="current-password"
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition-all duration-200 ${
              isDarkMode
                ? "bg-[#111622] border-[#1E293B] text-white placeholder:text-slate-600 focus:border-cyan-500"
                : "bg-[#F8FAFC] border-[#CBD5E1] text-slate-900 placeholder:text-slate-400 focus:border-cyan-600"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isDarkMode
              ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>sign in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default AdminLoginForm;

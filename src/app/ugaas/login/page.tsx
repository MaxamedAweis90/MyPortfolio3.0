"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@ugaas/lib/auth-client";
import { motion } from "framer-motion";
import {
  RiLockPasswordLine,
  RiMailLine,
  RiShieldCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiLoader4Line,
} from "react-icons/ri";
import { toast } from "react-toastify";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/ugaas";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Invalid email or password");
        toast.error(res.error.message || "Authentication failed");
        setLoading(false);
        return;
      }

      toast.success("Welcome back, Admin!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during sign-in.";
      setError(message);
      toast.error("Failed to authenticate");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mainBg flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandAccent/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-secondaryAccent/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-borderSubtle rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brandAccent/10 text-brandAccent border border-brandAccent/30 text-2xl shadow-inner mb-2">
            <RiShieldCheckLine />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryText tracking-tight">
            Ugaas Admin Portal<span className="text-brandAccent">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-mutedText">
            Sign in to manage portfolio content, leads, and analytics.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-mutedText flex items-center gap-1.5">
              <RiMailLine className="text-brandAccent" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-mainBg border border-borderSubtle text-primaryText placeholder-mutedText/50 focus:border-brandAccent focus:outline-none transition-colors text-sm font-medium"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-mutedText flex items-center gap-1.5">
              <RiLockPasswordLine className="text-brandAccent" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-mainBg border border-borderSubtle text-primaryText placeholder-mutedText/50 focus:border-brandAccent focus:outline-none transition-colors text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedText hover:text-primaryText transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <RiEyeOffLine size={18} />
                ) : (
                  <RiEyeLine size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-brandAccent hover:bg-secondaryAccent text-white font-extrabold text-sm shadow-lg shadow-brandAccent/25 hover:shadow-brandAccent/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RiLoader4Line className="animate-spin text-lg" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <RiArrowRightLine className="text-base" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-4 border-t border-borderSubtle text-center">
          <p className="text-[11px] text-mutedText">
            Protected area • Single-user administrative authentication
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function UgaasLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-mainBg flex items-center justify-center">
          <RiLoader4Line className="animate-spin text-3xl text-brandAccent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

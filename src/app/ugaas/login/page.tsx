"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Terminal as TerminalIcon,
  CornerDownLeft,
  Sparkles,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { signIn } from "@/ugaas/lib/auth-client";

type LoginStage =
  | "ROOT" // Must run 'cd ugaas'
  | "IN_UGAAS" // Must run 'npm login'
  | "ENTER_EMAIL" // Must provide @gmail.com email
  | "ENTER_PASSWORD" // Must provide password (max 4 tries)
  | "CONFIRM_ACCESS" // Must confirm with '-Y' / 'yes'
  | "PROVIDE_TIMEOUT_SECRET" // Waiting for secret phrase after 'timeout -r'
  | "AUTHENTICATING" // Checking credentials with backend
  | "ACCESS_GRANTED"; // Running boot sequence and launching portal

interface TerminalLine {
  id: string;
  type: "prompt" | "output" | "error" | "boot" | "timeout-timer";
  path?: string;
  command?: string;
  text?: string;
  expiresAt?: number;
}

const MAX_PASSWORD_ATTEMPTS = 4;
const TIMEOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

function TimeoutCountdown({
  expiresAt,
  isDarkMode,
  onExpire,
}: {
  expiresAt: number;
  isDarkMode: boolean;
  onExpire: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    Math.max(0, expiresAt - Date.now())
  );

  useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        onExpire();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="w-full flex flex-col items-center justify-center py-3 my-2 select-none">
      <div
        className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 ${
          isDarkMode
            ? "bg-[#0E1522] border-cyan-500/30 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.12)]"
            : "bg-[#F0FDFA] border-teal-300 text-teal-900 shadow-sm"
        }`}
      >
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Timeout Remaining:
          </span>
          <span
            className={`text-base sm:text-lg font-black tracking-widest ${
              isDarkMode ? "text-cyan-400" : "text-teal-700"
            }`}
          >
            {formatted}
          </span>
        </div>
      </div>
    </div>
  );
}

function TerminalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/ugaas";

  // Light / Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Host domain resolution (e.g. localhost:3000 or aweis.dev)
  const [domain, setDomain] = useState("portfolio.dev");

  // Terminal state
  const [stage, setStage] = useState<LoginStage>("ROOT");
  const [currentPath, setCurrentPath] = useState("~");
  const [inputVal, setInputVal] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);

  // Device Lockout state (30 min timeout on 4 failed password attempts)
  const [isLocked, setIsLocked] = useState(false);

  // App launch expanding transition state
  const [isLaunchingApp, setIsLaunchingApp] = useState(false);

  // Auth credentials buffer
  const [emailBuffer, setEmailBuffer] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Command History (Arrow Up / Down)
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window === "undefined") return;
      const savedTheme = localStorage.getItem("theme");
      const domTheme = document.documentElement.getAttribute("data-theme");
      const isLight = savedTheme === "light" || domTheme === "light";
      setIsDarkMode(!isLight);
    };

    checkTheme();

    const handleThemeChange = () => checkTheme();
    window.addEventListener("theme_changed", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("theme_changed", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (typeof window !== "undefined") {
      if (nextDark) {
        document.documentElement.setAttribute("data-theme", "mytheme");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
      window.dispatchEvent(new Event("theme_changed"));
    }
  };

  // Initialize domain, timeout lock, and command history
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.host || "portfolio.dev");

      // Check if device is in 30 min lockout
      try {
        const timeoutUntil = localStorage.getItem("ugaas_login_timeout");
        if (timeoutUntil && Date.now() < Number(timeoutUntil)) {
          setIsLocked(true);
        } else if (timeoutUntil) {
          localStorage.removeItem("ugaas_login_timeout");
          localStorage.removeItem("ugaas_failed_attempts");
        }

        // Load saved command history
        const savedHistory = localStorage.getItem("ugaas_terminal_history");
        if (savedHistory) {
          setCommandHistory(JSON.parse(savedHistory));
        }

        // Load failed attempts
        const savedAttempts = localStorage.getItem("ugaas_failed_attempts");
        if (savedAttempts) {
          setFailedAttempts(Number(savedAttempts));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, stage, inputVal]);

  // Focus input on terminal click
  const handleTerminalClick = () => {
    if (!isLocked && !isLaunchingApp) {
      textareaRef.current?.focus();
    }
  };

  // Get current prompt string
  const getPromptPrefix = () => {
    if (stage === "ENTER_EMAIL") {
      return `${domain}/admin&CMS sys/ugaas (email) ? Provide admin email:`;
    }
    if (stage === "ENTER_PASSWORD") {
      return `${domain}/admin&CMS sys/ugaas (password) ? Provide pass:`;
    }
    if (stage === "CONFIRM_ACCESS") {
      return `${domain}/admin&CMS sys/ugaas ? You are accessing ugaas admin&CMS mngment system. Proceed? (-Y):`;
    }
    if (stage === "PROVIDE_TIMEOUT_SECRET") {
      return `${domain}/admin&CMS sys/ugaas (timeout) ? Provide the secret phrase:`;
    }
    return `${domain}/admin&CMS sys/${currentPath} $`;
  };

  // Save command to history
  const pushToHistory = (cmd: string) => {
    if (!cmd.trim() || stage === "ENTER_PASSWORD") return;
    const updated = [...commandHistory, cmd];
    setCommandHistory(updated);
    setHistoryIndex(-1);
    try {
      localStorage.setItem(
        "ugaas_terminal_history",
        JSON.stringify(updated.slice(-50))
      );
    } catch {
      // ignore
    }
  };

  // Run Package Install & Linux Service Bootloader Sequence
  const runBootloader = () => {
    const bootSteps = [
      { text: "[npm] resolving dependencies for @ugaas/admin-core v3.0.4...", delay: 80 },
      { text: "[npm] audited 482 packages in 0.34s (0 vulnerabilities found)", delay: 100 },
      { text: "[1/7] ⠋ extracting @ugaas/mongodb-adapter@6.3.0...", delay: 90 },
      { text: "[2/7] ⠙ mounting database cluster [myportfolio@mongodb-atlas]...", delay: 110 },
      { text: "[3/7] ⠹ compiling cms subsystems: projects, experience, inquiries, audit...", delay: 130 },
      { text: "[4/7] ⠸ verifying Better-Auth session tokens & RSA-256 signatures...", delay: 100 },
      { text: "[5/7] ⠼ initializing hardware telemetry (Device, GeoIP, Audit Daemon)...", delay: 120 },
      { text: "[6/7] ⠴ synchronizing UI view transitions & theme engine...", delay: 90 },
      { text: "[7/7] ⠦ compiling page bundles & CSS AST...", delay: 110 },
      { text: "[========================================>] 100%", delay: 120 },
      { text: "[OK] Mounted: MongoDB Atlas Cluster (Database: myportfolio)", delay: 80 },
      { text: "[OK] Mounted: Better-Auth Security Guard (Superuser Clearance Level 1)", delay: 80 },
      { text: "[OK] Mounted: Projects CMS Subsystem", delay: 80 },
      { text: "[OK] Mounted: Experience & Credentials Subsystem", delay: 80 },
      { text: "[OK] Mounted: Inquiries Inbox & Notifications Relay", delay: 80 },
      { text: "[OK] Mounted: Live Audit Logger & Geo-IP Resolver", delay: 80 },
      { text: "▲ Next.js 16.3.3 (Turbopack) ready in 1.1s", delay: 140 },
      { text: "- Local:    http://localhost:3000/ugaas", delay: 90 },
      { text: "Launching Ugaas Admin & CMS Management Console...", delay: 350 },
    ];

    let accumulatedTime = 0;
    bootSteps.forEach((step, idx) => {
      accumulatedTime += step.delay;
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            id: `boot-${Date.now()}-${idx}`,
            type: "boot",
            text: step.text,
          },
        ]);

        if (idx === bootSteps.length - 1) {
          setTimeout(() => {
            setIsLaunchingApp(true);
            setTimeout(() => {
              router.push(callbackUrl);
              router.refresh();
            }, 750);
          }, 400);
        }
      }, accumulatedTime);
    });
  };

  // Handle command submission (Supports single or multi-line chained commands via Shift+Enter)
  const handleCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isLaunchingApp) {
      setInputVal("");
      return;
    }

    const rawVal = inputVal;
    if (!rawVal.trim() && stage !== "ENTER_PASSWORD") {
      setInputVal("");
      return;
    }

    const rawLines = rawVal.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    setInputVal("");

    // Build the displayed executed command lines (masking password line if in password stage)
    const displayLines = rawVal.split("\n").map((line, idx) => {
      if (stage === "ENTER_PASSWORD" && idx === 0) {
        return "••••••••••••";
      }
      return line;
    });

    const displayCommand = displayLines.join("\n");
    const currentPromptText = getPromptPrefix();

    const firstCmd = rawLines[0] || "";
    const isEnteringCredentials =
      stage === "ENTER_EMAIL" ||
      stage === "ENTER_PASSWORD" ||
      stage === "CONFIRM_ACCESS";

    // CLS / CLEAR (only outside credential entry mode)
    if (!isEnteringCredentials && (firstCmd === "cls" || firstCmd === "clear")) {
      setLines([]);
      return;
    }

    const newPromptLine: TerminalLine = {
      id: `prompt-${Date.now()}-${Math.random()}`,
      type: "prompt",
      path: currentPromptText,
      command: displayCommand,
    };

    setLines((prev) => [...prev, newPromptLine]);
    pushToHistory(rawVal);

    if (!isEnteringCredentials) {
      // CHECK IF CURRENTLY PROVIDING TIMEOUT SECRET PHRASE
      if (stage === "PROVIDE_TIMEOUT_SECRET") {
        const pass = rawLines[0].replace(/^['"]+|['"]+$/g, "").trim();

        try {
          const res = await fetch("/api/ugaas/auth/override-timeout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passphrase: pass }),
          });
          const data = await res.json();

          if (data.success) {
            try {
              localStorage.removeItem("ugaas_login_timeout");
              localStorage.removeItem("ugaas_failed_attempts");
            } catch {}

            setIsLocked(false);
            setFailedAttempts(0);
            setStage("IN_UGAAS");
            setCurrentPath("ugaas");
            setEmailBuffer("");

            setLines((prev) => [
              ...prev,
              {
                id: `to-ok-${Date.now()}`,
                type: "boot",
                text: "[OK] Security timeout lockout overridden. Terminal reset.",
              },
            ]);
            return;
          } else {
            setLines((prev) => [
              ...prev,
              {
                id: `err-to-${Date.now()}`,
                type: "error",
                text: "wrong input please try another",
              },
            ]);
            setStage(isLocked ? "ROOT" : "IN_UGAAS");
            return;
          }
        } catch {
          const localSecret = (
            localStorage.getItem("ugaas_timeout_override_key") || "Hooyo Mcn"
          ).trim();

          if (pass === localSecret) {
            try {
              localStorage.removeItem("ugaas_login_timeout");
              localStorage.removeItem("ugaas_failed_attempts");
            } catch {}

            setIsLocked(false);
            setFailedAttempts(0);
            setStage("IN_UGAAS");
            setCurrentPath("ugaas");
            setEmailBuffer("");

            setLines((prev) => [
              ...prev,
              {
                id: `to-ok-${Date.now()}`,
                type: "boot",
                text: "[OK] Security timeout lockout overridden. Terminal reset.",
              },
            ]);
          } else {
            setLines((prev) => [
              ...prev,
              {
                id: `err-to-${Date.now()}`,
                type: "error",
                text: "wrong input please try another",
              },
            ]);
            setStage(isLocked ? "ROOT" : "IN_UGAAS");
          }
          return;
        }
      }

      // CHECK FOR TIMEOUT OVERRIDE COMMAND:
      // Option A: Two-step interactive prompt 'timeout -r'
      if (
        firstCmd === "timeout -r" ||
        firstCmd === "timeout -R" ||
        firstCmd === "timeout --reset"
      ) {
        setStage("PROVIDE_TIMEOUT_SECRET");
        return;
      }

      // Option B: One-liner 'timeout -r Phrase' or 'timeout -r "Phrase"'
      if (
        firstCmd.startsWith("timeout -r ") ||
        firstCmd.startsWith("timeout -R ") ||
        firstCmd.startsWith("timeout --reset ")
      ) {
        let pass = firstCmd
          .replace(/^timeout\s+(-r|-R|--reset)\s*/i, "")
          .trim();
        pass = pass.replace(/^['"]+|['"]+$/g, "");

        if (!pass) {
          setStage("PROVIDE_TIMEOUT_SECRET");
          return;
        }

        try {
          const res = await fetch("/api/ugaas/auth/override-timeout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passphrase: pass }),
          });
          const data = await res.json();

          if (data.success) {
            try {
              localStorage.removeItem("ugaas_login_timeout");
              localStorage.removeItem("ugaas_failed_attempts");
            } catch {}

            setIsLocked(false);
            setFailedAttempts(0);
            setStage("IN_UGAAS");
            setCurrentPath("ugaas");
            setEmailBuffer("");

            setLines((prev) => [
              ...prev,
              {
                id: `to-ok-${Date.now()}`,
                type: "boot",
                text: "[OK] Security timeout lockout overridden. Terminal reset.",
              },
            ]);
            return;
          } else {
            setLines((prev) => [
              ...prev,
              {
                id: `err-to-${Date.now()}`,
                type: "error",
                text: "wrong input please try another",
              },
            ]);
            return;
          }
        } catch {
          const localSecret = (
            localStorage.getItem("ugaas_timeout_override_key") || "Hooyo Mcn"
          ).trim();

          if (pass === localSecret) {
            try {
              localStorage.removeItem("ugaas_login_timeout");
              localStorage.removeItem("ugaas_failed_attempts");
            } catch {}

            setIsLocked(false);
            setFailedAttempts(0);
            setStage("IN_UGAAS");
            setCurrentPath("ugaas");
            setEmailBuffer("");

            setLines((prev) => [
              ...prev,
              {
                id: `to-ok-${Date.now()}`,
                type: "boot",
                text: "[OK] Security timeout lockout overridden. Terminal reset.",
              },
            ]);
          } else {
            setLines((prev) => [
              ...prev,
              {
                id: `err-to-${Date.now()}`,
                type: "error",
                text: "wrong input please try another",
              },
            ]);
          }
          return;
        }
      }

      // CHECK FOR TIMEOUT STATUS COMMAND: timeout -ls
      if (
        firstCmd === "timeout -ls" ||
        firstCmd === "timeout -LS" ||
        firstCmd === "timeout -l" ||
        firstCmd === "timeout --list"
      ) {
        if (isLocked) {
          let timeoutUntil = Date.now() + TIMEOUT_DURATION_MS;
          try {
            const saved = localStorage.getItem("ugaas_login_timeout");
            if (saved) timeoutUntil = Number(saved);
          } catch {}

          setLines((prev) => [
            ...prev,
            {
              id: `timer-${Date.now()}`,
              type: "timeout-timer",
              expiresAt: timeoutUntil,
            },
          ]);
          return;
        } else {
          setLines((prev) => [
            ...prev,
            {
              id: `to-none-${Date.now()}`,
              type: "output",
              text: "u are not in timeout",
            },
          ]);
          return;
        }
      }

      // CHECK FOR ROUTE COMMAND: route home, route page, route <page>, route list, route -ls
      if (
        firstCmd === "route" ||
        firstCmd.startsWith("route ") ||
        firstCmd.startsWith("route/") ||
        firstCmd.startsWith("goto ") ||
        firstCmd.startsWith("navigate ")
      ) {
        const rawTarget = firstCmd
          .replace(/^(route|goto|navigate)\s*/i, "")
          .trim()
          .toLowerCase();

        const routeMap: Record<string, { path: string; label: string }> = {
          home: { path: "/", label: "Home Landing" },
          "/": { path: "/", label: "Home Landing" },
          root: { path: "/", label: "Home Landing" },
          main: { path: "/", label: "Home Landing" },
          work: { path: "/work", label: "Projects & Work" },
          projects: { path: "/work", label: "Projects & Work" },
          project: { path: "/work", label: "Projects & Work" },
          "/work": { path: "/work", label: "Projects & Work" },
          "/projects": { path: "/work", label: "Projects & Work" },
          about: { path: "/about", label: "About Mohamed" },
          "/about": { path: "/about", label: "About Mohamed" },
          bio: { path: "/about", label: "About Mohamed" },
          experience: { path: "/experience", label: "Experience & Timeline" },
          "/experience": { path: "/experience", label: "Experience & Timeline" },
          career: { path: "/experience", label: "Experience & Timeline" },
          blog: { path: "/blog", label: "Blog & Engineering Notes" },
          "/blog": { path: "/blog", label: "Blog & Engineering Notes" },
          articles: { path: "/blog", label: "Blog & Engineering Notes" },
          gallery: { path: "/Gallery", label: "Gallery & Certificates" },
          "/gallery": { path: "/Gallery", label: "Gallery & Certificates" },
          certificates: { path: "/Gallery", label: "Gallery & Certificates" },
          certs: { path: "/Gallery", label: "Gallery & Certificates" },
          skills: { path: "/#skills", label: "Skills & Tech Stack" },
          services: { path: "/#services", label: "Services & Capabilities" },
          contact: { path: "/#contact", label: "Contact & Inquiries" },
          "/contact": { path: "/#contact", label: "Contact & Inquiries" },
          ugaas: { path: "/ugaas", label: "Ugaas Management Portal" },
          "/ugaas": { path: "/ugaas", label: "Ugaas Management Portal" },
          admin: { path: "/ugaas", label: "Ugaas Management Portal" },
        };

        if (
          !rawTarget ||
          rawTarget === "page" ||
          rawTarget === "pages" ||
          rawTarget === "list" ||
          rawTarget === "-ls" ||
          rawTarget === "--list" ||
          rawTarget === "-l" ||
          rawTarget === "help"
        ) {
          setLines((prev) => [
            ...prev,
            {
              id: `route-list-${Date.now()}`,
              type: "output",
              text:
                "Available Portfolio Routes:\n" +
                "  • home         -> / (Main portfolio landing)\n" +
                "  • work         -> /work (Projects & Work)\n" +
                "  • about        -> /about (Biography & Story)\n" +
                "  • experience   -> /experience (Career & Timeline)\n" +
                "  • blog         -> /blog (Technical Articles)\n" +
                "  • gallery      -> /Gallery (Certificates & Milestones)\n" +
                "  • contact      -> /#contact (Direct Inquiries)\n" +
                "  • ugaas        -> /ugaas (Admin Portal)\n\n" +
                "Usage: route <page> (e.g. 'route home', 'route projects', 'route about')",
            },
          ]);
          return;
        }

        const match =
          routeMap[rawTarget] || routeMap[rawTarget.replace(/^\//, "")];
        if (match) {
          setLines((prev) => [
            ...prev,
            {
              id: `route-ok-${Date.now()}`,
              type: "boot",
              text: `[NAV] Routing to ${match.path} (${match.label})...`,
            },
          ]);
          setTimeout(() => {
            router.push(match.path);
          }, 350);
          return;
        } else {
          setLines((prev) => [
            ...prev,
            {
              id: `route-err-${Date.now()}`,
              type: "error",
              text: `Route '${rawTarget}' not found. Type 'route page' or 'route list' to see available destinations.`,
            },
          ]);
          return;
        }
      }

      // If locked and not running override or status command
      if (isLocked) {
        setLines((prev) => [
          ...prev,
          {
            id: `lock-${Date.now()}`,
            type: "error",
            text: "you are in timeout return in later",
          },
        ]);
        return;
      }
    }

    // Sequential Execution Pipeline for Chained Commands
    let curStage: LoginStage = stage;
    let curPath = currentPath;
    let curEmail = emailBuffer;
    let curAttempts = failedAttempts;

    for (let i = 0; i < rawLines.length; i++) {
      const cmd = rawLines[i];

      // CLS / CLEAR
      if (curStage !== "ENTER_EMAIL" && curStage !== "ENTER_PASSWORD" && curStage !== "CONFIRM_ACCESS") {
        if (cmd === "cls" || cmd === "clear") {
          setLines([]);
          continue;
        }
        if (cmd.startsWith("cd")) {
          const target = cmd.slice(2).trim();
          if (target === "ugaas" || target === "./ugaas" || target === "/ugaas") {
            curPath = "ugaas";
            curStage = "IN_UGAAS";
            continue;
          } else if (target === ".." || target === "~" || target === "/" || target === "") {
            curPath = "~";
            curStage = "ROOT";
            continue;
          } else {
            setLines((prev) => [
              ...prev,
              {
                id: `err-${Date.now()}-${i}`,
                type: "error",
                text: "wrong input please try another",
              },
            ]);
            break;
          }
        }
      }

      // STEP 1: ROOT DIRECTORY -> must be 'cd ugaas'
      if (curStage === "ROOT") {
        setLines((prev) => [
          ...prev,
          {
            id: `err-root-${Date.now()}-${i}`,
            type: "error",
            text: "wrong input please try another",
          },
        ]);
        break;
      }

      // STEP 2: IN_UGAAS -> must be 'npm login'
      if (curStage === "IN_UGAAS") {
        if (cmd === "npm login" || cmd === "npm run login" || cmd === "npm auth") {
          curStage = "ENTER_EMAIL";
          continue;
        } else {
          setLines((prev) => [
            ...prev,
            {
              id: `err-npm-${Date.now()}-${i}`,
              type: "error",
              text: "wrong input please try another",
            },
          ]);
          break;
        }
      }

      // STEP 3: ENTER_EMAIL -> strictly validate @gmail.com (reject other commands)
      if (curStage === "ENTER_EMAIL") {
        const isCommandLike =
          cmd.startsWith("cd") ||
          cmd.startsWith("npm") ||
          cmd.startsWith("timeout") ||
          cmd === "cls" ||
          cmd === "clear" ||
          cmd.startsWith("ls") ||
          cmd.startsWith("help");

        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (isCommandLike || !gmailRegex.test(cmd)) {
          setLines((prev) => [
            ...prev,
            {
              id: `err-email-${Date.now()}-${i}`,
              type: "error",
              text: isCommandLike
                ? "no commands allowed, enter credential"
                : "wrong input please try another",
            },
          ]);
          curStage = "ENTER_EMAIL";
          break;
        }
        curEmail = cmd;
        curStage = "ENTER_PASSWORD";
        continue;
      }

      // STEP 4: ENTER_PASSWORD -> validate credentials
      if (curStage === "ENTER_PASSWORD") {
        const isCommandLike =
          cmd.startsWith("cd") ||
          cmd.startsWith("npm") ||
          cmd.startsWith("timeout") ||
          cmd === "cls" ||
          cmd === "clear" ||
          cmd.startsWith("ls") ||
          cmd.startsWith("help");

        if (!cmd || isCommandLike) {
          setLines((prev) => [
            ...prev,
            {
              id: `err-empty-pass-${Date.now()}-${i}`,
              type: "error",
              text: isCommandLike
                ? "no commands allowed, enter credential"
                : "wrong input please try another",
            },
          ]);
          curStage = "ENTER_EMAIL";
          curEmail = "";
          setEmailBuffer("");
          break;
        }

        setStage("AUTHENTICATING");
        try {
          const res = await signIn.email({
            email: curEmail.trim(),
            password: cmd.trim(),
          });

          if (res.error) {
            curAttempts += 1;
            setFailedAttempts(curAttempts);
            try {
              localStorage.setItem("ugaas_failed_attempts", String(curAttempts));
            } catch {}

            if (curAttempts >= MAX_PASSWORD_ATTEMPTS) {
              const lockoutUntil = Date.now() + TIMEOUT_DURATION_MS;
              try {
                localStorage.setItem("ugaas_login_timeout", String(lockoutUntil));
                localStorage.removeItem("ugaas_failed_attempts");
              } catch {}
              setIsLocked(true);
              setLines((prev) => [
                ...prev,
                {
                  id: `lockout-${Date.now()}`,
                  type: "error",
                  text: "you are in timeout return in later",
                },
              ]);
              return;
            }

            setLines((prev) => [
              ...prev,
              {
                id: `err-auth-${Date.now()}-${i}`,
                type: "error",
                text: "wrong input please try another",
              },
            ]);
            curStage = "ENTER_EMAIL";
            curEmail = "";
            setEmailBuffer("");
            break;
          }

          // Password Authentication Successful
          curAttempts = 0;
          try {
            localStorage.removeItem("ugaas_failed_attempts");
            localStorage.removeItem("ugaas_login_timeout");
          } catch {}
          curStage = "CONFIRM_ACCESS";
          continue;
        } catch {
          curAttempts += 1;
          setFailedAttempts(curAttempts);
          if (curAttempts >= MAX_PASSWORD_ATTEMPTS) {
            const lockoutUntil = Date.now() + TIMEOUT_DURATION_MS;
            try {
              localStorage.setItem("ugaas_login_timeout", String(lockoutUntil));
            } catch {}
            setIsLocked(true);
            setLines((prev) => [
              ...prev,
              {
                id: `lockout-${Date.now()}`,
                type: "error",
                text: "you are in timeout return in later",
              },
            ]);
            return;
          }
          setLines((prev) => [
            ...prev,
            {
              id: `err-catch-${Date.now()}-${i}`,
              type: "error",
              text: "wrong input please try another",
            },
          ]);
          curStage = "ENTER_EMAIL";
          curEmail = "";
          setEmailBuffer("");
          break;
        }
      }

      // STEP 5: CONFIRM_ACCESS -> must be -Y, -y, Y, y, yes, Yes, YES
      if (curStage === "CONFIRM_ACCESS") {
        const isCommandLike =
          cmd.startsWith("cd") ||
          cmd.startsWith("npm") ||
          cmd.startsWith("timeout") ||
          cmd === "cls" ||
          cmd === "clear" ||
          cmd.startsWith("ls") ||
          cmd.startsWith("help");

        const normalized = cmd.toLowerCase().replace(/^-+/, "").trim();
        if (["y", "yes"].includes(normalized)) {
          curStage = "ACCESS_GRANTED";
          setStage("ACCESS_GRANTED");
          runBootloader();
          return;
        } else {
          setLines((prev) => [
            ...prev,
            {
              id: `err-confirm-${Date.now()}-${i}`,
              type: "error",
              text: isCommandLike
                ? "no commands allowed, enter credential"
                : "wrong input please try another",
            },
          ]);
          curStage = "CONFIRM_ACCESS";
          break;
        }
      }
    }

    setStage(curStage);
    setCurrentPath(curPath);
    setEmailBuffer(curEmail);
    setFailedAttempts(curAttempts);
  };

  // Keyboard navigation, Shift+Enter multi-line & Ctrl+C interrupt
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // CTRL+C / CMD+C INTERRUPT: Cancel login and reset to after 'cd ugaas'
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      if (isLocked || isLaunchingApp) return;

      const currentPromptText = getPromptPrefix();
      const displayCommand = stage === "ENTER_PASSWORD" ? "" : inputVal;

      setLines((prev) => [
        ...prev,
        {
          id: `sigint-${Date.now()}`,
          type: "prompt",
          path: currentPromptText,
          command: `${displayCommand}^C`,
        },
      ]);

      // Reset login state back to after 'cd ugaas'
      setStage("IN_UGAAS");
      setCurrentPath("ugaas");
      setEmailBuffer("");
      setInputVal("");
      setHistoryIndex(-1);
      return;
    }

    // Shift + Enter: Allow multi-line command chain (appends \n)
    if (e.key === "Enter" && e.shiftKey) {
      // Natural newline inserted in textarea
      return;
    }

    // Enter (without Shift): Execute commands!
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommandSubmit();
      return;
    }

    // History navigation only on single line
    if (stage !== "ENTER_PASSWORD" && !inputVal.includes("\n")) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const nextIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal("");
        } else {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex] || "");
        }
      }
    }
  };

  const inputSubLines = inputVal.split("\n");

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-auto font-mono transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#07090E] text-slate-200 selection:bg-[#0B82EC]/30"
          : "bg-[#F1F5F9] text-slate-800 selection:bg-[#0284C7]/20"
      }`}
    >
      {/* Background Cyber Ambient Grid */}
      <div
        className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none transition-opacity duration-300 ${
          isDarkMode
            ? "bg-[linear-gradient(to_right,#111622_1px,transparent_1px),linear-gradient(to_bottom,#111622_1px,transparent_1px)] opacity-30"
            : "bg-[linear-gradient(to_right,#CBD5E1_1px,transparent_1px),linear-gradient(to_bottom,#CBD5E1_1px,transparent_1px)] opacity-40"
        }`}
      />

      {/* Auto-expanding Terminal Window (Fits wide lines dynamically) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={
          isLaunchingApp
            ? {
                scale: 1.08,
                opacity: 0,
                filter: "blur(8px)",
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-fit min-w-[min(100%,680px)] max-w-[min(96vw,1280px)] relative z-10 flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
          isDarkMode
            ? "border border-[#1E293B] bg-[#0A0D14] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
            : "border border-[#CBD5E1] bg-[#FFFFFF] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)]"
        }`}
      >
        {/* Terminal Title Bar */}
        <div
          className={`h-11 px-4 flex items-center justify-between select-none transition-colors duration-300 ${
            isDarkMode
              ? "bg-[#0F141F] border-b border-[#1E293B]"
              : "bg-[#F8FAFC] border-b border-[#E2E8F0]"
          }`}
        >
          {/* Window Buttons */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#DC2626]/80" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-[#D97706]/80" />
            <span className="w-3 h-3 rounded-full bg-[#10B981] border border-[#059669]/80" />
          </div>

          {/* Window Title */}
          <div
            className={`flex items-center gap-2 text-xs font-semibold tracking-wide ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <TerminalIcon
              className={`w-3.5 h-3.5 ${
                isDarkMode ? "text-[#0B82EC]" : "text-[#0284C7]"
              }`}
            />
            <span className="truncate">terminal ~ bash</span>
          </div>

          {/* Right Action: Quick Theme Toggle Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={toggleTheme}
              type="button"
              title={
                isDarkMode
                  ? "Switch to Light mode"
                  : "Switch to Dark mode"
              }
              aria-label="Toggle Theme"
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

        {/* Terminal Screen / Output Body */}
        <div
          onClick={handleTerminalClick}
          className={`p-5 sm:p-6 min-h-[380px] max-h-[72vh] overflow-y-auto custom-scrollbar space-y-2 text-xs sm:text-sm leading-relaxed cursor-text transition-colors duration-300 ${
            isDarkMode ? "bg-[#0A0D14]" : "bg-[#FFFFFF]"
          }`}
        >
          {lines.map((line) => {
            if (line.type === "prompt") {
              const cmdSubLines = (line.command || "").split("\n");
              return (
                <div key={line.id} className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-semibold shrink-0 ${
                        isDarkMode ? "text-[#2DD4BF]" : "text-[#0D9488]"
                      }`}
                    >
                      {line.path}
                    </span>
                    <span
                      className={`font-bold whitespace-pre-wrap ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {cmdSubLines[0]}
                    </span>
                  </div>
                  {cmdSubLines.slice(1).map((sub, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 pl-1">
                      <span
                        className={`font-bold shrink-0 ${
                          isDarkMode ? "text-cyan-400" : "text-cyan-600"
                        }`}
                      >
                        &gt;&gt;
                      </span>
                      <span
                        className={`font-bold whitespace-pre-wrap ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {sub}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }
            if (line.type === "error") {
              return (
                <div
                  key={line.id}
                  className={`font-mono whitespace-pre-wrap ${
                    isDarkMode
                      ? "text-red-400"
                      : "text-red-600 font-semibold"
                  }`}
                >
                  {line.text}
                </div>
              );
            }
            if (line.type === "boot") {
              const text = line.text || "";
              if (text.startsWith("[OK]")) {
                return (
                  <div
                    key={line.id}
                    className={`font-mono flex items-center gap-2 ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    <span
                      className={`font-bold shrink-0 ${
                        isDarkMode ? "text-[#10B981]" : "text-[#059669]"
                      }`}
                    >
                      [OK]
                    </span>
                    <span className="whitespace-pre-wrap">{text.slice(4)}</span>
                  </div>
                );
              }
              if (text.startsWith("[npm]")) {
                return (
                  <div
                    key={line.id}
                    className={`font-mono flex items-center gap-2 ${
                      isDarkMode ? "text-cyan-400" : "text-cyan-700"
                    }`}
                  >
                    <span
                      className={`font-bold shrink-0 ${
                        isDarkMode ? "text-cyan-300" : "text-cyan-800"
                      }`}
                    >
                      [npm]
                    </span>
                    <span className="whitespace-pre-wrap">{text.slice(5)}</span>
                  </div>
                );
              }
              if (text.startsWith("[")) {
                return (
                  <div
                    key={line.id}
                    className={`font-mono whitespace-pre-wrap ${
                      isDarkMode
                        ? "text-amber-300"
                        : "text-amber-600 font-semibold"
                    }`}
                  >
                    {text}
                  </div>
                );
              }
              if (text.startsWith("▲ Next.js")) {
                return (
                  <div
                    key={line.id}
                    className={`font-bold pt-1 whitespace-pre-wrap ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {text}
                  </div>
                );
              }
              return (
                <div
                  key={line.id}
                  className={`font-mono whitespace-pre-wrap ${
                    isDarkMode ? "text-[#2DD4BF]" : "text-[#0D9488]"
                  }`}
                >
                  {text}
                </div>
              );
            }
            if (line.type === "timeout-timer") {
              return (
                <TimeoutCountdown
                  key={line.id}
                  expiresAt={line.expiresAt || Date.now()}
                  isDarkMode={isDarkMode}
                  onExpire={() => {
                    try {
                      localStorage.removeItem("ugaas_login_timeout");
                      localStorage.removeItem("ugaas_failed_attempts");
                    } catch {}
                    setIsLocked(false);
                    setFailedAttempts(0);
                    setLines((prev) => [
                      ...prev,
                      {
                        id: `to-exp-${Date.now()}`,
                        type: "boot",
                        text: "[OK] Security timeout has expired. Terminal unlocked.",
                      },
                    ]);
                  }}
                />
              );
            }
            return (
              <div
                key={line.id}
                className={`whitespace-pre-wrap ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {line.text}
              </div>
            );
          })}

          {/* Active Input Line (Dynamically auto-expands terminal width with typed text) */}
          {stage !== "AUTHENTICATING" && stage !== "ACCESS_GRANTED" && (
            <div className="pt-1">
              <form onSubmit={handleCommandSubmit} className="space-y-1">
                {/* First Line / Single Line Active Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-semibold shrink-0 ${
                      isDarkMode ? "text-[#2DD4BF]" : "text-[#0D9488]"
                    }`}
                  >
                    {getPromptPrefix()}
                  </span>

                  <div className="relative inline-flex items-center">
                    {/* Visual text mirror that dynamically expands the container width */}
                    <span
                      className={`font-bold whitespace-pre font-mono text-xs sm:text-sm leading-relaxed ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {stage === "ENTER_PASSWORD" && inputSubLines.length <= 1
                        ? "•".repeat(inputVal.length)
                        : inputSubLines[0]}
                    </span>

                    {/* Active Blinking Cursor */}
                    {inputSubLines.length <= 1 && (
                      <span
                        className={`inline-block w-2 h-4 ml-0.5 rounded-xs animate-pulse align-middle shrink-0 ${
                          isDarkMode ? "bg-[#0B82EC]" : "bg-[#0284C7]"
                        }`}
                      />
                    )}

                    {/* Hidden interactive input overlay capturing keystrokes */}
                    <textarea
                      ref={textareaRef}
                      rows={inputSubLines.length > 1 ? Math.min(inputSubLines.length, 6) : 1}
                      autoFocus
                      disabled={isLaunchingApp}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className="absolute inset-0 opacity-0 cursor-text w-full h-full resize-none z-10 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    aria-label="Execute"
                    className={`shrink-0 transition-colors p-1 ml-auto ${
                      isDarkMode
                        ? "text-slate-500 hover:text-white"
                        : "text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Continuation Lines (>> ) for Multi-line Input */}
                {inputSubLines.slice(1).map((sub, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 pl-1">
                    <span
                      className={`font-bold shrink-0 ${
                        isDarkMode ? "text-cyan-400" : "text-cyan-600"
                      }`}
                    >
                      &gt;&gt;
                    </span>
                    <span
                      className={`font-bold whitespace-pre font-mono text-xs sm:text-sm ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {sub}
                    </span>
                    {sIdx === inputSubLines.length - 2 && (
                      <span
                        className={`inline-block w-2 h-4 ml-0.5 rounded-xs animate-pulse align-middle shrink-0 ${
                          isDarkMode ? "bg-[#0B82EC]" : "bg-[#0284C7]"
                        }`}
                      />
                    )}
                  </div>
                ))}

                {inputSubLines.length > 1 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1 pl-1">
                    <span className="text-cyan-400 font-bold animate-pulse">&gt;&gt;</span>
                    <span>(Press Enter to execute all lines)</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {stage === "AUTHENTICATING" && (
            <div
              className={`font-mono flex items-center gap-2 pt-1 ${
                isDarkMode ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying credentials with cluster...</span>
            </div>
          )}

          <div ref={terminalBottomRef} />
        </div>
      </motion.div>

      {/* App Launch Shutter Overlay */}
      {isLaunchingApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none ${
            isDarkMode ? "bg-[#0A0D14]" : "bg-[#F8FAFC]"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-3xl border flex items-center justify-center animate-pulse ${
              isDarkMode
                ? "bg-[#0B82EC]/20 border-[#0B82EC]/40 text-[#0B82EC]"
                : "bg-[#0284C7]/20 border-[#0284C7]/40 text-[#0284C7]"
            }`}
          >
            <Sparkles className="w-8 h-8" />
          </div>
          <p
            className={`mt-4 text-xs font-mono font-bold uppercase tracking-wider ${
              isDarkMode ? "text-cyan-400" : "text-cyan-700"
            }`}
          >
            Launching Ugaas Console...
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading Terminal...
        </div>
      }
    >
      <TerminalLoginForm />
    </Suspense>
  );
}

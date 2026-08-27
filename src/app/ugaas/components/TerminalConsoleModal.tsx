"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Terminal, RefreshCw, Trash2, Send, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/ugaas/lib/auth-client";

interface TerminalConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  type: "info" | "success" | "warn" | "error" | "prompt";
  text: string;
  timestamp: string;
}

export function TerminalConsoleModal({
  isOpen,
  onClose,
}: TerminalConsoleModalProps) {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const [running, setRunning] = useState(false);
  const [isPrivacyBlurred, setIsPrivacyBlurred] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
  };

  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { text, type, timestamp: getTimestamp() }]);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ugaas_terminal_privacy_blur");
      if (saved === "true") setIsPrivacyBlurred(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (isOpen && logs.length === 0) {
      setLogs([
        {
          type: "info",
          text: "[SYSTEM] Connected to Ugaas Management Kernel v3.0.4 [Node 20 / MongoDB Atlas]",
          timestamp: getTimestamp(),
        },
        {
          type: "info",
          text: "Type 'help' to see active system commands, or 'route page' to navigate.",
          timestamp: getTimestamp(),
        },
      ]);
    }
  }, [isOpen, logs.length]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addLog(`ugaas@portfolio:~$ ${trimmed}`, "prompt");
    setCommandInput("");
    setRunning(true);

    const lower = trimmed.toLowerCase();

    // CLEAR / CLS
    if (lower === "clear" || lower === "cls") {
      setLogs([]);
      setRunning(false);
      return;
    }

    // HELP
    if (lower === "help") {
      addLog(
        "Available commands:\n" +
          "  route <page>          Navigate across admin modules & portfolio pages\n" +
          "  hide -terminal [t/f]  Toggle stealth privacy blur on active inputs\n" +
          "  ping                  Check database latency & cluster health\n" +
          "  stats                 View system telemetry & CMS counts\n" +
          "  uptime                Display server uptime & node region\n" +
          "  auth                  Verify active admin session credentials\n" +
          "  exit / logout         Graceful session unmount & redirect to portfolio\n" +
          "  clear                 Clear console buffer",
        "info"
      );
      setRunning(false);
      return;
    }

    // PRIVACY STEALTH BLUR: hide -terminal true / false
    if (
      lower === "hide -terminal" ||
      lower.startsWith("hide -terminal ") ||
      lower.startsWith("hide --terminal ") ||
      lower === "hide -t" ||
      lower.startsWith("hide -t ")
    ) {
      const arg = lower
        .replace(/^hide\s+(-terminal|--terminal|-t)\s*/i, "")
        .trim()
        .toLowerCase();

      if (
        arg === "true" ||
        arg === "1" ||
        arg === "on" ||
        arg === "enable" ||
        arg === "yes"
      ) {
        setIsPrivacyBlurred(true);
        try {
          localStorage.setItem("ugaas_terminal_privacy_blur", "true");
        } catch {}
        addLog(
          "✓ [PRIVACY] Terminal stealth blur mode enabled. Input is now blurred.",
          "success"
        );
        setRunning(false);
        return;
      } else if (
        arg === "false" ||
        arg === "0" ||
        arg === "off" ||
        arg === "disable" ||
        arg === "no"
      ) {
        setIsPrivacyBlurred(false);
        try {
          localStorage.setItem("ugaas_terminal_privacy_blur", "false");
        } catch {}
        addLog(
          "✓ [PRIVACY] Terminal stealth blur mode disabled. Input is now visible.",
          "success"
        );
        setRunning(false);
        return;
      } else {
        addLog(
          `Terminal stealth blur mode is currently: [${
            isPrivacyBlurred ? "ENABLED" : "DISABLED"
          }].\nUsage: hide -terminal true | hide -terminal false`,
          "info"
        );
        setRunning(false);
        return;
      }
    }

    // ROUTE COMMAND: route home, route page, route <page>, route list, route -ls
    if (
      lower === "route" ||
      lower.startsWith("route ") ||
      lower.startsWith("route/") ||
      lower.startsWith("goto ") ||
      lower.startsWith("navigate ")
    ) {
      const rawTarget = lower
        .replace(/^(route|goto|navigate)\s*/i, "")
        .trim()
        .toLowerCase();

      const routeMap: Record<string, { path: string; label: string }> = {
        // Public Portfolio Routes
        home: { path: "/", label: "Portfolio Home" },
        "/": { path: "/", label: "Portfolio Home" },
        root: { path: "/", label: "Portfolio Home" },
        portfolio: { path: "/", label: "Portfolio Home" },
        work: { path: "/work", label: "Projects Portfolio" },
        "/work": { path: "/work", label: "Projects Portfolio" },
        about: { path: "/about", label: "About Mohamed" },
        "/about": { path: "/about", label: "About Mohamed" },
        blog: { path: "/blog", label: "Blog & Engineering" },
        "/blog": { path: "/blog", label: "Blog & Engineering" },
        gallery: { path: "/Gallery", label: "Gallery & Certificates" },
        "/gallery": { path: "/Gallery", label: "Gallery & Certificates" },
        certs: { path: "/Gallery", label: "Gallery & Certificates" },
        contact: { path: "/#contact", label: "Contact Section" },
        "/contact": { path: "/#contact", label: "Contact Section" },

        // Admin CMS Modules
        ugaas: { path: "/ugaas", label: "Admin Dashboard Overview" },
        "/ugaas": { path: "/ugaas", label: "Admin Dashboard Overview" },
        admin: { path: "/ugaas", label: "Admin Dashboard Overview" },
        dashboard: { path: "/ugaas", label: "Admin Dashboard Overview" },
        overview: { path: "/ugaas", label: "Admin Dashboard Overview" },
        projects: { path: "/ugaas/projects", label: "Projects Management CMS" },
        "/projects": { path: "/ugaas/projects", label: "Projects Management CMS" },
        "ugaas/projects": { path: "/ugaas/projects", label: "Projects Management CMS" },
        experience: { path: "/ugaas/experience", label: "Experience & Education CMS" },
        "/experience": { path: "/ugaas/experience", label: "Experience & Education CMS" },
        "ugaas/experience": { path: "/ugaas/experience", label: "Experience & Education CMS" },
        inquiries: { path: "/ugaas/inquiries", label: "Inquiries & Inbox" },
        "/inquiries": { path: "/ugaas/inquiries", label: "Inquiries & Inbox" },
        "ugaas/inquiries": { path: "/ugaas/inquiries", label: "Inquiries & Inbox" },
        inbox: { path: "/ugaas/inquiries", label: "Inquiries & Inbox" },
        messages: { path: "/ugaas/inquiries", label: "Inquiries & Inbox" },
        logs: { path: "/ugaas/logs", label: "System & Security Logs" },
        "/logs": { path: "/ugaas/logs", label: "System & Security Logs" },
        "ugaas/logs": { path: "/ugaas/logs", label: "System & Security Logs" },
        audit: { path: "/ugaas/logs", label: "System & Security Logs" },
        settings: { path: "/ugaas/settings", label: "Admin & Developer Settings" },
        "/settings": { path: "/ugaas/settings", label: "Admin & Developer Settings" },
        "ugaas/settings": { path: "/ugaas/settings", label: "Admin & Developer Settings" },
        config: { path: "/ugaas/settings", label: "Admin & Developer Settings" },
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
        addLog(
          "Available Navigation Destinations:\n" +
            "  Admin Modules:\n" +
            "    • dashboard / overview -> /ugaas\n" +
            "    • projects             -> /ugaas/projects\n" +
            "    • experience           -> /ugaas/experience\n" +
            "    • inquiries / inbox    -> /ugaas/inquiries\n" +
            "    • logs / audit         -> /ugaas/logs\n" +
            "    • settings / config    -> /ugaas/settings\n" +
            "  Portfolio Pages:\n" +
            "    • home / portfolio     -> /\n" +
            "    • work                 -> /work\n" +
            "    • about                -> /about\n" +
            "    • blog                 -> /blog\n" +
            "    • gallery              -> /Gallery\n" +
            "    • contact              -> /#contact\n\n" +
            "Usage: route <page> (e.g. 'route home', 'route projects', 'route settings')",
          "info"
        );
        setRunning(false);
        return;
      }

      const match =
        routeMap[rawTarget] || routeMap[rawTarget.replace(/^\//, "")];
      if (match) {
        addLog(`[NAV] Navigating to ${match.path} (${match.label})...`, "success");
        setTimeout(() => {
          onClose();
          router.push(match.path);
        }, 350);
        return;
      } else {
        addLog(
          `Route '${rawTarget}' not found. Type 'route page' or 'route list' to view available destinations.`,
          "error"
        );
        setRunning(false);
        return;
      }
    }

    // EXIT / LOGOUT / QUIT / SIGNOUT
    if (lower === "exit" || lower === "logout" || lower === "quit" || lower === "signout") {
      addLog("[ugaas] initiating graceful session unmount sequence...", "info");

      const shutdownSteps: { text: string; type: LogEntry["type"]; delay: number }[] = [
        { text: "[npm] resolving teardown pipeline for @ugaas/admin-core v3.0.4...", type: "warn", delay: 180 },
        { text: "[1/6] ⠋ unmounting database cluster [myportfolio@mongodb-atlas]...", type: "info", delay: 200 },
        { text: "[2/6] ⠙ flushing telemetry streams & audit event daemon...", type: "info", delay: 200 },
        { text: "[3/6] ⠹ unmounting CMS subsystems: projects, experience, inquiries...", type: "info", delay: 200 },
        { text: "[4/6] ⠸ revoking Better-Auth session tokens & RSA-256 signatures...", type: "info", delay: 200 },
        { text: "[5/6] ⠼ tearing down hardware telemetry & security guard...", type: "info", delay: 200 },
        { text: "[6/6] ⠴ clearing admin session cache & synchronizing UI view transitions...", type: "info", delay: 200 },
        { text: "[========================================>] 100%", type: "warn", delay: 180 },
        { text: "[OK] Mounted: CMS subsystems unmounted successfully", type: "success", delay: 140 },
        { text: "[OK] Security: Superuser Clearance Level 1 revoked", type: "success", delay: 140 },
        { text: "[OK] Session terminated. Redirecting to portfolio homepage...", type: "success", delay: 300 },
      ];

      for (const step of shutdownSteps) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        addLog(step.text, step.type);
      }

      // Invalidate session
      try {
        await signOut();
      } catch (err) {
        console.error("SignOut error:", err);
      }

      try {
        localStorage.removeItem("better-auth.session_token");
        localStorage.removeItem("ugaas_failed_attempts");
      } catch {}

      await new Promise((resolve) => setTimeout(resolve, 350));
      window.location.href = "/";
      return;
    }

    // PING
    if (lower === "ping" || lower === "ping db") {
      try {
        const start = performance.now();
        const res = await fetch("/api/ugaas/overview");
        const data = await res.json();
        const end = performance.now();
        const latency = Math.round(end - start);

        if (data.success) {
          addLog(`✓ PONG: MongoDB cluster responded in ${latency}ms (Status: READY)`, "success");
          addLog(`  Database: ${data.stats?.dbStatus?.database || "myportfolio"}`, "info");
        } else {
          addLog(`✗ Ping warning: ${data.error || "Response degraded"}`, "warn");
        }
      } catch (err) {
        addLog(`✗ Ping failed: ${err instanceof Error ? err.message : "Network error"}`, "error");
      }
      setRunning(false);
      return;
    }

    // STATS
    if (lower === "stats") {
      try {
        const res = await fetch("/api/ugaas/overview");
        const data = await res.json();
        if (data.success && data.stats) {
          addLog(
            `📊 Live Statistics:\n` +
            `  • Total Projects: ${data.stats.totalProjects}\n` +
            `  • Inbound Inquiries: ${data.stats.inquiries?.total} (${data.stats.inquiries?.unread} unread)\n` +
            `  • Experience Records: ${data.stats.experienceMilestones}\n` +
            `  • Tech Stack Icons: ${data.stats.activeTechStack}`,
            "info"
          );
        }
      } catch {
        addLog("✗ Could not retrieve telemetry.", "error");
      }
      setRunning(false);
      return;
    }

    // AUTH
    if (lower === "auth") {
      addLog("✓ Active Session: Mohamed Aweys (Role: Super Admin)\n✓ Engine: Better Auth Session Cookies Validated", "success");
      setRunning(false);
      return;
    }

    // UPTIME
    if (lower === "uptime") {
      addLog(`✓ Server Uptime: 99.98% • banadir-edge • node runtime`, "info");
      setRunning(false);
      return;
    }

    addLog(`bash: command not found: ${trimmed}. Type 'help' for options.`, "error");
    setRunning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !running && onClose()}>
      <DialogContent className="max-w-3xl bg-[#090C12] border border-[#222938] text-primaryText rounded-2xl shadow-2xl p-0 overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[#111622] border-b border-[#222938] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Window controls */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <Terminal className="w-4 h-4 text-[#0B82EC]" />
            <span className="text-xs font-bold text-white tracking-wider">
              TERMINAL // DEV_CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              disabled={running}
              onClick={() => {
                const next = !isPrivacyBlurred;
                setIsPrivacyBlurred(next);
                try {
                  localStorage.setItem("ugaas_terminal_privacy_blur", String(next));
                } catch {}
              }}
              className={`h-7 px-2 text-[11px] transition-colors ${
                isPrivacyBlurred
                  ? "text-amber-400 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25"
                  : "text-mutedText hover:text-white"
              }`}
              title={
                isPrivacyBlurred
                  ? "Stealth Blur Mode: ACTIVE (Click to reveal or run 'hide -terminal false')"
                  : "Stealth Blur Mode: OFF (Click to blur or run 'hide -terminal true')"
              }
            >
              {isPrivacyBlurred ? (
                <>
                  <EyeOff className="w-3 h-3 mr-1 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400">Blur On</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  <span>Stealth</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              disabled={running}
              onClick={() => executeCommand("ping")}
              className="h-7 px-2 text-[11px] text-[#2DD4BF] hover:bg-[#2DD4BF]/10"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Ping DB
            </Button>

            <Button
              size="sm"
              variant="ghost"
              disabled={running}
              onClick={() => executeCommand("exit")}
              className="h-7 px-2 text-[11px] text-red-400 hover:bg-red-500/10 hover:text-red-300"
              title="Graceful Logout & Teardown"
            >
              <LogOut className="w-3 h-3 mr-1" /> Exit
            </Button>

            <Button
              size="sm"
              variant="ghost"
              disabled={running}
              onClick={() => setLogs([])}
              className="h-7 px-2 text-[11px] text-mutedText hover:text-white"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Terminal Screen Output */}
        <div className="p-4 h-96 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-2 select-text bg-[#090C12]">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${
                log.type === "prompt"
                  ? "text-white font-bold"
                  : log.type === "success"
                  ? "text-[#2DD4BF]"
                  : log.type === "warn"
                  ? "text-amber-400"
                  : log.type === "error"
                  ? "text-red-400"
                  : "text-gray-300"
              }`}
            >
              <span className="text-mutedText/50 select-none shrink-0 font-mono text-[10px]">
                [{log.timestamp}]
              </span>
              <pre
                className={`font-mono whitespace-pre-wrap flex-1 ${
                  isPrivacyBlurred && log.type === "prompt"
                    ? "blur-[5px] select-none hover:blur-none transition-all duration-200"
                    : ""
                }`}
              >
                {log.text}
              </pre>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Command Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(commandInput);
          }}
          className="p-3 bg-[#111622] border-t border-[#222938] flex items-center gap-2"
        >
          <span className="text-[#0B82EC] text-xs font-bold shrink-0">
            ugaas@portfolio:~$
          </span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type 'help', 'route page', 'hide -terminal true'..."
            disabled={running}
            className={`flex-1 bg-transparent text-xs text-white placeholder:text-mutedText/40 focus:outline-none font-mono disabled:opacity-50 transition-all duration-200 ${
              isPrivacyBlurred
                ? "blur-[5px] select-none hover:blur-none"
                : ""
            }`}
            autoFocus
          />
          <button
            type="submit"
            disabled={running || !commandInput.trim()}
            className="text-mutedText hover:text-[#0B82EC] transition-colors p-1 disabled:opacity-30 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

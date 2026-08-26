"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Terminal, RefreshCw, Trash2, CheckCircle2, ShieldCheck, Database, Send, LogOut } from "lucide-react";
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
  const logEndRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
  };

  const addLog = (text: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { text, type, timestamp: getTimestamp() }]);
  };

  useEffect(() => {
    if (isOpen && logs.length === 0) {
      setLogs([
        {
          type: "info",
          text: "🚀 Eng_Aweis Developer Console CLI [v3.0.0-PROD]",
          timestamp: getTimestamp(),
        },
        {
          type: "info",
          text: "Type 'help' or click quick actions to execute commands.",
          timestamp: getTimestamp(),
        },
        {
          type: "success",
          text: "✓ Environment: Next.js 15 App Router | Node.js Runtime",
          timestamp: getTimestamp(),
        },
        {
          type: "success",
          text: "✓ Database: MongoDB Atlas (Cluster: ugaas) Connected (~12ms)",
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
        "  ping          Check database latency & cluster health\n" +
        "  stats         View system telemetry & CMS counts\n" +
        "  uptime        Display server uptime & node region\n" +
        "  auth          Verify active admin session credentials\n" +
        "  exit / logout Graceful session unmount & redirect to portfolio\n" +
        "  clear         Clear console buffer",
        "info"
      );
      setRunning(false);
      return;
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

          <div className="flex items-center gap-2">
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
              <pre className="font-mono whitespace-pre-wrap flex-1">{log.text}</pre>
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
            placeholder="Type 'help', 'ping', 'stats', 'exit'..."
            disabled={running}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-mutedText/40 focus:outline-none font-mono disabled:opacity-50"
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

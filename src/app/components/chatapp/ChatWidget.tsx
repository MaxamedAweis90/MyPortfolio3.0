"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsChatDots, BsX, BsSend, BsArrowsFullscreen, BsArrowsAngleContract } from "react-icons/bs";

// DaisyUI/Tailwind powered floating chat widget (design only)
// Z-index set high to float above the app (except any explicit full-screen loaders you have)
export default function ChatWidget() {
  type ChatMessage = {
    id: number;
    role: "user" | "assistant";
    content: string;
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mount portal container to body so we escape stacking contexts
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "chat-widget-overlay";
    document.body.appendChild(el);
    portalRef.current = el;
    setMounted(true);
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
        portalRef.current = null;
      }
    };
  }, []);

  const handleToggleExpand = () => setIsExpanded((v) => !v);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: trimmed }]);
    setMessage("");
    // Reset textarea height after sending
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
    // Design preview response
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "this is upcoming feature in production for now" },
      ]);
    }, 700);
  };

  // Auto-scroll to bottom on new messages or when opening
  useEffect(() => {
    if (!open) return;
    const el = messagesEndRef.current;
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const content = (
    <div className="fixed inset-0 z-[2147483647] pointer-events-none">
      {/* bottom-right island (respects safe area) */}
      <div
        className="absolute bottom-5 right-5 pointer-events-auto"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Floating button with unread badge */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close chat" : "Open chat"}
            aria-expanded={open}
            className="btn btn-circle btn-lg text-white shadow-2xl hover:scale-110 transition-all duration-300 border-0 bg-gradient-to-br from-brandAccent via-blue-600 to-indigo-600 ring-2 ring-brandAccent/40 rounded-full p-4 min-w-12 min-h-12 flex items-center justify-center shadow-brandAccent/30"
          >
            {open ? <BsX size={22} /> : <BsChatDots size={22} />}
          </button>
          {!open && messages.length > 1 && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-mainBg animate-pulse" />
          )}
        </div>

        {/* Panel opening upward */}
        <div
          ref={panelRef}
          className={`absolute cursor-auto bottom-16 right-0 ${
            isExpanded ? "w-[95vw] sm:w-[44rem] md:w-[48rem]" : "w-[88vw] sm:w-[22rem] md:w-[24rem]"
          } origin-bottom-right transform-gpu ${
            open ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-0 translate-y-2 "
          } transition-[opacity,transform,width] duration-300 ease-out`}
          role="dialog"
          aria-label="UgaasAI Chat"
        >
          <div
            className={`bg-surface/95 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-borderSubtle overflow-hidden rounded-3xl ring-1 ring-white/10 ${
              isExpanded ? "h-[85vh]" : "h-[72vh] sm:h-[66vh]"
            } max-h-[90vh] min-h-[24rem] flex flex-col transition-[height] duration-300 ease-out`}
          >
            <div className="card-body p-0 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-10 flex-shrink-0 flex items-center justify-between px-4 py-3.5 bg-mainBg/90 backdrop-blur-md text-primaryText border-b border-borderSubtle rounded-t-3xl">
                {/* top handle */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-1.5 bg-borderSubtle/80 rounded-full" />
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-brandAccent to-indigo-600 text-white grid place-items-center text-xs font-black shadow-md shadow-brandAccent/20">
                    UAI
                    <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-mainBg" />
                  </div>
                  <div className="leading-tight">
                    <h3 className="font-extrabold text-sm text-primaryText">UgaasAI</h3>
                    <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 rounded-lg text-mutedText hover:text-white hover:bg-borderSubtle/50 transition-colors"
                    onClick={handleToggleExpand}
                    aria-label={isExpanded ? "Contract" : "Expand"}
                  >
                    {isExpanded ? <BsArrowsAngleContract size={16} /> : <BsArrowsFullscreen size={16} />}
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-mutedText hover:text-white hover:bg-borderSubtle/50 transition-colors"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <BsX size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain h-full p-4 bg-mainBg/95 text-primaryText flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Minimal center helper card */}
                  {messages.length < 1 && !typing && (
                    <div className="h-full flex flex-col justify-end items-center text-center p-4">
                      <div className="bg-surface/80 border border-borderSubtle rounded-2xl p-5 shadow-xl max-w-xs space-y-2">
                        <p className="font-extrabold text-base text-primaryText">👋 Hi, I&apos;m UgaasAI!</p>
                        <p className="text-xs text-mutedText leading-relaxed">
                          I&apos;m here to answer questions about Eng.Aweis&apos;s skills, projects, and architecture experience. 🚀
                        </p>
                      </div>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className="avatar self-end shrink-0">
                          <div
                            className={`w-7 h-7 rounded-full ${
                              m.role === "user"
                                ? "bg-gradient-to-r from-brandAccent to-secondaryAccent text-white"
                                : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                            } ring-1 ring-borderSubtle grid place-items-center shadow-sm`}
                          >
                            <span className="text-[10px] font-black leading-none">
                              {m.role === "user" ? "You" : "UAI"}
                            </span>
                          </div>
                        </div>
                        {/* Bubble + meta */}
                        <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                          <div
                            className={`w-fit max-w-[78%] sm:max-w-[90%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium shadow-md whitespace-pre-wrap break-words overflow-hidden ${
                              m.role === "user"
                                ? "bg-gradient-to-r from-brandAccent to-secondaryAccent text-white rounded-br-xs"
                                : "bg-surface border border-borderSubtle text-primaryText rounded-bl-xs"
                            }`}
                            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                          >
                            {m.content}
                          </div>
                          <div className="mt-1 text-[10px] text-mutedText font-semibold">
                            12:30 · {m.role === "user" ? "Delivered ✓✓" : "Seen"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {typing && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-2">
                        <div className="h-7 w-7 rounded-full grid place-items-center text-[10px] font-black shadow bg-gradient-to-tr from-indigo-600 to-purple-600 text-white">
                          UAI
                        </div>
                        <div className="w-fit max-w-[78%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-xs bg-surface border border-borderSubtle text-primaryText shadow-md">
                          <span className="inline-flex gap-1.5 items-center">
                            <span className="h-1.5 w-1.5 bg-brandAccent rounded-full animate-bounce [animation-delay:-0.2s]" />
                            <span className="h-1.5 w-1.5 bg-brandAccent rounded-full animate-bounce [animation-delay:0s]" />
                            <span className="h-1.5 w-1.5 bg-brandAccent rounded-full animate-bounce [animation-delay:0.2s]" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input area */}
              <div className="sticky bottom-0 z-10 flex-shrink-0 p-3 border-t border-borderSubtle bg-surface/95 rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-mainBg border border-borderSubtle focus-within:border-brandAccent rounded-2xl px-3 py-2 flex-1 shadow-inner transition-colors">
                    <textarea
                      rows={1}
                      className="flex-1 resize-none bg-transparent outline-none text-primaryText placeholder:text-mutedText text-xs sm:text-sm px-1"
                      placeholder="Ask UgaasAI something..."
                      value={message}
                      ref={textareaRef}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = Math.min(el.scrollHeight, 120) + "px";
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                  </div>
                  <button
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-brandAccent to-secondaryAccent text-white shadow-md disabled:opacity-40 hover:scale-105 transition-transform shrink-0"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    aria-label="Send"
                  >
                    <BsSend className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted || !portalRef.current) {
    // Fallback render without portal so the button is still usable
    return content;
  }
  return createPortal(content, portalRef.current);
}

"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsChatDots, BsX, BsSend, BsArrowsFullscreen, BsArrowsAngleContract } from "react-icons/bs";

// DaisyUI/Tailwind powered floating chat widget (design only)
// Z-index set high to float above the app (except any explicit full-screen loaders you have)
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const portalRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
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
            className="btn btn-circle btn-lg text-white shadow-xl hover:scale-105 transition-transform duration-200 border-0 bg-gradient-to-br from-blue-600 to-indigo-600 ring-2 ring-blue-500/30 rounded-full p-4 min-w-12 min-h-12 flex items-center justify-center"
          >
            {open ? <BsX size={22} /> : <BsChatDots size={22} />}
          </button>
          {!open && messages.length > 1 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
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
            className={`bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 ${
              isExpanded ? "h-[85vh]" : "h-[72vh] sm:h-[66vh]"
            } max-h-[90vh] min-h-[24rem] flex flex-col transition-[height] duration-300 ease-out`}
          >
            <div className="card-body p-0 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-10 flex-shrink-0 flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-900 border-b border-base-200 rounded-t-3xl">
                {/* top handle */}
                <div className=" absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-1.5 bg-base-300/80 rounded-full" />
                <div className="flex items-center gap-3">
                  <div className="relative h-7 w-7 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-bold shadow">
                    UAI
                    <span className="absolute -right-0 -bottom-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                  </div>
                  <div className="leading-tight">
                    <h3 className="font-semibold">UgaasAI</h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={handleToggleExpand}
                    aria-label={isExpanded ? "Contract" : "Expand"}
                  >
                    {isExpanded ? <BsArrowsAngleContract size={16} /> : <BsArrowsFullscreen size={16} />}
                  </button>
                  <button className="btn btn-ghost btn-xs" onClick={() => setOpen(false)} aria-label="Close">
                    <BsX size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain h-full p-4 bg-white scrollbar-whatsapp flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Minimal center helper with DaisyUI avatar */}
                  {messages.length < 1 && !typing && (
                    <div className="h-full flex flex-col justify-end items-center text-center text-gray-600">
                      <p className="font-bold text-lg mt-2">👋 Hi, I'm UgaasAI!</p>
                      <p className="text-sm mt-2">I'm here to help you Know everything about Eng.Aweis.</p>
                      <p className="text-sm">Ask me about his skills, projects, or experience. 🚀</p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        {/* Avatar (fixed circle, non-stretch) */}
                        <div className="avatar self-end shrink-0">
                          <div
                            className={`w-7 h-7 rounded-full ${
                              m.role === "user" ? "bg-blue-600 text-white" : "bg-indigo-600 text-white"
                            } ring ring-base-300 ring-offset-1 grid place-items-center`}
                          >
                            <span className="text-[10px] font-bold leading-none">
                              {m.role === "user" ? "You" : "UAI"}
                            </span>
                          </div>
                        </div>
                        {/* Bubble + meta */}
                        <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                          <div
                            className={`w-fit max-w-[78%] sm:max-w-[90%] px-3 py-2 rounded-2xl text-sm shadow whitespace-pre-wrap break-words overflow-hidden cursor-pointer ${
                              m.role === "user"
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-indigo-600 text-white rounded-bl-sm"
                            }`}
                            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                          >
                            {m.content}
                          </div>
                          <div
                            className={`mt-1 text-[10px] ${
                              m.role === "user" ? "text-right text-gray-400" : "text-gray-400"
                            }`}
                          >
                            12:30 · {m.role === "user" ? "Delivered ✓✓" : "Seen"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {typing && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-2">
                        <div className="h-7 w-7 rounded-full grid place-items-center text-[10px] font-bold shadow bg-indigo-600 text-white">
                          UAI
                        </div>
                        <div className="w-fit max-w-[78%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-sm bg-indigo-600 text-white shadow">
                          <span className="inline-flex gap-1">
                            <span className="h-1.5 w-1.5 bg-white/90 rounded-full animate-bounce [animation-delay:-0.2s]" />
                            <span className="h-1.5 w-1.5 bg-white/90 rounded-full animate-bounce [animation-delay:0s]" />
                            <span className="h-1.5 w-1.5 bg-white/90 rounded-full animate-bounce [animation-delay:0.2s]" />
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
              <div className="sticky bottom-0 z-10 flex-shrink-0 p-3 border-t border-base-200 bg-gray-100 rounded-b-3xl">
                <div className="flex items-end gap-2">
                  <div className="flex items-center bg-white border border-base-200 rounded-lg px-3 py-2 flex-1 shadow-sm">
                    <textarea
                      rows={1}
                      className="flex-1 resize-none bg-transparent outline-none placeholder:text-gray-400 text-sm px-1"
                      placeholder="Say something..."
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
                    className="btn btn-primary btn-circle shadow disabled:opacity-50 self-center"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    aria-label="Send"
                  >
                    <BsSend />
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

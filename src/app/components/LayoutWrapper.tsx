"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TargetCursor from "@/components/TargetCursor";
import Footer from "./Footer";
import SocialBar from "./SocialBar";
import ScrollToTop from "./ScrollToTop";
import dynamic from "next/dynamic";
import RouteCommandPalette from "./RouteCommandPalette";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

const ChatWidget = dynamic(() => import("./chatapp/ChatWidget"), { ssr: false });

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    // Track real visitor telemetry in Ugaas analytics
    if (pathname && !pathname.startsWith("/ugaas")) {
      try {
        fetch("/api/ugaas/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
          }),
        }).catch(() => {});
      } catch {}
    }
  }, [pathname]);

  // Check if current route uses a custom standalone layout (e.g. Studio, Admin /ugaas)
  const isCustomLayout =
    Boolean(pathname &&
    (pathname.startsWith("/studio") ||
      pathname.startsWith("/ugaas") ||
      pathname.startsWith("/admin")));

  return (
    <>
      {mounted && !isCustomLayout && <ChatWidget />}
      {mounted && !isCustomLayout && <ScrollToTop />}
      {mounted && !isCustomLayout && <RouteCommandPalette />}

      <div className="w-full min-h-screen flex flex-col justify-between">
        {!isCustomLayout && <Navbar />}
        {!isCustomLayout && <SocialBar />}

        {/* Main content wrapper */}
        <main className="flex-1 w-full relative">{children}</main>

        {mounted && (
          <TargetCursor
            targetSelector="a, button, .cursor-target"
            spinDuration={2}
            hideDefaultCursor={true}
          />
        )}

        {/* Footer */}
        {!isCustomLayout && <Footer />}

        {/* Toast Notifications */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          theme="colored"
          style={{
            zIndex: 9999,
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </>
  );
};

export default LayoutWrapper;

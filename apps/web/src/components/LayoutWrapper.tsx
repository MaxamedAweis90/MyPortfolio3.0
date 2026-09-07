"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import BreadcrumbHeader from "./BreadcrumbHeader";
import Footer from "./Footer";
import SocialBar from "./SocialBar";
import ScrollToTop from "./ScrollToTop";
import { logPageView } from "@/app/actions/analytics";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

const TargetCursor = dynamic(() => import("./TargetCursor"), { ssr: false });
const RouteCommandPalette = dynamic(() => import("./RouteCommandPalette"), { ssr: false });
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);
const ChatWidget = dynamic(() => import("./chatapp/ChatWidget"), { ssr: false });

interface LayoutWrapperProps {
  children: ReactNode;
  initialSettings?: any;
}

const LayoutWrapper = ({ children, initialSettings }: LayoutWrapperProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    // Track real visitor telemetry in Ugaas analytics via Server Action
    if (pathname && !pathname.startsWith("/ugaas")) {
      const referrer = typeof document !== "undefined" ? document.referrer || "direct" : "direct";
      logPageView(pathname, referrer).catch(() => {});
    }
  }, [pathname]);

  // Check if current route uses a custom standalone layout (e.g. Studio, Admin /ugaas)
  const isCustomLayout =
    Boolean(pathname &&
    (pathname.startsWith("/studio") ||
      pathname.startsWith("/ugaas") ||
      pathname.startsWith("/admin")));

  // Navbar only appears on the main screen (landing page '/')
  const isMainScreen = pathname === "/";

  return (
    <>
      {mounted && !isCustomLayout && <ChatWidget />}
      {mounted && !isCustomLayout && <ScrollToTop />}
      {mounted && !isCustomLayout && <RouteCommandPalette />}

      <div className="w-full min-h-screen flex flex-col justify-between">
        {!isCustomLayout && (
          isMainScreen ? <Navbar /> : <BreadcrumbHeader />
        )}
        {!isCustomLayout && <SocialBar settings={initialSettings} />}

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
        {!isCustomLayout && <Footer settings={initialSettings} />}

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

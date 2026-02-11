"use client"; // This component is client-side

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TargetCursor from "@/components/TargetCursor";
import Footer from "./Footer";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import '../styles/globals.css';

const ChatWidget = dynamic(() => import("./chatapp/ChatWidget"), { ssr: false });

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname(); // Access the current pathname

  // Check if the current pathname starts with '/studio'
  const isStudioPage = pathname && pathname.startsWith("/studio");

  return (
    <>
<ChatWidget />

    <div className="w-full ">
    
  

      {!isStudioPage && <Navbar />}
      {/* Main content */}
      {children}
      
      <TargetCursor
  targetSelector="a, button, .cursor-target"
  spinDuration={2}
  hideDefaultCursor={true}
/>


      
      
      {/* Footer */}
  {!isStudioPage && <Footer />}
      
      {/* Toast Notifications - Positioned on top */}
      <ToastContainer
        position="top-center" // Placing toast at the top-center of the screen
        autoClose={2000}
        hideProgressBar={true}
        theme="colored"
        style={{
          zIndex: 9999, // Ensure it appears on top of everything
          position: 'fixed', // Fix the toast container to the top of the page
          top: '20px', // Distance from the top
          left: '50%', // Center the toast horizontally
          transform: 'translateX(-50%)', // Adjust for perfect centering
        }}
      />
      </div>
    </>
  );
};

export default LayoutWrapper;

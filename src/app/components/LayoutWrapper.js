"use client"; // This component is client-side

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "./Footer";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname(); // Access the current pathname

  // Check if the current pathname starts with '/studio'
  const isStudioPage = pathname && pathname.startsWith("/studio");

  return (
    <>
      {!isStudioPage && <Navbar />}
      {children}
      <CustomCursor />
      {!isStudioPage && <Footer />}
    </>
  );
};

export default LayoutWrapper;

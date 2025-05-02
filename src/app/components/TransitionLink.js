"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { animatedPageOut } from "@/utils/animations";

export default function TransitionLink({ href, label, className, onClick }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e) => {
    e.preventDefault();
    // let parent (like mobile sidebar) close if needed
    if (onClick) onClick();

    // only animate+navigate if we're actually changing routes
    if (pathname !== href) {
      animatedPageOut(href, router);
    }
  };

  
  return (
    <li>
      <a href={href} onClick={handleClick} className={className}>
        {label}
      </a>
    </li>
  );
}

"use client";
import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animatedPageOut } from "@/utils/animations";

type TransitionLinkProps = {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
};

export default function TransitionLink({
  href,
  label,
  className,
  onClick,
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
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

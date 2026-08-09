"use client";
import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

type TransitionLinkProps = {
  href: string;
  label: string;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function TransitionLink({
  href,
  label,
  className,
  isActive,
  onClick,
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick();

    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <li className="relative flex items-center justify-center">
      <a
        href={href}
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      >
        <span className="cursor-pointer">{label}</span>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full bg-brandAccent shadow-[0_0_6px_#0B82EC] block z-20 pointer-events-none" />
        )}
      </a>
    </li>
  );
}

"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RiExternalLinkLine } from "react-icons/ri";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  isStatic?: boolean;
  imageSrc?: string;
};

export const LinkPreview = ({
  children,
  url,
  className,
  width = 300,
  height = 175,
  quality = 85,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  let src = imageSrc;
  if (!isStatic && !imageSrc) {
    const params = new URLSearchParams({
      url,
      screenshot: "true",
      meta: "false",
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": "false",
      "viewport.deviceScaleFactor": "1.5",
      "viewport.width": "1280",
      "viewport.height": "750",
    });
    src = `https://api.microlink.io/?${params.toString()}`;
  }

  // Extract clean domain name for title badge
  let domain = "";
  try {
    domain = new URL(url).hostname.replace("www.", "");
  } catch {
    domain = url;
  }

  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 120, damping: 18 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  return (
    <>
      {isMounted && src ? (
        <span className="hidden" aria-hidden="true">
          <Image
            src={src}
            width={width}
            height={height}
            quality={quality}
            priority={true}
            alt="hidden image"
            unoptimized={true}
          />
        </span>
      ) : null}

      <span
        className="relative inline-block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          className={cn(
            "text-primaryText font-semibold hover:text-brandAccent underline decoration-brandAccent/40 underline-offset-4 hover:decoration-brandAccent transition-all cursor-pointer inline-flex items-center",
            className
          )}
        >
          {children}
        </Link>

        <AnimatePresence>
          {isOpen && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 z-[100] pointer-events-none block">
              <motion.span
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  },
                }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                className="block w-[280px] sm:w-[320px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-2xl"
                style={{
                  x: translateX,
                }}
              >
                <span className="block p-2 bg-surface/98 backdrop-blur-2xl border border-borderSubtle rounded-2xl overflow-hidden shadow-2xl space-y-1.5">
                  {/* Browser Thumbnail Frame */}
                  <span className="relative block w-full h-[155px] sm:h-[175px] overflow-hidden rounded-xl bg-mainBg border border-borderSubtle/50">
                    <Image
                      src={src || imageSrc}
                      fill
                      quality={quality}
                      priority={true}
                      className="object-cover object-top rounded-xl"
                      alt={`${domain} preview`}
                      unoptimized={true}
                    />
                  </span>

                  {/* Clean Domain Footer Pill */}
                  <span className="flex items-center justify-between px-1.5 py-0.5 text-mutedText text-xs font-semibold">
                    <span className="truncate max-w-[200px] text-[11px] text-primaryText">
                      {domain}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-brandAccent font-mono">
                      Visit <RiExternalLinkLine className="text-xs" />
                    </span>
                  </span>
                </span>
              </motion.span>
            </span>
          )}
        </AnimatePresence>
      </span>
    </>
  );
};

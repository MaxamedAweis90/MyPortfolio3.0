"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AdminShell } from "@/components/AdminShell";

const TargetCursor = dynamic(() => import("@/components/TargetCursor"), { ssr: false });

export default function UgaasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/ugaas/login";

  return (
    <>
      <TargetCursor
        targetSelector="a, button, [role='button'], .cursor-target"
        spinDuration={2}
        hideDefaultCursor={true}
      />
      {isLoginPage ? <>{children}</> : <AdminShell>{children}</AdminShell>}
    </>
  );
}


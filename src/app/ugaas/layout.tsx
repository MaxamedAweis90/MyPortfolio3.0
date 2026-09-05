"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminShell } from "./components/AdminShell";

export default function UgaasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/ugaas/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}

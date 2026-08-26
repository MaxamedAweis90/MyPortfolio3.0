"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function InquiriesSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-60 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 sm:w-96 rounded" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      {/* Split-View Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Master List Skeleton (5 cols) */}
        <Card className="lg:col-span-5 h-[720px] bg-surface/90 border-borderSubtle flex flex-col overflow-hidden">
          <div className="p-4 border-b border-borderSubtle space-y-3 shrink-0">
            <Skeleton className="h-9 w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[#0E131D]">
              <Skeleton className="h-7 rounded" />
              <Skeleton className="h-7 rounded" />
              <Skeleton className="h-7 rounded" />
              <Skeleton className="h-7 rounded" />
            </div>
          </div>

          <div className="flex-1 divide-y divide-borderSubtle/50 p-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3 w-4/5 rounded" />
              </div>
            ))}
          </div>
        </Card>

        {/* Right Side: Detail View Skeleton (7 cols) */}
        <Card className="lg:col-span-7 h-[720px] bg-surface/90 border-borderSubtle flex flex-col justify-between overflow-hidden">
          <div className="p-6 border-b border-borderSubtle space-y-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-52 rounded" />
                  <Skeleton className="h-3.5 w-36 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0E131D] border border-borderSubtle">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-4 w-48 rounded col-span-2" />
            </div>
          </div>

          {/* Message Area */}
          <div className="p-6 flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-7 w-20 rounded" />
            </div>
            <div className="p-4 rounded-xl bg-[#0E131D] border border-borderSubtle space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 border-t border-borderSubtle bg-[#111622]/80 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>
        </Card>
      </div>
    </div>
  );
}

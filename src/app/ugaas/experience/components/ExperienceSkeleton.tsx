"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ExperienceSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-64 sm:w-80 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 sm:w-96 rounded" />
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      {/* 2. Segmented 3-Tab Bar Skeleton */}
      <div className="p-1.5 bg-[#111622] rounded-2xl border border-borderSubtle flex items-center gap-2">
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="flex-1 h-12 rounded-xl" />
      </div>

      {/* 3. 3 Rich Timeline Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="bg-surface/90 border-borderSubtle overflow-hidden">
            <div className="p-6 sm:p-7 space-y-4">
              {/* Top Row: Title, Company, Duration, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-6 w-52 rounded" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>

              {/* Highlights Bullet List */}
              <div className="pt-2 border-t border-borderSubtle/60 space-y-2">
                <Skeleton className="h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3.5 w-2/3 rounded" />
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-3 border-t border-borderSubtle/40 flex items-center gap-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

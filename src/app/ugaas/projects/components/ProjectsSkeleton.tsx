"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-56 sm:w-72 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 sm:w-96 rounded" />
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar Skeleton */}
      <Card className="bg-surface/90 border-borderSubtle">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-full md:w-72 rounded-xl" />
        </CardContent>
      </Card>

      {/* 3. DataTable Skeleton */}
      <Card className="overflow-hidden bg-surface/90 border-borderSubtle">
        <div className="divide-y divide-borderSubtle/50">
          {/* Table Header Placeholder */}
          <div className="p-4 bg-[#111622]/80 flex items-center justify-between">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-36 rounded hidden md:block" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* 6 Rows Skeleton */}
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 flex items-center justify-between gap-4 hover:bg-surface/50 transition-colors"
            >
              {/* Thumbnail */}
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />

              {/* Title & Slug */}
              <div className="space-y-1.5 min-w-0 flex-1 max-w-xs">
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>

              {/* Category */}
              <Skeleton className="h-6 w-16 rounded-md shrink-0" />

              {/* Tools Badges */}
              <div className="hidden md:flex items-center gap-1.5 shrink-0 max-w-xs">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>

              {/* Featured Switch */}
              <Skeleton className="h-6 w-11 rounded-full shrink-0" />

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-[#0E131D]/80 border-t border-borderSubtle flex items-center justify-between">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </Card>
    </div>
  );
}

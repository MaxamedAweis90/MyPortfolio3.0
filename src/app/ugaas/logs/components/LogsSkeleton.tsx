import React from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function LogsSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* 2. 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5 bg-surface/90 border-borderSubtle space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-20 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </Card>
        ))}
      </div>

      {/* 3. Filter Bar Skeleton */}
      <Card className="p-4 bg-surface/90 border-borderSubtle flex flex-col md:flex-row items-center justify-between gap-4">
        <Skeleton className="h-9 w-full md:w-80 rounded-xl" />
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg shrink-0" />
          ))}
        </div>
      </Card>

      {/* 4. Logs List Skeleton */}
      <Card className="bg-surface/90 border-borderSubtle divide-y divide-borderSubtle/60 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2.5 flex-1 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
              <Skeleton className="h-5 w-3/4 max-w-lg rounded" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-borderSubtle bg-[#111622]/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-8 w-72 sm:w-96 rounded-lg" />
            <Skeleton className="h-4 w-60 sm:w-80 rounded" />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. Top Analytics & Metrics Skeleton (2x2 Grid + Analysis Chart) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left: 2x2 Metric Cards Skeleton */}
        <div className="xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="bg-surface/80 border-borderSubtle rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2 my-2">
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
              <div className="pt-2 border-t border-borderSubtle/60 flex items-center justify-between">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-3 w-4 rounded" />
              </div>
            </Card>
          ))}
        </div>

        {/* Right: Analysis Chart Skeleton */}
        <Card className="xl:col-span-7 bg-surface/80 border-borderSubtle rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="py-6 flex items-end justify-between gap-3 h-48">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <Skeleton className="w-full max-w-[42px] rounded-t-xl rounded-b-lg" style={{ height: `${25 + (i * 9) % 65}%` }} />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
            <Skeleton className="h-3 w-36 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </Card>
      </div>

      {/* 3. Main Body: Table & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Inquiries Table Skeleton (2 cols) */}
        <Card className="lg:col-span-2 overflow-hidden bg-surface/80 border-borderSubtle">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-borderSubtle">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded" />
              <Skeleton className="h-3.5 w-64 rounded" />
            </div>
            <Skeleton className="h-8 w-32 rounded-lg" />
          </CardHeader>

          {/* Table Rows Skeleton */}
          <div className="divide-y divide-borderSubtle/50 p-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <Skeleton className="h-4 w-36 sm:w-48 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>

                <div className="hidden sm:block space-y-1">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>

                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                <Skeleton className="h-7 w-16 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Quick Action Bar & Database Telemetry Skeleton (1 col) */}
        <div className="space-y-6">
          <Card className="bg-surface/80 border-borderSubtle">
            <CardHeader className="pb-3 border-b border-borderSubtle space-y-1">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-3.5 w-48 rounded" />
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-surface/80 border-borderSubtle">
            <CardHeader className="pb-3 border-b border-borderSubtle flex flex-row items-center justify-between">
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-9 w-full rounded-lg mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

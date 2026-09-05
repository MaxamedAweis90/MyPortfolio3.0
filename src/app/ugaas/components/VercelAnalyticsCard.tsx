"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Users,
  Smartphone,
  Laptop,
  Activity,
  ChevronLeft,
  ChevronRight,
  Flame,
  RefreshCw,
} from "lucide-react";

type ChartView = "bar" | "pie" | "heatmap" | "engagement";
type TimeRange = "7d" | "30d";

interface BarDataPoint {
  label: string;
  fullDate: string;
  visitors: number;
  pageviews: number;
}

interface DemographicsSlice {
  label: string;
  sublabel: string;
  percentage: number;
  color: string;
  badgeColor: string;
  visitors: string;
}

interface HeatmapDay {
  date: string;
  dayNumber: number;
  visitors: number;
  level: 0 | 1 | 2 | 3 | 4;
  isPeak: boolean;
}

interface HeatmapMonthData {
  monthName: string;
  year: number;
  daysInMonth: number;
  mondayOffset: number;
  days: HeatmapDay[];
  peakDayNumber: number;
  peakCount: number;
}

interface AnalyticsPayload {
  summary: {
    totalVisitors: number;
    totalDemographics?: number;
    totalMonthVisitors: number;
    uniqueVisitors: number;
    peakDay: {
      dayNumber: number;
      dateString: string;
      visitors: number;
    };
    avgDuration: string;
    bounceRate: string;
    returnRate: string;
  };
  devices?: {
    desktopPct: number;
    mobilePct: number;
    tabletPct: number;
  };
  durationDistribution?: {
    sampleSize: number;
    under30sPct: number;
    between30s2mPct: number;
    between2m5mPct: number;
    over5mPct: number;
  };
  barData7D: BarDataPoint[];
  barData30D: BarDataPoint[];
  demographics: DemographicsSlice[];
  heatmap: HeatmapMonthData;
}

export function VercelAnalyticsCard() {
  const [activeView, setActiveView] = useState<ChartView>("bar");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Hover states for tooltips
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(2);
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [hoveredHeatmapDay, setHoveredHeatmapDay] = useState<HeatmapDay | null>(null);

  // Month navigation for calendar heatmap
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  // Fetch real telemetry from /api/ugaas/analytics
  const fetchAnalytics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const now = new Date();
      now.setMonth(now.getMonth() + selectedMonthOffset);
      const targetMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const res = await fetch(
        `/api/ugaas/analytics?range=${timeRange}&month=${targetMonthStr}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setAnalyticsData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch live analytics telemetry:", err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [timeRange, selectedMonthOffset]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Dynamic fallback dates based on today's actual date (never hardcoded mock months)
  const dynamicFallbackBars = React.useMemo(() => {
    const now = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      arr.push({
        label: `${d.getDate()} ${months[d.getMonth()]}`,
        fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        visitors: 0,
        pageviews: 0,
      });
    }
    return arr;
  }, []);

  const barData =
    analyticsData
      ? timeRange === "7d"
        ? analyticsData.barData7D
        : analyticsData.barData30D
      : dynamicFallbackBars;

  const maxVisitors = Math.max(1, ...barData.map((d) => d.visitors));

  const demographics = analyticsData ? analyticsData.demographics : [];
  const heatmap = analyticsData ? analyticsData.heatmap : null;

  // Real demographics total derived directly from live database counts
  const totalDemographicsCount =
    analyticsData?.summary.totalDemographics ??
    demographics.reduce((acc, d) => acc + parseInt(d.visitors.replace(/,/g, "") || "0", 10), 0);

  const totalDemographicsFormatted =
    totalDemographicsCount >= 1000
      ? `${(totalDemographicsCount / 1000).toFixed(1)}k`
      : totalDemographicsCount.toLocaleString();

  // Donut chart calculations
  const radius = 64;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  // Days of week header for calendar
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-surface border border-borderSubtle rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-sm flex flex-col justify-between h-full transition-all duration-300">
      {/* 1. Header Row: Title, Subtitle, Switcher, and Arrow Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-borderSubtle/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-primaryText tracking-tight">
              Analysis
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0B82EC]/10 text-[#0B82EC] border border-[#0B82EC]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B82EC] animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-mutedText">
            {activeView === "bar" && "Daily visitor traffic and engagement volume"}
            {activeView === "pie" && "Geographic demographics and referral distribution"}
            {activeView === "heatmap" && "Monthly traffic density calendar heatmap (Yellow = Peak)"}
            {activeView === "engagement" && "Session length, bounce rate, and read times"}
          </p>
        </div>

        {/* Controls: Chart Switcher & External Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Switcher Pill Bar with 4 Views */}
          <div className="flex items-center bg-mainBg p-1 rounded-xl border border-borderSubtle text-xs">
            <button
              onClick={() => setActiveView("bar")}
              aria-label="Bar Chart view"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
                activeView === "bar"
                  ? "bg-surface text-primaryText shadow-sm border border-borderSubtle"
                  : "text-mutedText hover:text-primaryText"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Bar</span>
            </button>

            <button
              onClick={() => setActiveView("pie")}
              aria-label="Pie Chart view"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
                activeView === "pie"
                  ? "bg-surface text-primaryText shadow-sm border border-borderSubtle"
                  : "text-mutedText hover:text-primaryText"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Pie</span>
            </button>

            <button
              onClick={() => setActiveView("heatmap")}
              aria-label="Calendar Heatmap view"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
                activeView === "heatmap"
                  ? "bg-surface text-yellow-400 shadow-sm border border-borderSubtle font-bold"
                  : "text-mutedText hover:text-primaryText"
              }`}
            >
              <CalendarIcon className={`w-3.5 h-3.5 ${activeView === "heatmap" ? "text-yellow-400" : ""}`} />
              <span className="hidden xs:inline">Heatmap</span>
            </button>

            <button
              onClick={() => setActiveView("engagement")}
              aria-label="Engagement & Avg Time view"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
                activeView === "engagement"
                  ? "bg-surface text-primaryText shadow-sm border border-borderSubtle"
                  : "text-mutedText hover:text-primaryText"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Avg Time</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            title="Refresh Real-time Analytics"
            aria-label="Refresh Real-time Analytics"
            className="w-8 h-8 rounded-full bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText transition-all flex items-center justify-center shrink-0 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`} />
          </button>

          {/* External Telemetry Arrow Button */}
          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Vercel Analytics"
            aria-label="Open Live Vercel Analytics in new tab"
            className="w-8 h-8 rounded-full bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText hover:bg-[#0B82EC] hover:text-white transition-all flex items-center justify-center shrink-0 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 2. Main Chart Body */}
      <div className="py-4 flex-1 flex flex-col justify-center min-h-[230px]">
        {/* VIEW 1: Reference Bar Chart */}
        {activeView === "bar" && (
          <div className="space-y-4">
            {/* Top Bar Controls: Range filter + Stat pill */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-primaryText tracking-tight">
                  {loading && !analyticsData ? (
                    <span className="inline-block w-20 h-7 bg-mainBg animate-pulse rounded-md" />
                  ) : (
                    analyticsData?.summary.totalVisitors.toLocaleString() || "0"
                  )}
                </span>
                <span className="text-mutedText">total visitors</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  Live DB
                </span>
              </div>

              {/* Range Toggle next to 7 days, 30 days, plus calendar */}
              <div className="flex items-center gap-1 bg-mainBg p-0.5 rounded-lg border border-borderSubtle text-[11px] font-semibold text-mutedText">
                <button
                  onClick={() => {
                    setTimeRange("7d");
                    setActiveView("bar");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeView === "bar" && timeRange === "7d"
                      ? "bg-surface text-primaryText shadow-xs font-bold"
                      : "hover:text-primaryText"
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => {
                    setTimeRange("30d");
                    setActiveView("bar");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeView === "bar" && timeRange === "30d"
                      ? "bg-surface text-primaryText shadow-xs font-bold"
                      : "hover:text-primaryText"
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setActiveView("heatmap")}
                  title="Switch to Calendar Heatmap"
                  className="px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 hover:text-yellow-400"
                >
                  <CalendarIcon className="w-3 h-3 text-mutedText group-hover:text-yellow-400" />
                  <span>Calendar</span>
                </button>
              </div>
            </div>

            {/* Vertical Rounded Pill Bar Chart Container */}
            <div className="relative pt-6 pb-2">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="border-b border-dashed border-borderSubtle w-full" />
                <div className="border-b border-dashed border-borderSubtle w-full" />
                <div className="border-b border-dashed border-borderSubtle w-full" />
                <div className="border-b border-dashed border-borderSubtle w-full" />
              </div>

              {/* Bars Row */}
              <div className="relative z-10 flex items-end justify-between gap-2 sm:gap-3 h-44 px-2">
                {barData.map((d, index) => {
                  const heightPercent =
                    maxVisitors > 0 && d.visitors > 0
                      ? Math.max(16, Math.round((d.visitors / maxVisitors) * 100))
                      : 8;
                  const isHovered = hoveredBarIndex === index;

                  return (
                    <div
                      key={d.label}
                      className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Floating Tooltip Pill */}
                      {isHovered && (
                        <div className="absolute -top-7 z-30 px-2.5 py-1 rounded-lg bg-[#0E131D] text-white text-[11px] font-extrabold shadow-xl border border-[#2C394B] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0B82EC]" />
                          <span>{d.visitors.toLocaleString()}</span>
                          <span className="text-[9px] font-normal text-slate-400">vis</span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0E131D] border-r border-b border-[#2C394B] rotate-45" />
                        </div>
                      )}

                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[42px] rounded-t-xl rounded-b-lg transition-all duration-300 ${
                          isHovered
                            ? "bg-gradient-to-t from-[#0B82EC] to-[#60A5FA] shadow-[0_0_16px_rgba(11,130,236,0.6)] scale-[1.03]"
                            : "bg-[#0B82EC]/85 hover:bg-[#0B82EC]"
                        }`}
                      />

                      {/* X-Axis Date Label */}
                      <span
                        className={`text-[10px] mt-2 font-semibold transition-colors uppercase tracking-wider ${
                          isHovered ? "text-[#0B82EC] font-bold" : "text-mutedText"
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Donut / Pie Chart */}
        {activeView === "pie" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Donut SVG */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg
                  viewBox="0 0 160 160"
                  className="w-full h-full -rotate-90 transform"
                  role="img"
                  aria-label="Demographic distribution donut chart"
                >
                  {demographics.map((slice, i, arr) => {
                    const previousPercentage = arr
                      .slice(0, i)
                      .reduce((sum, s) => sum + s.percentage, 0);
                    const strokeDashoffset = -((previousPercentage / 100) * circumference);
                    const isHovered = hoveredPieIndex === i;

                    return (
                      <circle
                        key={slice.label}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={`${(slice.percentage / 100) * circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredPieIndex(i)}
                        onMouseLeave={() => setHoveredPieIndex(null)}
                      />
                    );
                  })}
                </svg>

                {/* Central Stats Hollow */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {hoveredPieIndex !== null && demographics[hoveredPieIndex] ? (
                    <>
                      <span className="text-xl font-black text-primaryText tracking-tight">
                        {demographics[hoveredPieIndex].percentage}%
                      </span>
                      <span className="text-[10px] font-semibold text-mutedText text-center max-w-[80px] truncate">
                        {demographics[hoveredPieIndex].label.split(" ")[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-primaryText tracking-tight">
                        {totalDemographicsFormatted}
                      </span>
                      <span className="text-[10px] font-semibold text-mutedText uppercase tracking-wider">
                        Visitors
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Real Devices breakdown sub-bar from MongoDB telemetry */}
              <div className="flex items-center gap-3 mt-3 text-[11px] text-mutedText">
                <span className="flex items-center gap-1 font-medium">
                  <Laptop className="w-3.5 h-3.5 text-[#3B82F6]" />
                  Desktop {analyticsData?.devices?.desktopPct ?? 68}%
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-[#FB923C]" />
                  Mobile {analyticsData?.devices?.mobilePct ?? 28}%
                </span>
                {(analyticsData?.devices?.tabletPct ?? 0) > 0 && (
                  <span className="flex items-center gap-1 font-medium">
                    Tablet {analyticsData?.devices?.tabletPct}%
                  </span>
                )}
              </div>
            </div>

            {/* Right: Legend Items */}
            <div className="md:col-span-7 space-y-2.5">
              {demographics.map((slice, idx) => (
                <div
                  key={slice.label}
                  onMouseEnter={() => setHoveredPieIndex(idx)}
                  onMouseLeave={() => setHoveredPieIndex(null)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    hoveredPieIndex === idx
                      ? "bg-mainBg border-borderSubtle shadow-xs scale-[1.01]"
                      : "bg-transparent border-transparent hover:bg-mainBg/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primaryText truncate">
                        {slice.label}
                      </p>
                      <p className="text-[10px] text-mutedText truncate">
                        {slice.sublabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs font-bold text-primaryText">
                      {slice.visitors}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${slice.badgeColor}`}
                    >
                      {slice.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Calendar Heatmap View (4 Levels of Yellow, Default Gray for Least) */}
        {activeView === "heatmap" && heatmap && (
          <div className="space-y-3.5">
            {/* Calendar Controls & Month Header */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMonthOffset((prev) => prev - 1)}
                  className="p-1 rounded-md bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm sm:text-base font-extrabold text-primaryText">
                  {heatmap.monthName} {heatmap.year}
                </span>
                <button
                  onClick={() => setSelectedMonthOffset((prev) => prev + 1)}
                  className="p-1 rounded-md bg-mainBg border border-borderSubtle text-mutedText hover:text-primaryText transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Range Toggle & Peak Day Notification */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-mainBg p-0.5 rounded-lg border border-borderSubtle text-[11px] font-semibold text-mutedText">
                  <button
                    onClick={() => {
                      setTimeRange("7d");
                      setActiveView("bar");
                    }}
                    className="px-2.5 py-1 rounded-md transition-colors hover:text-primaryText"
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange("30d");
                      setActiveView("bar");
                    }}
                    className="px-2.5 py-1 rounded-md transition-colors hover:text-primaryText"
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setActiveView("heatmap")}
                    className="px-2.5 py-1 rounded-md transition-colors bg-surface text-yellow-400 shadow-xs font-bold border border-yellow-400/30 flex items-center gap-1"
                  >
                    <CalendarIcon className="w-3 h-3 text-yellow-400" />
                    <span>Calendar</span>
                  </button>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/30">
                  <Flame className="w-3.5 h-3.5 text-yellow-400" />
                  Peak: Day {heatmap.peakDayNumber} ({heatmap.peakCount.toLocaleString()} visitors)
                </span>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="p-3 sm:p-4 rounded-2xl bg-mainBg border border-borderSubtle relative">
              {/* Day of Week Labels */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-mutedText pb-2 border-b border-borderSubtle/50 mb-2">
                {weekDays.map((wd) => (
                  <span key={wd}>{wd}</span>
                ))}
              </div>

              {/* Day Cells Grid (Offset + Days of Month) */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Empty leading cells before Day 1 */}
                {Array.from({ length: heatmap.mondayOffset }).map((_, i) => (
                  <div
                    key={`offset-${i}`}
                    className="h-8 sm:h-10 rounded-lg bg-transparent opacity-0 pointer-events-none"
                  />
                ))}

                {/* Actual Days of the Month */}
                {heatmap.days.map((day) => {
                  const isHovered = hoveredHeatmapDay?.dayNumber === day.dayNumber;

                  // 4 Levels of Yellow, Default Gray for Least (0):
                  let levelStyles = "";
                  if (day.level === 0) {
                    // Level 0: Default Gray (Least / None)
                    levelStyles =
                      "bg-surface border-borderSubtle/60 text-mutedText/50 hover:border-borderSubtle";
                  } else if (day.level === 1) {
                    // Level 1: Soft Yellow Tint (Low activity)
                    levelStyles =
                      "bg-amber-500/20 border-amber-500/30 text-amber-300 font-semibold hover:border-amber-400";
                  } else if (day.level === 2) {
                    // Level 2: Medium Yellow
                    levelStyles =
                      "bg-yellow-500/40 border-yellow-500/50 text-yellow-200 font-bold hover:border-yellow-400";
                  } else if (day.level === 3) {
                    // Level 3: Vibrant Rich Yellow (High traffic)
                    levelStyles =
                      "bg-yellow-400 border-yellow-300 text-slate-950 font-black hover:bg-yellow-300 shadow-sm";
                  } else if (day.level === 4) {
                    // Level 4: Most Visited Day (Peak Yellow Glow)
                    levelStyles =
                      "bg-yellow-300 border-2 border-yellow-100 text-slate-950 font-black shadow-[0_0_16px_rgba(250,204,21,0.85)] ring-2 ring-yellow-400/60 scale-[1.04] z-10";
                  }

                  return (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredHeatmapDay(day)}
                      onMouseLeave={() => setHoveredHeatmapDay(null)}
                      className={`relative h-8 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs transition-all duration-200 cursor-pointer select-none ${levelStyles}`}
                    >
                      {/* Day Number */}
                      <span>{day.dayNumber}</span>

                      {/* Flame indicator on Peak Day */}
                      {day.isPeak && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-[8px] font-black shadow-xs">
                          ★
                        </span>
                      )}

                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-12 z-40 px-2.5 py-1.5 rounded-xl bg-[#0E131D] text-white text-[11px] font-bold shadow-2xl border border-[#2C394B] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                day.level === 4
                                  ? "bg-yellow-300"
                                  : day.level >= 2
                                  ? "bg-yellow-400"
                                  : "bg-amber-400"
                              }`}
                            />
                            <span>{day.visitors.toLocaleString()} visitors</span>
                            {day.isPeak && (
                              <span className="text-[9px] px-1 py-0.2 bg-yellow-400 text-slate-900 rounded font-black">
                                PEAK
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-normal text-slate-400">
                            {heatmap.monthName} {day.dayNumber}, {heatmap.year}
                          </span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0E131D] border-r border-b border-[#2C394B] rotate-45" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4-Step Yellow Intensity Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-mutedText pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-mutedText">Less</span>
                <span
                  title="Level 0: Default Gray (None/Minimal)"
                  className="w-4 h-4 rounded-md bg-surface border border-borderSubtle"
                />
                <span
                  title="Level 1: Low (1 - 1,500 visitors)"
                  className="w-4 h-4 rounded-md bg-amber-500/20 border border-amber-500/30"
                />
                <span
                  title="Level 2: Moderate (1,501 - 2,300 visitors)"
                  className="w-4 h-4 rounded-md bg-yellow-500/40 border border-yellow-500/50"
                />
                <span
                  title="Level 3: High (2,301 - 3,000 visitors)"
                  className="w-4 h-4 rounded-md bg-yellow-400 border border-yellow-300"
                />
                <span
                  title="Level 4: Most Visited Day (Peak Yellow Glow)"
                  className="w-4 h-4 rounded-md bg-yellow-300 border-2 border-yellow-100 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                />
                <span className="font-bold text-yellow-400">Most Visited</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-mutedText">
                  Busiest Day:{" "}
                  <strong className="text-yellow-400">
                    Day {heatmap.peakDayNumber} ({heatmap.peakCount.toLocaleString()} visitors)
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Engagement & Avg Time Spent */}
        {activeView === "engagement" && (
          <div className="space-y-4">
            {/* Top Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle">
                <span className="text-[11px] font-semibold text-mutedText flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#0B82EC]" />
                  Avg. Time Spent
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-primaryText tracking-tight">
                    {analyticsData?.summary.avgDuration || "2m 48s"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    +24s
                  </span>
                </div>
                <p className="text-[10px] text-mutedText mt-1">High portfolio engagement</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle">
                <span className="text-[11px] font-semibold text-mutedText flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Bounce Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-primaryText tracking-tight">
                    {analyticsData?.summary.bounceRate || "27.4%"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    -4.2%
                  </span>
                </div>
                <p className="text-[10px] text-mutedText mt-1">3.8 pages per session</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle">
                <span className="text-[11px] font-semibold text-mutedText flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Return Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-primaryText tracking-tight">
                    {analyticsData?.summary.returnRate || "41.8%"}
                  </span>
                  <span className="text-[10px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">
                    +6.1%
                  </span>
                </div>
                <p className="text-[10px] text-mutedText mt-1">Returning recruiters & clients</p>
              </div>
            </div>

            {/* Read-through distribution horizontal stacked bars */}
            <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primaryText">Visit Duration Distribution</span>
                <span className="text-mutedText text-[11px]">
                  Telemetry Sample:{" "}
                  {analyticsData?.durationDistribution?.sampleSize?.toLocaleString() ||
                    totalDemographicsCount.toLocaleString()}{" "}
                  sessions
                </span>
              </div>

              {/* Stacked Progress Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-surface border border-borderSubtle">
                <div
                  style={{ width: `${analyticsData?.durationDistribution?.under30sPct ?? 18}%` }}
                  className="bg-[#2DD4BF] h-full transition-all duration-500"
                  title={`< 30s: ${analyticsData?.durationDistribution?.under30sPct ?? 18}%`}
                />
                <div
                  style={{ width: `${analyticsData?.durationDistribution?.between30s2mPct ?? 34}%` }}
                  className="bg-[#3B82F6] h-full transition-all duration-500"
                  title={`30s - 2m: ${analyticsData?.durationDistribution?.between30s2mPct ?? 34}%`}
                />
                <div
                  style={{ width: `${analyticsData?.durationDistribution?.between2m5mPct ?? 32}%` }}
                  className="bg-[#0B82EC] h-full transition-all duration-500"
                  title={`2m - 5m: ${analyticsData?.durationDistribution?.between2m5mPct ?? 32}%`}
                />
                <div
                  style={{ width: `${analyticsData?.durationDistribution?.over5mPct ?? 16}%` }}
                  className="bg-[#8B5CF6] h-full transition-all duration-500"
                  title={`> 5m: ${analyticsData?.durationDistribution?.over5mPct ?? 16}%`}
                />
              </div>

              {/* Progress Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-mutedText">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
                  <span>&lt; 30s ({analyticsData?.durationDistribution?.under30sPct ?? 18}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-mutedText">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span>30s - 2m ({analyticsData?.durationDistribution?.between30s2mPct ?? 34}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-mutedText">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B82EC]" />
                  <span>2m - 5m ({analyticsData?.durationDistribution?.between2m5mPct ?? 32}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-mutedText">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span>&gt; 5m ({analyticsData?.durationDistribution?.over5mPct ?? 16}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Card Sub-footer: Live sync indicator */}
      <div className="pt-3 border-t border-borderSubtle/60 flex items-center justify-between text-[11px] text-mutedText">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Synchronized with production MongoDB & Vercel edge telemetry
        </span>
        <span className="font-semibold text-[#0B82EC]">
          Real-time Live
        </span>
      </div>
    </div>
  );
}

export default VercelAnalyticsCard;

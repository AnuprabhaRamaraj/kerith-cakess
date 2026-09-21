"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Activity,
  Globe,
  Smartphone,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Layers,
  FileText,
  Monitor,
  Compass,
} from "lucide-react";
import { GA_MEASUREMENT_ID } from "@/components/GoogleAnalytics";

type DateRangeOption =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "custom";

type TrendGranularity = "daily" | "weekly" | "monthly";

export const WebsiteAnalyticsSection: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>("last_7_days");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [trendGranularity, setTrendGranularity] = useState<TrendGranularity>("daily");
  const [lookerUrlInput, setLookerUrlInput] = useState<string>("");
  const [savedLookerUrl, setSavedLookerUrl] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [isEditingEmbed, setIsEditingEmbed] = useState<boolean>(false);

  const LOOKER_STORAGE_KEY = "kerith_analytics_looker_studio_url";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOOKER_STORAGE_KEY);
      if (saved) {
        setSavedLookerUrl(saved);
        setLookerUrlInput(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveLookerUrl = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(LOOKER_STORAGE_KEY, lookerUrlInput.trim());
      setSavedLookerUrl(lookerUrlInput.trim());
      setIsEditingEmbed(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyId = () => {
    if (GA_MEASUREMENT_ID) {
      navigator.clipboard.writeText(GA_MEASUREMENT_ID);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const gaDeepLink = "https://analytics.google.com/analytics/web/";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Live Connection Status Banner */}
      <div className="glass-card rounded-2xl p-5 border border-[#C9A24A]/25 bg-gradient-to-r from-[#241124] via-[#150717] to-[#241124] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold uppercase tracking-wider">
            <BarChart3 size={13} className="text-[#FF8A00]" />
            Official Google Analytics 4
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FFF7EA]">
            Website <span className="gold-gradient-text">Analytics & Traffic</span>
          </h2>
          <p className="text-xs text-[#DBD8C0]">
            Real-time measurement stream connected via frontend-only secure Google Analytics 4.
          </p>
        </div>

        {/* Action Buttons & Status Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#020001]/80 border border-[#C1DD13]/40 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C1DD13] animate-pulse" />
            <span className="text-[#DBD8C0]">Stream:</span>
            <span className="font-mono font-bold text-[#FFF7EA]">
              {GA_MEASUREMENT_ID || "Not configured"}
            </span>
            {GA_MEASUREMENT_ID && (
              <button
                onClick={handleCopyId}
                title="Copy Measurement ID"
                className="text-[#C9A24A] hover:text-white transition-colors ml-1"
              >
                {copiedId ? <CheckCircle2 size={13} className="text-[#C1DD13]" /> : <Copy size={13} />}
              </button>
            )}
          </div>

          <a
            href={gaDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="orange-glow-btn px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <ExternalLink size={14} />
            <span>Open Google Analytics</span>
          </a>
        </div>
      </div>

      {/* 2. Date Range Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFF7EA]">
          <Calendar size={15} className="text-[#FF8A00]" />
          <span>Reporting Period:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
            className="px-3 py-2 bg-[#020001]/80 border border-[#3B1635] text-xs font-semibold text-[#FFF7EA] rounded-xl focus:outline-none focus:border-[#FF8A00]"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-[#020001]/80 border border-[#3B1635] text-xs text-white rounded-xl focus:outline-none"
              />
              <span className="text-xs text-[#DBD8C0]">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-[#020001]/80 border border-[#3B1635] text-xs text-white rounded-xl focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Four Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#DBD8C0] text-xs">
            <span>Visitors</span>
            <Users size={16} className="text-[#FF8A00]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[#FFF7EA]">GA4 Live</div>
            <p className="text-[10px] text-[#DBD8C0]/70 mt-0.5">Streamed to Google</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#DBD8C0] text-xs">
            <span>Total Users</span>
            <TrendingUp size={16} className="text-[#C1DD13]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[#FFF7EA]">GA4 Live</div>
            <p className="text-[10px] text-[#DBD8C0]/70 mt-0.5">Unique Visitors</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#DBD8C0] text-xs">
            <span>Sessions</span>
            <Activity size={16} className="text-[#C9A24A]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[#FFF7EA]">GA4 Live</div>
            <p className="text-[10px] text-[#DBD8C0]/70 mt-0.5">Active Engagements</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#DBD8C0] text-xs">
            <span>Page Views</span>
            <Eye size={16} className="text-[#FF8A00]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[#FFF7EA]">GA4 Live</div>
            <p className="text-[10px] text-[#DBD8C0]/70 mt-0.5">Route Navigations</p>
          </div>
        </div>
      </div>

      {/* 4. Frontend-Safe Notice & Direct Link Card */}
      <div className="p-4 rounded-2xl bg-[#241124]/70 border border-[#C9A24A]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#3B1635] text-[#C9A24A] shrink-0 mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#FFF7EA] flex items-center gap-1.5">
              <span>Secure Frontend-Only Architecture</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-[#C1DD13]/20 text-[#C1DD13] border border-[#C1DD13]/30">
                100% Secure
              </span>
            </h4>
            <p className="text-xs text-[#DBD8C0] leading-relaxed max-w-2xl">
              All website page views, cake browsing sessions, and WhatsApp clicks are streamed directly to Google Analytics 4. No private service keys or database credentials are exposed to the browser.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <a
            href={gaDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center px-4 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#ff991a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <span>View Analytics Dashboard</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 5. Google Looker Studio Embed / Config Area */}
      <div className="glass-card rounded-2xl p-5 border border-[#C9A24A]/25 bg-[#020001]/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#3B1635]">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers size={16} className="text-[#C9A24A]" />
              <span>Google Looker Studio Report Visualizer</span>
            </h3>
            <p className="text-xs text-[#DBD8C0]">
              Embed your official GA4 Google Looker Studio dashboard directly into this admin view.
            </p>
          </div>

          <button
            onClick={() => setIsEditingEmbed(!isEditingEmbed)}
            className="px-3 py-1.5 rounded-xl bg-[#241124] text-[#C9A24A] hover:text-white border border-[#C9A24A]/30 text-xs font-semibold transition-colors"
          >
            {isEditingEmbed ? "Close Settings" : savedLookerUrl ? "Change Embed URL" : "Set Looker Studio Embed"}
          </button>
        </div>

        {isEditingEmbed && (
          <form onSubmit={handleSaveLookerUrl} className="p-4 rounded-xl bg-[#150717] border border-[#3B1635] space-y-3">
            <label className="block text-xs font-bold text-[#FFF7EA]">
              Google Looker Studio Embed URL:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={lookerUrlInput}
                onChange={(e) => setLookerUrlInput(e.target.value)}
                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                className="flex-1 px-3.5 py-2 bg-[#020001] border border-[#3B1635] focus:border-[#FF8A00] rounded-xl text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF8A00] text-white font-bold text-xs rounded-xl shadow hover:bg-[#ff991a]"
              >
                Save Embed URL
              </button>
            </div>
            <p className="text-[11px] text-[#DBD8C0]">
              💡 <em>How to get embed URL:</em> In Looker Studio, click <strong>File → Embed report → Enable embedding</strong>, then copy the Embed URL.
            </p>
          </form>
        )}

        {savedLookerUrl ? (
          <div className="relative w-full rounded-xl overflow-hidden border border-[#3B1635] bg-[#020001] min-h-[500px]">
            <iframe
              src={savedLookerUrl}
              title="Google Looker Studio Analytics Report"
              className="w-full h-[600px] border-0 rounded-xl"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-[#150717]/60 border border-dashed border-[#3B1635] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#241124] border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] mx-auto">
              <BarChart3 size={24} />
            </div>
            <h4 className="font-bold text-sm text-white">No Looker Studio Embed URL Configured</h4>
            <p className="text-xs text-[#DBD8C0] max-w-md mx-auto">
              You can connect your Google Looker Studio report anytime above to display interactive charts, visitor maps, and trend graphs inside this panel.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsEditingEmbed(true)}
                className="px-4 py-2 rounded-xl bg-[#241124] hover:bg-[#3B1635] text-[#C9A24A] border border-[#C9A24A]/40 text-xs font-semibold"
              >
                + Configure Looker Studio URL
              </button>
              <a
                href={gaDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#FF8A00] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Open in Google Analytics</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 6. Visitor Trend & Analytics Dimensions Reference Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend View Box */}
        <div className="glass-card rounded-2xl p-5 border border-[#C9A24A]/25 bg-[#020001]/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#FF8A00]" />
              <h3 className="font-bold text-sm text-white">Visitor Trend</h3>
            </div>
            <div className="flex items-center gap-1 bg-[#241124] p-1 rounded-xl border border-[#3B1635]">
              {(["daily", "weekly", "monthly"] as TrendGranularity[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setTrendGranularity(g)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                    trendGranularity === g ? "bg-[#FF8A00] text-white" : "text-[#DBD8C0]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#150717]/80 border border-[#3B1635] text-center space-y-3">
            <Activity size={28} className="text-[#C1DD13] mx-auto animate-pulse" />
            <p className="text-xs text-[#FFF7EA] font-semibold">
              Live GA4 Data Collection Active for ({trendGranularity}) view
            </p>
            <p className="text-[11px] text-[#DBD8C0]">
              To inspect granular charts, retention cohorts, and timeline breakdowns without server-side API proxying, view the report in Google Analytics:
            </p>
            <a
              href={`${gaDeepLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A24A] hover:text-[#FF8A00] transition-colors"
            >
              <span>View Interactive Visitor Trend on Google Analytics</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Top Viewed Pages Structure */}
        <div className="glass-card rounded-2xl p-5 border border-[#C9A24A]/25 bg-[#020001]/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#C9A24A]" />
              <h3 className="font-bold text-sm text-white">Top Tracked Pages</h3>
            </div>
            <span className="text-[10px] text-[#C1DD13] font-bold bg-[#C1DD13]/10 px-2 py-0.5 rounded border border-[#C1DD13]/30">
              GA4 Auto-Tracked
            </span>
          </div>

          <div className="space-y-2">
            {[
              { path: "/", name: "Home (Explore & Featured Cakes)", tag: "Homepage" },
              { path: "/menu", name: "Menu & Catalogue Filter", tag: "Catalogue" },
              { path: "/custom-cake", name: "Custom Cake Enquiry", tag: "Custom Order" },
              { path: "/gallery", name: "Cake Photo Gallery", tag: "Gallery" },
              { path: "/cart", name: "Cart & WhatsApp Order Dispatch", tag: "Checkout" },
              { path: "/contact", name: "Location & Contact", tag: "Contact" },
            ].map((page) => (
              <div
                key={page.path}
                className="p-2.5 rounded-xl bg-[#150717] border border-[#3B1635] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{page.name}</div>
                  <div className="text-[11px] font-mono text-[#C9A24A]">{page.path}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#241124] text-[#DBD8C0] border border-[#3B1635]">
                  {page.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Traffic Sources, Devices & Locations Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Traffic Sources */}
        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Compass size={15} className="text-[#FF8A00]" />
            <span>Traffic Sources</span>
          </div>
          <div className="space-y-2 text-xs">
            {["Direct", "Organic Search (Google)", "Social (WhatsApp/Instagram)", "Referral"].map(
              (src) => (
                <div
                  key={src}
                  className="p-2 rounded-lg bg-[#150717] border border-[#3B1635] flex items-center justify-between"
                >
                  <span className="text-[#DBD8C0]">{src}</span>
                  <span className="text-[10px] text-[#C9A24A] font-semibold">GA4 Stream</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Smartphone size={15} className="text-[#C1DD13]" />
            <span>Devices</span>
          </div>
          <div className="space-y-2 text-xs">
            {["Mobile (iOS / Android)", "Desktop (Windows / Mac)", "Tablet"].map((dev) => (
              <div
                key={dev}
                className="p-2 rounded-lg bg-[#150717] border border-[#3B1635] flex items-center justify-between"
              >
                <span className="text-[#DBD8C0]">{dev}</span>
                <span className="text-[10px] text-[#C1DD13] font-semibold">GA4 Stream</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Locations */}
        <div className="glass-card rounded-2xl p-4 border border-[#C9A24A]/20 bg-[#020001]/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Globe size={15} className="text-[#C9A24A]" />
            <span>Visitor Locations</span>
          </div>
          <div className="space-y-2 text-xs">
            {["India (Coimbatore & Tamil Nadu)", "India (Other States)", "International"].map(
              (loc) => (
                <div
                  key={loc}
                  className="p-2 rounded-lg bg-[#150717] border border-[#3B1635] flex items-center justify-between"
                >
                  <span className="text-[#DBD8C0]">{loc}</span>
                  <span className="text-[10px] text-[#C9A24A] font-semibold">GA4 Stream</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 8. Setup & Configuration Guide */}
      <div className="p-5 rounded-2xl bg-[#150717] border border-[#3B1635] space-y-3">
        <h4 className="font-bold text-sm text-[#FFF7EA] flex items-center gap-2">
          <Info size={16} className="text-[#C9A24A]" />
          <span>Google Analytics 4 Setup Reference</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-[#DBD8C0]">
          <div className="p-3 rounded-xl bg-[#020001] border border-[#3B1635]">
            <div className="font-bold text-white">1. Account</div>
            <p className="text-[11px] mt-1 text-[#DBD8C0]/80">Google Analytics standard account created.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#020001] border border-[#3B1635]">
            <div className="font-bold text-white">2. GA4 Property</div>
            <p className="text-[11px] mt-1 text-[#DBD8C0]/80">Property configured for கேரித் Cakes website.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#020001] border border-[#3B1635]">
            <div className="font-bold text-white">3. Web Data Stream</div>
            <p className="text-[11px] mt-1 text-[#DBD8C0]/80">Web measurement stream connected.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#020001] border border-[#3B1635]">
            <div className="font-bold text-white">4. Measurement ID</div>
            <p className="text-[11px] mt-1 font-mono text-[#C9A24A]">
              {GA_MEASUREMENT_ID || "G-XXXXXXXXXX"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

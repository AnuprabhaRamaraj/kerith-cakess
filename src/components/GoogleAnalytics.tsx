"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

// Safe reading from environment variables
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.VITE_GA_MEASUREMENT_ID ||
  "";

// Declare gtag function on window for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Custom event helper for frontend tracking
export const trackGAEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
    window.gtag("event", eventName, params);
  }
};

function AnalyticsPageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Send pageview to GA4 on route change
    window.gtag("config", measurementId, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}

export function GoogleAnalytics({
  measurementId = GA_MEASUREMENT_ID,
}: {
  measurementId?: string;
}) {
  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics 4 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
      {/* Route Change Tracker for Next.js App Router SPA Navigation */}
      <Suspense fallback={null}>
        <AnalyticsPageViewTracker measurementId={measurementId} />
      </Suspense>
    </>
  );
}

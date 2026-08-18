"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getAnalyticsVisitorId } from "@/lib/client-analytics";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.doNotTrack === "1") return;

    const visitorId = getAnalyticsVisitorId();
    if (!visitorId) return;

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
        visitorId,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}

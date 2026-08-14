"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.doNotTrack === "1") return;

    const key = "kobbyops_visitor";
    let visitorId = window.localStorage.getItem(key);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      window.localStorage.setItem(key, visitorId);
    }

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

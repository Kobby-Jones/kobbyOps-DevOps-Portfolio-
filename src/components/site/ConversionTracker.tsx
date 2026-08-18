"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsMetadata,
} from "@/lib/client-analytics";

export default function ConversionTracker({
  eventName,
  label,
  metadata,
}: {
  eventName: AnalyticsEventName;
  label?: string;
  metadata?: AnalyticsMetadata;
}) {
  const pathname = usePathname();
  const serializedMetadata = JSON.stringify(metadata || {});

  useEffect(() => {
    trackAnalyticsEvent(eventName, {
      path: pathname,
      label,
      metadata: JSON.parse(serializedMetadata) as AnalyticsMetadata,
    });
  }, [eventName, label, pathname, serializedMetadata]);

  return null;
}

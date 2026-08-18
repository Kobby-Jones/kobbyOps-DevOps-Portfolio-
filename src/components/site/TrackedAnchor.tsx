"use client";

import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsMetadata,
} from "@/lib/client-analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  analyticsLabel: string;
  analyticsMetadata?: AnalyticsMetadata;
};

export default function TrackedAnchor({
  analyticsLabel,
  analyticsMetadata,
  href,
  ...props
}: Props) {
  const pathname = usePathname();

  return (
    <a
      {...props}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("cta_click", {
          path: pathname,
          label: analyticsLabel,
          metadata: {
            destination: href || "",
            ...(analyticsMetadata || {}),
          },
        });
      }}
    />
  );
}

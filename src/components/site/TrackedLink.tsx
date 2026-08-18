"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsMetadata,
} from "@/lib/client-analytics";

type Props = Omit<ComponentProps<typeof Link>, "onClick"> & {
  analyticsLabel: string;
  analyticsMetadata?: AnalyticsMetadata;
};

export default function TrackedLink({
  analyticsLabel,
  analyticsMetadata,
  href,
  ...props
}: Props) {
  const pathname = usePathname();
  const destination = typeof href === "string" ? href : href.pathname || "";

  return (
    <Link
      {...props}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("cta_click", {
          path: pathname,
          label: analyticsLabel,
          metadata: {
            destination,
            ...(analyticsMetadata || {}),
          },
        });
      }}
    />
  );
}

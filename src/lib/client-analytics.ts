export type AnalyticsEventName = "service_view" | "cta_click" | "checkout_initiated";
export type AnalyticsMetadata = Record<string, string | number | boolean | null>;

const VISITOR_KEY = "kobbyops_visitor";

export function getAnalyticsVisitorId() {
  if (typeof window === "undefined") return "";

  let visitorId = window.localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  options: {
    path?: string;
    label?: string;
    metadata?: AnalyticsMetadata;
  } = {},
) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;

  const visitorId = getAnalyticsVisitorId();
  if (!visitorId) return;

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      path: options.path || window.location.pathname,
      label: options.label,
      metadata: options.metadata || {},
      referrer: document.referrer,
      visitorId,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

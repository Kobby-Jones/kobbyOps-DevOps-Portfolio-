import { headers } from "next/headers";

export type VisitorPricingContext = {
  countryCode?: string;
  prefersUsd: boolean;
  ghsToUsdRate?: number;
};

export type ResourcePricePresentation = {
  primary: string;
  currencyLabel: string;
  note?: string;
  approximate: boolean;
};

const GHANA_COUNTRY_CODE = "GH";
const RATE_CACHE_SECONDS = 60 * 60 * 24;

function positiveNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

async function fetchGhsToUsdRate() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY?.trim();
  if (apiKey) {
    try {
      const response = await fetch("https://v6.exchangerate-api.com/v6/latest/GHS", {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: RATE_CACHE_SECONDS },
      });

      if (response.ok) {
        const payload = (await response.json()) as {
          result?: string;
          conversion_rates?: Record<string, number>;
        };
        const rate = Number(payload.conversion_rates?.USD);
        if (payload.result === "success" && Number.isFinite(rate) && rate > 0) {
          return rate;
        }
      }
    } catch {
      // Currency conversion is presentation-only. Canonical GHS pricing remains available.
    }
  }

  return positiveNumber(process.env.GHS_TO_USD_DISPLAY_RATE);
}

export async function getVisitorPricingContext(): Promise<VisitorPricingContext> {
  const requestHeaders = await headers();
  const countryCode = requestHeaders.get("x-vercel-ip-country")?.trim().toUpperCase() || undefined;
  const prefersUsd = Boolean(countryCode && countryCode !== GHANA_COUNTRY_CODE);

  return {
    countryCode,
    prefersUsd,
    ghsToUsdRate: prefersUsd ? await fetchGhsToUsdRate() : undefined,
  };
}

function formatGhs(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    currencyDisplay: "code",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatOtherCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function presentResourcePrice(
  amount: number,
  currency: string,
  context: VisitorPricingContext,
): ResourcePricePresentation {
  const normalizedCurrency = currency.trim().toUpperCase() || "GHS";

  if (normalizedCurrency === "GHS") {
    if (context.prefersUsd && context.ghsToUsdRate) {
      return {
        primary: formatUsd(amount * context.ghsToUsdRate),
        currencyLabel: "Approx. USD",
        note: `${formatGhs(amount)} charged at checkout`,
        approximate: true,
      };
    }

    return {
      primary: formatGhs(amount),
      currencyLabel: "Price",
      approximate: false,
    };
  }

  if (normalizedCurrency === "USD") {
    return {
      primary: formatUsd(amount),
      currencyLabel: "Price",
      approximate: false,
    };
  }

  return {
    primary: formatOtherCurrency(amount, normalizedCurrency),
    currencyLabel: "Price",
    approximate: false,
  };
}

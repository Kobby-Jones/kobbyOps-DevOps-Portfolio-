# International Resource Price Display

The storefront keeps the database/resource currency as the canonical checkout currency. For a Ghana-based Paystack setup, keep paid products priced in `GHS`.

For visitors whose Vercel request country is not `GH`, the resource listing and product page can show an approximate USD display price while checkout continues to charge the original GHS amount.

## Recommended setup

1. Create a free ExchangeRate-API account.
2. Add the API key locally and in Vercel Production/Preview as needed:

```env
EXCHANGE_RATE_API_KEY=your_key_here
```

The key is server-only. The application requests the latest `GHS -> USD` rate and lets Next.js cache that response for one day.

## Optional manual fallback

If you do not want to use the API yet, set the USD value of one GHS manually:

```env
GHS_TO_USD_DISPLAY_RATE=0.08
```

This is only a display fallback. Update it yourself when needed.

## Behaviour

- Visitor country `GH`: show canonical GHS price.
- Visitor country outside `GH` and an FX rate is available: show approximate USD, with a note that the GHS amount is charged at checkout.
- No country header or no FX rate: show canonical GHS price.
- Checkout never accepts the displayed USD amount from the browser. It reads `price` and `currency` from Supabase server-side.

## Local testing

Local development normally has no `x-vercel-ip-country` header, so it intentionally falls back to canonical GHS display. Test international country detection on a Vercel deployment, for example from a VPN exit outside Ghana.

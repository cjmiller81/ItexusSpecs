import { http, HttpResponse, type RequestHandler } from "msw";
import type {
  CalendarResponse,
  CategoriesResponse,
  CalendarEvent,
  Category,
} from "../features/Dashboard/CryptoCalendar/eventsResponseModel";
import { transparentPngResponse } from "./transparentPng";

// Static fixture days are computed relative to "now" so the synthetic calendar
// always lands in the visible window across stories (Today / This week).
const daysFromNow = (n: number): string => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
};

const fixtureEvents: CalendarEvent[] = [
  {
    id: 101,
    title: { en: "Mainnet upgrade — performance release" },
    coins: [{ id: "ethereum", name: "Ethereum", rank: 2, symbol: "ETH", fullname: "Ethereum (ETH)" }],
    date_event: daysFromNow(0),
    can_occur_before: false,
    created_date: daysFromNow(-7),
    displayed_date: "Today",
    categories: [{ id: 1, name: "Release" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/101",
  },
  {
    id: 102,
    title: { en: "Exchange listing on a tier-1 venue" },
    coins: [{ id: "arbitrum", name: "Arbitrum", rank: 45, symbol: "ARB", fullname: "Arbitrum (ARB)" }],
    date_event: daysFromNow(1),
    can_occur_before: false,
    created_date: daysFromNow(-5),
    displayed_date: "Tomorrow",
    categories: [{ id: 4, name: "Exchange Listing" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/102",
  },
  {
    id: 103,
    title: { en: "Scheduled token unlock — vesting cliff" },
    coins: [
      { id: "aptos", name: "Aptos", rank: 30, symbol: "APT", fullname: "Aptos (APT)" },
      { id: "optimism", name: "Optimism", rank: 60, symbol: "OP", fullname: "Optimism (OP)" },
    ],
    date_event: daysFromNow(3),
    can_occur_before: false,
    created_date: daysFromNow(-3),
    displayed_date: "in 3 days",
    categories: [{ id: 5, name: "Token Unlock" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/103",
  },
  {
    id: 104,
    title: { en: "Developer conference keynote" },
    coins: [{ id: "solana", name: "Solana", rank: 6, symbol: "SOL", fullname: "Solana (SOL)" }],
    date_event: daysFromNow(5),
    can_occur_before: false,
    created_date: daysFromNow(-2),
    displayed_date: "in 5 days",
    categories: [{ id: 1, name: "Conference" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/104",
  },
];

const fixtureCategories: Category[] = [
  { id: 1, name: "Conference" },
  { id: 2, name: "Release" },
  { id: 3, name: "Partnership" },
  { id: 4, name: "Exchange Listing" },
  { id: 5, name: "Token Unlock" },
  { id: 6, name: "Airdrop" },
  { id: 7, name: "Branding" },
];

const buildEventsResponse = (): CalendarResponse => ({
  _metadata: { max: 50, page: 1, page_count: 1, total_count: fixtureEvents.length },
  body: fixtureEvents,
});

const buildCategoriesResponse = (): CategoriesResponse => ({
  _metadata: { max: fixtureCategories.length, page: 1, page_count: 1, total_count: fixtureCategories.length },
  body: fixtureCategories,
});

// Host-agnostic regexes — `process.env.BACKEND_API_URL` is undefined in the
// Storybook bundle (the framework's Next-env plugin only forwards
// `NEXT_PUBLIC_*` vars), so a literal `` `${process.env.BACKEND_API_URL}/api/cal/...` ``
// would register as `"undefined/api/cal/..."` and never match the real
// `http://localhost:6006/api/cal/...` request made via `appAxios`.

// `*_normal.png` is the per-coin icon URL `CalendarEventTile` and
// `NewCryptoCalendar` build as
//   `${process.env.COIN_MARKET_CALENDAR_IMAGE_URL}${coin.id}_normal.png`.
//
// Two reasons we mock these in Storybook (see `./transparentPng.ts` for the
// general rationale):
//   1. `COIN_MARKET_CALENDAR_IMAGE_URL` is not `NEXT_PUBLIC_*`, so the
//      template expands to `…/undefined<coin>_normal.png` and 404s.
//   2. Even if we did inject the env, the production URL points at
//      CoinMarketCal's CDN — stories shouldn't depend on third-party
//      services being reachable.
//
// Regex matches the icon path regardless of host or query string so it
// covers both the broken `localhost:6006/undefined<coin>_normal.png` shape
// AND the real `https://d235dzzkn2ryki.cloudfront.net/<coin>_normal.png`
// shape (in case the env var is ever defined in a Storybook build).
export const calendarHandlers: RequestHandler[] = [
  http.get(/.*\/api\/cal\/events(?:\?.*)?$/, () => HttpResponse.json(buildEventsResponse())),
  http.get(/.*\/api\/cal\/categories(?:\?.*)?$/, () => HttpResponse.json(buildCategoriesResponse())),
  http.get(/[^/]+_normal\.png(?:\?.*)?$/, () => transparentPngResponse()),
];

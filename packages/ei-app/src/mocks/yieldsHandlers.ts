/**
 * MSW handlers for the DeFi yields/pools endpoints, replacing the previous
 * axios-mock-adapter wiring that lived in `configureYieldsMocks.ts`.
 *
 * Active in two places:
 *   - The dev mock-mode runtime worker in `browserApiServices.ts`
 *     (turned on with `NEXT_PUBLIC_MOCK_BACKEND_API=true`).
 *   - Storybook's preview MSW initialize() so any story rendering
 *     pool-aware components works without further wiring.
 */

import { http, HttpResponse, type RequestHandler } from "msw";

import all from "./data/pools/all.json";
import type { PoolData } from "../features/Income/Models/PoolData";

const poolFixtures = all.data as unknown as PoolData[];

// Host-agnostic regex — `process.env.BACKEND_API_URL` is undefined in the
// Storybook bundle, so a literal `` `${process.env.BACKEND_API_URL}/api/defi/pools` ``
// would register as `"undefined/api/defi/pools"` and never match the real
// `http://localhost:6006/api/defi/pools` request made via `appAxios`. The
// trailing `(?:\?.*)?` matches the query string the pools client appends.
// Note: anchored at `/pools$` (not `/pools/...`) so the more specific
// `/api/defi/pools/chains|categories|projects|symbols` handlers in
// `tablesHandlers` keep winning when needed.
export const yieldsHandlers: RequestHandler[] = [
  http.get(/.*\/api\/defi\/pools(?:\?.*)?$/, () =>
    HttpResponse.json({
      status: "success",
      data: poolFixtures,
    }),
  ),
];

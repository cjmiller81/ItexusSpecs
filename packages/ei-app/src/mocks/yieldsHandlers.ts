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

export const yieldsHandlers: RequestHandler[] = [
  http.get(`${process.env.BACKEND_API_URL}/api/defi/pools`, () =>
    HttpResponse.json({
      status: "success",
      data: poolFixtures,
    }),
  ),
];

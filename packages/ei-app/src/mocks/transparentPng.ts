/**
 * Shared placeholder asset for MSW handlers that stand in for image endpoints
 * in Storybook.
 *
 * Used in two situations:
 *   1. The URL template bakes in `process.env.<…>` where `<…>` is NOT a
 *      `NEXT_PUBLIC_*` variable. The framework's Next-env Vite plugin
 *      (`vite-plugin-storybook-nextjs/dist/index.js` → `publicNextEnvMap`)
 *      only forwards `NEXT_PUBLIC_*` envs into the iframe bundle, so the
 *      template expands to the literal string `"undefined"` and the request
 *      404s against the preview origin (e.g.
 *      `http://localhost:6006/undefined<…>`).
 *   2. The URL points at a third-party CDN we don't want stories to depend
 *      on being reachable from CI / offline (e.g. CoinMarketCal,
 *      DefiLlama's `icons.llamao.fi`).
 *
 * In both cases the visual result is "missing image" — equivalent to what
 * production renders when the upstream icon doesn't exist for a given token
 * or protocol — but with no 404 noise in the console.
 */

import { HttpResponse } from "msw";

// 1x1 fully-transparent PNG, decoded once at module load. The base64 below
// is the canonical "shortest valid transparent PNG" payload (67 bytes).
export const TRANSPARENT_PNG_BYTES: ArrayBuffer = Uint8Array.from(
  atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="),
  c => c.charCodeAt(0),
).buffer;

/**
 * Build a fresh MSW response carrying the transparent PNG. Wrapped in a
 * factory (rather than a shared instance) so each intercepted request gets
 * its own un-consumed `Response` stream.
 */
export const transparentPngResponse = (): HttpResponse =>
  new HttpResponse(TRANSPARENT_PNG_BYTES, {
    headers: { "Content-Type": "image/png" },
  });

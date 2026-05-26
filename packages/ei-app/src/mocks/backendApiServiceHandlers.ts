import { http, HttpResponse } from "msw";
import { RequestHandler } from "msw";

// Mock data:
import allCategories from "./data/categories/all.json";

import allChains from "./data/chains/all.json";

import marketCapWeightedIndexJanMarBtc8 from "./data/marketCapWeightedIndex/janMarBtc8.json";

import allTokens from "./data/tokens/all.json";
import btcTokens from "./data/tokens-search/btc.json";
import ethTokens from "./data/tokens-search/eth.json";
// Deep, type-only imports so loading these handlers in Storybook's preview
// does NOT drag the entire `components` barrel (and the MUI/styles graph it
// re-exports) into Vite's optimize-deps pass — which surfaces as
// "createTheme_default is not a function" at story render time.
import type { ICategory } from "components/src/models/token/ICatigory";
import type { IPlatform } from "components/src/models/token/IPlatform";
import type { ICoin } from "components/src/models/token/ICoin";
import type { IMarketCapWeightedIndex } from "components/src/models/token/IMarketCapWeightedIndex";

//const mockState = {}

// Mock the `services/backend-api.service.ts` API requests.
//
// The `/chains` and `/categories` URLs need host-agnostic patterns because
// `process.env.BACKEND_API_URL` is not defined in the Storybook bundle:
// `@storybook/nextjs-vite`'s Next-env Vite plugin only forwards
// `NEXT_PUBLIC_*` variables into client code (see
// `vite-plugin-storybook-nextjs/dist/index.js` → `publicNextEnvMap`), so the
// production Next.js whitelist for `BACKEND_API_URL` in `next.config.js`
// never reaches the iframe. A literal `` `${process.env.BACKEND_API_URL}/chains` ``
// would expand to the string `"undefined/chains"`, and MSW would resolve
// that as `http://localhost:6006/undefined/chains`, never matching the real
// request to `http://localhost:6006/chains` (RTK Query's `chainsApi` /
// `categoriesApi` send the path unchanged when no base URL is set).
//
// The regex anchors at `https?://<host>` so the handlers also won't
// shadow the nested `/api/defi/pools/chains` / `/api/defi/pools/categories`
// endpoints handled in `tablesHandlers`.
export const backendApiServiceHandlers: RequestHandler[] = [
  http.get(/^https?:\/\/[^/]+\/categories(?:\?.*)?$/, () => {
    const categories = allCategories as ICategory[];
    return HttpResponse.json(categories);
  }),

  http.get(/^https?:\/\/[^/]+\/chains(?:\?.*)?$/, () => {
    const chains = allChains as IPlatform[];
    return HttpResponse.json(chains);
  }),

  http.post(/^https?:\/\/[^/]+\/model\/run\/marketCapWeightedIndex(?:\?.*)?$/, () => {
    /*
    const url = new URL(request.url)
    let tokenCount = 8
    let startDate = new Date('2024-01-01')
    let endDate = new Date()
    let compareTokenId = 'bitcoin'

    if (url.searchParams.has('tokenCount')) {
      tokenCount = parseInt(url.searchParams.get('tokenCount') ?? '8')
    }
    if (url.searchParams.has('startDate')) {
      startDate = new Date(url.searchParams.get('startDate') ?? '2024-01-01')
    }
    if (url.searchParams.has('endDate')) {
      endDate = new Date(url.searchParams.get('endDate') ?? new Date())
    }
    if (url.searchParams.has('compareTokenId')) {
      compareTokenId = parseInt(url.searchParams.get('compareTokenId') ?? 'bitcoin')
    }

    return new HttpResponse(null, {
      status: 200
    })
    */

    const marketCapWeightedIndex = marketCapWeightedIndexJanMarBtc8 as unknown as IMarketCapWeightedIndex[];
    return HttpResponse.json(marketCapWeightedIndex);
  }),

  http.get(/^https?:\/\/[^/]+\/tokens(?:\?.*)?$/, () => {
    const coins = allTokens as ICoin[];
    return HttpResponse.json(coins);
  }),

  http.get(/^https?:\/\/[^/]+\/tokens-filters(?:\?.*)?$/, () => HttpResponse.json([])),

  http.get(/^https?:\/\/[^/]+\/tokens-search(?:\?.*)?$/, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.has("query")) {
      const symbolQuery = url.searchParams.get("query") ?? "";
      if (symbolQuery?.indexOf("btc") > -1) {
        const coins = btcTokens as ICoin[];
        return HttpResponse.json(coins);
      } else if (symbolQuery?.indexOf("eth") > -1) {
        const coins = ethTokens as ICoin[];
        return HttpResponse.json(coins);
      } else {
        const coins = allTokens as ICoin[];
        return HttpResponse.json(coins);
      }
    }

    return new HttpResponse(null, {
      status: 200,
    });
  }),

  // `/tokens-searchV2` — paginated successor to `/tokens-search`, called by
  // `iconsService.ts` (both GET for query-based search and POST for
  // address-list lookups). Returns an empty `PaginatedList<TokenSearchItem>`
  // shape: enough to satisfy the consumer (RTK Query / Axios), which would
  // otherwise see 404s and retry-loop on the home page — that loop is also
  // what triggers MSW's `MaxListenersExceededWarning` (11+ in-flight
  // `response:mocked` listeners on the addon's internal emitter).
  http.get(/^https?:\/\/[^/]+\/tokens-searchV2(?:\?.*)?$/, () =>
    HttpResponse.json({
      items: [],
      pageNumber: 0,
      totalPages: 0,
      totalCount: 0,
      hasPreviousPage: false,
      hansNextPage: false,
    }),
  ),
  http.post(/^https?:\/\/[^/]+\/tokens-searchV2(?:\?.*)?$/, () =>
    HttpResponse.json({
      items: [],
      pageNumber: 0,
      totalPages: 0,
      totalCount: 0,
      hasPreviousPage: false,
      hansNextPage: false,
    }),
  ),
];

/**
 * MSW handlers for the DevExtreme-driven Investing / Income tables and the
 * supporting reference-data endpoints they rely on. Used by Storybook so
 * stories rendering `PrefilterTokensTable`, `DefiPoolsTable`,
 * `VaultsPoolsTable`, and their parent sections don't trigger unhandled
 * network requests.
 *
 * The fixtures are intentionally small so DevExtreme can render at least
 * one row in the default page size.
 */

import { http, HttpResponse, type RequestHandler } from "msw";

import poolsAll from "./data/pools/all.json";
import allTokens from "./data/tokens/all.json";
import { transparentPngResponse } from "./transparentPng";

import type { PoolData } from "../features/Income/Models/PoolData";
import type { VaultsData } from "../features/Income/Models/VaultsData";
import type { ICoin } from "components/src/models/token/ICoin";
import type { IExchange } from "components/src/models/token/IExchange";

const poolFixtures = poolsAll.data as unknown as PoolData[];

const dexsFixture: string[] = ["uniswap-v3", "sushiswap", "curve", "balancer", "pancakeswap"];
const poolChainsFixture: string[] = ["Ethereum", "Arbitrum", "Optimism", "Base", "Polygon"];
const poolCategoriesFixture: string[] = ["Liquid Staking", "Lending", "DEX", "Yield", "Stablecoin"];
const poolProjectsFixture: string[] = ["lido", "aave", "uniswap-v3", "curve", "compound"];
const poolSymbolsFixture: string[] = ["STETH", "USDC", "ETH", "WBTC", "DAI"];
const uniqueAssetsFixture: string[] = ["ETH", "USDC", "WBTC", "DAI", "stETH"];

const exchangesFixture: IExchange[] = [
  { exchange_id: "binance", name: "Binance", apiKey: "", apiSecret: "" },
  { exchange_id: "coinbase", name: "Coinbase", apiKey: "", apiSecret: "" },
  { exchange_id: "kraken", name: "Kraken", apiKey: "", apiSecret: "" },
];

const vaultsFixture: VaultsData[] = [
  {
    id: "lido-eth",
    name: "ETH staking vault",
    chain: "Ethereum",
    platform_id: "lido",
    status: "active",
    breakdowns: { totalApy: 3.4 },
    tvls: { value: 18_500_000 },
    apy: 3.4,
    assets: ["ETH", "stETH"],
    risks: [],
  },
  {
    id: "beefy-usdc",
    name: "USDC yield vault",
    chain: "Arbitrum",
    platform_id: "aave",
    status: "active",
    breakdowns: { totalApy: 6.1 },
    tvls: { value: 7_200_000 },
    apy: 6.1,
    assets: ["USDC"],
    risks: ["IL_HIGH"],
  },
  {
    id: "curve-tricrypto",
    name: "Tricrypto LP vault",
    chain: "Ethereum",
    platform_id: "curve",
    status: "active",
    breakdowns: { totalApy: 12.4 },
    tvls: { value: 3_100_000 },
    apy: 12.4,
    assets: ["WBTC", "ETH", "USDT"],
    risks: ["MCAP_MICRO"],
  },
];

const lifiChainsFixture = {
  chains: [
    { id: 1, key: "eth", name: "Ethereum", logoURI: "", coin: "ETH", mainnet: true },
    { id: 42161, key: "arb", name: "Arbitrum", logoURI: "", coin: "ETH", mainnet: true },
    { id: 10, key: "opt", name: "Optimism", logoURI: "", coin: "ETH", mainnet: true },
    { id: 8453, key: "base", name: "Base", logoURI: "", coin: "ETH", mainnet: true },
  ],
};

const makeLifiToken = (chainId: number, symbol: string, name: string, decimals = 18) => ({
  address: `0x${symbol.padEnd(40, "0").slice(0, 40)}`,
  chainId,
  symbol,
  decimals,
  name,
  coinKey: symbol,
  logoURI: "",
  priceUSD: "1.00",
  marketCapUSD: 1_000_000_000,
  volumeUSD24H: 100_000_000,
  tags: [],
});

const lifiTokensFixture = (chainId: number) => ({
  tokens: {
    [chainId]: [
      makeLifiToken(chainId, "USDC", "USD Coin", 6),
      makeLifiToken(chainId, "USDT", "Tether", 6),
      makeLifiToken(chainId, "DAI", "Dai Stablecoin"),
      makeLifiToken(chainId, "ETH", "Ether"),
      makeLifiToken(chainId, "WBTC", "Wrapped BTC", 8),
    ],
  },
});

const lifiRoutesFixture = {
  routes: [
    {
      id: "route-1",
      fromAmount: "1000000",
      toAmount: "999800",
      toAmountMin: "994800",
      fromAmountUSD: "1000",
      toAmountUSD: "999.80",
      gasCostUSD: "0.06",
      tags: ["RECOMMENDED"],
      fromToken: { symbol: "DAI", decimals: 18, priceUSD: "1.00" },
      toToken: { symbol: "USDC", decimals: 6, priceUSD: "1.00" },
      steps: [
        {
          tool: "mayan",
          toolDetails: { name: "Mayan", key: "mayan" },
          type: "cross",
          action: {
            fromChainId: 1,
            toChainId: 42161,
            fromToken: { symbol: "DAI", decimals: 18 },
            toToken: { symbol: "USDC", decimals: 6 },
            fromAmount: "1000000",
          },
          estimate: {
            executionDuration: 35,
            toAmount: "999800",
            feeCosts: [],
            gasCosts: [{ amountUSD: "0.06" }],
          },
          includedSteps: [
            {
              tool: "mayan",
              toolDetails: { name: "Mayan", key: "mayan" },
              type: "cross",
              action: {
                fromChainId: 1,
                toChainId: 42161,
                fromToken: { symbol: "DAI", decimals: 18 },
                toToken: { symbol: "USDC", decimals: 6 },
                fromAmount: "1000000",
              },
              estimate: {
                toAmount: "999800",
                feeCosts: [],
                gasCosts: [{ amountUSD: "0.06" }],
              },
            },
          ],
        },
      ],
    },
  ],
};

const coinsFixture = allTokens as unknown as ICoin[];

// Every entry below uses a host-agnostic regex instead of
// `` `${process.env.BACKEND_API_URL}/path` ``. The interpolated form looks
// correct in source but in Storybook the literal `process.env.BACKEND_API_URL`
// is `undefined` (the framework's Next-env Vite plugin only forwards
// `NEXT_PUBLIC_*` variables — see
// `vite-plugin-storybook-nextjs/dist/index.js` → `publicNextEnvMap`), so the
// resulting handler URL would be `"undefined/api/foo"`, which MSW resolves to
// `http://localhost:6006/undefined/api/foo` and never matches the real request
// the components actually make (`http://localhost:6006/api/foo` from
// `appAxios` / `fetchBaseQuery` with no base URL).
//
// All the `/api/...` endpoint paths are specific enough that a simple
// `.*\/api\/...` regex won't shadow anything else; the `/...` and
// `/api/countries` / `/trading-pairs` / `/tokens-paginated` ones get the
// stricter `https?://<host>/...` anchor for the same reason as
// `backendApiServiceHandlers`' top-level paths.
export const tablesHandlers: RequestHandler[] = [
  http.get(/.*\/api\/defi\/dexs(?:\?.*)?$/, () => HttpResponse.json(dexsFixture)),
  http.get(/.*\/api\/defi\/pools\/chains(?:\?.*)?$/, () => HttpResponse.json(poolChainsFixture)),
  http.get(/.*\/api\/defi\/pools\/categories(?:\?.*)?$/, () => HttpResponse.json(poolCategoriesFixture)),
  http.get(/.*\/api\/defi\/pools\/projects(?:\?.*)?$/, () => HttpResponse.json(poolProjectsFixture)),
  http.get(/.*\/api\/defi\/pools\/symbols(?:\?.*)?$/, () => HttpResponse.json(poolSymbolsFixture)),
  // `/exchanges` is hit by the Investing `exchangesApi` and the trade
  // aggregator `cexApi`. Anchored at `https?://<host>` so it doesn't shadow
  // any nested `/api/.../exchanges` paths a future handler might add.
  http.get(/^https?:\/\/[^/]+\/exchanges(?:\?.*)?$/, () => HttpResponse.json(exchangesFixture)),
  http.get(/.*\/api\/beefy\/vaults(?:\?.*)?$/, () =>
    HttpResponse.json({ data: vaultsFixture, totalCount: vaultsFixture.length }),
  ),
  http.get(/.*\/api\/beefy\/vaults\/assets-unique(?:\?.*)?$/, () => HttpResponse.json(uniqueAssetsFixture)),
  // `LifiChainProvider` / `lifiApi` use `appAxios` with a relative path. In
  // Storybook that resolves to the preview origin (e.g. localhost:6006), not
  // `BACKEND_API_URL`, so host-agnostic patterns are required.
  http.get(/.*\/api\/lifi\/chains(?:\?.*)?$/, () => HttpResponse.json(lifiChainsFixture)),
  http.get(/.*\/api\/lifi\/tokens(?:\?.*)?$/, ({ request }) => {
    const url = new URL(request.url);
    const chainId = Number(url.searchParams.get("chainId") ?? 1);
    return HttpResponse.json(lifiTokensFixture(chainId));
  }),
  http.post(/.*\/api\/lifi\/routes(?:\?.*)?$/, () => HttpResponse.json(lifiRoutesFixture)),
  // Trade aggregator (CEX) endpoints used by TradeTable / ArbitrageMatrix.
  http.get(/.*\/api\/countries(?:\?.*)?$/, () =>
    HttpResponse.json(["United States", "United Kingdom", "Germany", "Japan"]),
  ),
  http.get(/^https?:\/\/[^/]+\/trading-pairs(?:\?.*)?$/, () =>
    HttpResponse.json([
      { base: "BTC", target: "USDT", pair: "BTC/USDT", exchange_count: 3, exchanges: [] },
      { base: "ETH", target: "USDT", pair: "ETH/USDT", exchange_count: 3, exchanges: [] },
      { base: "SOL", target: "USDT", pair: "SOL/USDT", exchange_count: 2, exchanges: [] },
    ]),
  ),
  // PrefilterTokensTable's parent section sometimes loads tokens directly.
  http.get(/^https?:\/\/[^/]+\/tokens-paginated(?:\?.*)?$/, () =>
    HttpResponse.json({ data: coinsFixture.slice(0, 20), totalCount: coinsFixture.length }),
  ),
  // DefiLlama protocol/chain icon URLs built by `ProjectCellComponent`,
  // `ChainCell`, and `incomeTokensColumnsDefs` as
  //   `${process.env.LAMA_PROJECT_ICONS_URL}/icons/protocols/<project>?w=48&h=48`
  //   `${process.env.LAMA_PROJECT_ICONS_URL}/icons/chains/rsz_<chain>?w=48&h=48`
  // Same pattern as the coin-icon URLs in `calendarHandlers.ts`:
  // `LAMA_PROJECT_ICONS_URL` is not `NEXT_PUBLIC_*` so it's `undefined` in
  // the Storybook bundle (the framework's Next-env Vite plugin only forwards
  // `NEXT_PUBLIC_*` vars), turning the template into
  // `…/undefined/icons/{protocols,chains}/…` which 404s against the preview
  // origin. Even when defined, prod points at DefiLlama's CDN
  // (`https://icons.llamao.fi`) which stories shouldn't depend on.
  //
  // Regex matches both the broken local-origin shape AND the real
  // `https://icons.llamao.fi/icons/…` shape so the handler stays correct
  // either way. `[^?]+` (not `[^/]+`) for the trailing segment because
  // some chain ids contain `_` and could conceivably contain `.`/`-`.
  http.get(/\/icons\/(?:protocols|chains)\/[^?]+(?:\?.*)?$/, () => transparentPngResponse()),
];

// Re-export the pool fixture so stories can share the same data without
// hitting the network.
export { poolFixtures, vaultsFixture, dexsFixture, exchangesFixture };

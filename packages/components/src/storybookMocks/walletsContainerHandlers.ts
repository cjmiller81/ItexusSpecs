import { http, HttpResponse } from "msw";
import type { LifiChain } from "../utils/enrichTokenPositions";
import { STORY_DEX_WALLET_ADDRESS, storyRichDexWallet } from "../features/myWallets/DEX/walletOverviewStoryData";
import { storySectionDexWalletRows } from "./myWalletsSectionStoryData";

/** Minimal `lifiChainMap` for `getWalletsPortfolio` enrichment in the apps. */
export const storyLifiChainMap = new Map<number, LifiChain>([
  [
    1,
    {
      id: 1,
      key: "ethereum",
      name: "Ethereum",
      logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
      coin: "ETH",
      mainnet: true,
    },
  ],
]);

/**
 * MSW for `WalletsContainer` mount effects: exchanges list, wallet list, portfolio
 * batch, and optional wallet index for `fetchTotalWalletsWorthData`.
 */
export function walletsContainerHandlers() {
  return [
    http.get(/.*\/api\/exchanges(?:\?.*)?$/, () => HttpResponse.json([])),
    http.get(/.*\/api\/wallet(?:\?.*)?$/, () => HttpResponse.json(storySectionDexWalletRows)),
    http.post(/.*\/api\/portfolio\/batch(?:\?.*)?$/, async ({ request }) => {
      const body = (await request.json()) as unknown;
      const addrs = Array.isArray(body) ? body : [];
      const wantsStory = addrs.some(
        a => typeof a === "string" && a.toLowerCase() === STORY_DEX_WALLET_ADDRESS.toLowerCase(),
      );
      return HttpResponse.json(wantsStory ? [storyRichDexWallet] : []);
    }),
    http.post(/.*\/model\/run\/walletValueIndex(?:\?.*)?$/, () =>
      HttpResponse.json([
        {
          walletValue: 48_000,
          historyDate: "2026-05-12T12:00:00.000Z",
          compareSymbol: "",
          comparePrice: 0,
        },
        {
          walletValue: 52_000,
          historyDate: "2026-05-13T12:00:00.000Z",
          compareSymbol: "",
          comparePrice: 0,
        },
      ]),
    ),
  ];
}

import type { BillingState } from "../slices/billingSlice";
import type { WalletsState } from "../slices/walletsSlice";
import type { Wallet } from "../models";
import { STORY_DEX_WALLET_ADDRESS, storyRichDexWallet } from "../features/myWallets/DEX/walletOverviewStoryData";

const proPageAccessJson = JSON.stringify(["/profile", "/wallets"]);
const proFeatureLimitsJson = JSON.stringify({
  savedStrategyCount: 100,
  tableExport: true,
  tradeAggregatorQuoteCountDEX: 1000,
  walletConncectionCountCEX: 50,
  walletConncectionCountDEX: 50,
});

/**
 * Billing slice shape so `useSubscription` + `FeatureAccessGuard` allow DEX wallet
 * connections. Use with `parameters.reduxState.billing`.
 */
export const storyBillingProDexAccess: BillingState = {
  plans: [],
  billing: { id: "cus_storybook_section" } as NonNullable<BillingState["billing"]>,
  loading: false,
  error: null,
  subscription: null,
  subscriptions: [
    {
      status: "active",
      items: {
        data: [
          {
            plan: { product: "prod_storybook_pro" },
            price: { product: "prod_storybook_pro" },
          },
        ],
      },
    },
  ] as NonNullable<BillingState["subscriptions"]>,
  defaultSourceId: null,
  paymentIntentClientSecret: null,
  paymentMethods: [],
  customerId: "cus_storybook_section",
  product: {
    id: "prod_storybook_pro",
    object: "product",
    active: true,
    created: "2026-01-01",
    defaultPriceId: "price_storybook_pro",
    defaultPrice: null,
    deleted: null,
    description: "Storybook",
    images: [],
    livemode: false,
    marketing_features: [],
    metadata: {
      page_access: proPageAccessJson,
      feature_limits: proFeatureLimitsJson,
    },
    name: "Pro",
    packageDimensions: null,
    shippable: null,
    statementDescriptor: null,
    taxCodeId: null,
    taxCode: null,
    type: "service",
    unitLabel: null,
    updated: "2026-01-01",
    url: null,
    rawJObject: {},
    stripeResponse: null,
  } as NonNullable<BillingState["product"]>,
  products: null,
};

export const storySectionDexWalletRows: Wallet[] = [
  {
    walletId: "sb-section-w1",
    address: STORY_DEX_WALLET_ADDRESS,
    walletName: "Primary DEX",
    isValid: true,
    isPersonal: true,
    chainAssets: [],
  },
];

export function storyWalletsStateForSection(overrides: Partial<WalletsState> = {}): WalletsState {
  const row = storySectionDexWalletRows[0];
  return {
    wallets: storySectionDexWalletRows,
    exchanges: [],
    statstatusCreatingWalletus: "idle",
    statusFetchingWallets: "idle",
    statusDeletingWallets: "idle",
    statusDeletingExchange: "idle",
    statusUpdatingWallets: "idle",
    statusFetchingExchanges: "idle",
    statusTotalWalletWorthFetching: "idle",
    statusFetchingPortfolio: "idle",
    selectedWallets: [row],
    currentWalletsFilter: { isPersonal: false },
    portfolioWalletData: [storyRichDexWallet],
    totalWalletsWorthData: { growPercentage: 3.2 },
    ...overrides,
  };
}

/** Wallets slice before `fetchWallets` / portfolio populate (profile mount). */
export function storyWalletsColdStartState(): WalletsState {
  return {
    wallets: null,
    exchanges: null,
    statstatusCreatingWalletus: "idle",
    statusFetchingWallets: "idle",
    statusDeletingWallets: "idle",
    statusDeletingExchange: "idle",
    statusUpdatingWallets: "idle",
    statusFetchingExchanges: "idle",
    statusTotalWalletWorthFetching: "idle",
    statusFetchingPortfolio: "idle",
    selectedWallets: [],
    currentWalletsFilter: { isPersonal: false },
    portfolioWalletData: [],
  };
}

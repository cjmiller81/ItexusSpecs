import type { BillingState } from "../slices/billingSlice";

/**
 * Shared Storybook helpers for driving `useSubscription` (and therefore
 * every `FeatureAccessGuard` / `PageAccessGuard` consumer) into a chosen
 * subscription state via `parameters.reduxState.billing`.
 *
 * `preview.tsx` defaults `billing` to {@link entitledBillingState} so any
 * story that doesn't care about the gating renders the "happy path" with
 * full entitlements. Stories that specifically want the gated branch
 * override with {@link unentitledBillingState}.
 *
 * RTK preloadedState replaces (does not deep-merge) slice state, so
 * stories that override must provide the full `BillingState` shape — these
 * helpers exist so callers don't have to reconstruct it.
 */

// Page routes the apps gate via `hasPageAccess(...)`. Union of every path
// passed to `useSubscription().hasPageAccess(...)` across the workspaces;
// add new routes here whenever a guarded page is introduced.
const ALL_GATED_ROUTES = [
  "/dashboard",
  "/charts",
  "/derivatives",
  "/liquidity_pools",
  "/vaults",
  "/myWallets",
  "/myWallets/decentralized",
  "/myWallets/centralized",
  "/income",
  "/investing",
  "/investing/marketCapWeighted",
  "/investing/marketCapEqualWeighted",
  "/tradeAggregator",
  "/tradeAggregator/cex",
  "/tradeAggregator/dex",
  "/profile",
  "/wallets",
];

const ENTITLED_FEATURE_LIMITS = {
  savedStrategyCount: 1000,
  tableExport: true,
  tradeAggregatorQuoteCountDEX: 10_000,
  walletConncectionCountCEX: 1000,
  walletConncectionCountDEX: 1000,
};

const enterpriseProduct = {
  id: "prod_storybook_enterprise",
  object: "product",
  active: true,
  created: "2026-01-01",
  defaultPriceId: "price_storybook_enterprise",
  defaultPrice: null,
  deleted: null,
  description: "Storybook Enterprise (every page + feature unlocked)",
  images: [],
  livemode: false,
  marketing_features: [],
  metadata: {
    page_access: JSON.stringify(ALL_GATED_ROUTES),
    feature_limits: JSON.stringify(ENTITLED_FEATURE_LIMITS),
  },
  name: "Enterprise",
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
} as unknown as NonNullable<BillingState["product"]>;

const entitledStripeSubscription = {
  status: "active",
  items: {
    data: [
      {
        plan: { product: enterpriseProduct.id },
        price: { product: enterpriseProduct.id },
      },
    ],
  },
} as unknown as NonNullable<BillingState["subscriptions"]>[number];

/**
 * Fully entitled subscription state. `useSubscription` returns
 * `isActive: true` with maxed feature limits and `pageAccess` covering
 * every guarded route. This is the Storybook default.
 */
export const entitledBillingState: BillingState = {
  plans: [],
  // Just needs to be truthy so `useSubscription`'s `hasData` flips true.
  billing: { id: "cus_storybook_entitled" } as NonNullable<BillingState["billing"]>,
  loading: false,
  error: null,
  subscription: null,
  subscriptions: [entitledStripeSubscription],
  defaultSourceId: null,
  paymentIntentClientSecret: null,
  paymentMethods: [],
  customerId: "cus_storybook_entitled",
  product: enterpriseProduct,
  products: null,
};

/**
 * Loaded billing data but no active subscription. `useSubscription`
 * returns `isActive: false` so gated content renders its "restricted"
 * branch (upgrade tooltip / disabled child / redirect from
 * `PageAccessGuard`). Use this for the `Restricted` variant of any story.
 */
export const unentitledBillingState: BillingState = {
  ...entitledBillingState,
  billing: { id: "cus_storybook_unentitled" } as NonNullable<BillingState["billing"]>,
  customerId: "cus_storybook_unentitled",
  subscriptions: [],
  product: null,
};

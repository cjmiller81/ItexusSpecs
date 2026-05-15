// Types for subscription-based access control

export interface FeatureLimits {
  savedStrategyCount: number;
  tableExport: boolean;
  tradeAggregatorQuoteCountDEX: number;
  walletConncectionCountCEX: number;
  walletConncectionCountDEX: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  pageAccess: string[];
  featureLimits: FeatureLimits;
}

// Default free plan used as fallback when no subscription data is available
export const DEFAULT_FREE_PLAN: SubscriptionPlan = {
  id: "free",
  name: "Free",
  pageAccess: [
    "/investing/marketCapWeighted",
    "/investing/marketCapEqualWeighted",
    "/charts",
    "/liquidity_pools",
    "/vaults",
    "/tradeAggregator/cex"
  ],
  featureLimits: {
    savedStrategyCount: 2,
    tableExport: false,
    tradeAggregatorQuoteCountDEX: 0,
    walletConncectionCountCEX: 0,
    walletConncectionCountDEX: 0
  }
};

export interface UserSubscription {
  plan: SubscriptionPlan;
  isActive: boolean;
  customerId?: string;
}

// Helper function to create subscription plan from product metadata
export function createSubscriptionPlanFromMetadata(
  productName: string,
  pageAccess: string[],
  featureLimits: FeatureLimits
): SubscriptionPlan {
  return {
    id: productName.toLowerCase().replace(/\s+/g, '_'),
    name: productName,
    pageAccess,
    featureLimits
  };
}

// ─── Dev-only plan override ──────────────────────────────────────────────────
export const DEV_PLAN_STORAGE_KEY = '__DEV_PLAN__';

export const DEV_PLAN_PRESETS: Record<string, { plan: SubscriptionPlan; isActive: boolean }> = {
  free: {
    isActive: false,
    plan: DEFAULT_FREE_PLAN,
  },
  basic: {
    isActive: true,
    plan: {
      id: 'basic',
      name: 'Basic',
      pageAccess: ['*'],
      featureLimits: {
        savedStrategyCount: 5,
        tableExport: false,
        tradeAggregatorQuoteCountDEX: 5,
        walletConncectionCountCEX: 1,
        walletConncectionCountDEX: 2,
      },
    },
  },
  power: {
    isActive: true,
    plan: {
      id: 'power',
      name: 'Power',
      pageAccess: ['*'],
      featureLimits: {
        savedStrategyCount: 20,
        tableExport: true,
        tradeAggregatorQuoteCountDEX: 20,
        walletConncectionCountCEX: 3,
        walletConncectionCountDEX: 6,
      },
    },
  },
  pro: {
    isActive: true,
    plan: {
      id: 'pro',
      name: 'Pro',
      pageAccess: ['*'],
      featureLimits: {
        savedStrategyCount: 100,
        tableExport: true,
        tradeAggregatorQuoteCountDEX: 100,
        walletConncectionCountCEX: 10,
        walletConncectionCountDEX: 12,
      },
    },
  },
};

export function getDevPlanOverride(): { plan: SubscriptionPlan; isActive: boolean } | null {
  if (typeof window === 'undefined') return null;
  const key = localStorage.getItem(DEV_PLAN_STORAGE_KEY);
  return key ? (DEV_PLAN_PRESETS[key] ?? null) : null;
}
// ─────────────────────────────────────────────────────────────────────────────

// Helper function to determine plan from Stripe subscription data
export function getPlanFromStripeSubscription(subscription: any, productData?: any): SubscriptionPlan {
  if (!subscription || !subscription.items || !subscription.items.data || subscription.items.data.length === 0) {
    return DEFAULT_FREE_PLAN;
  }

  const subscriptionItem = subscription.items.data[0];
  const product = subscriptionItem.plan?.product || subscriptionItem.price?.product;
  
  // Use product data if available
  const finalProduct = productData || product;
  
  // Try to get plan from metadata
  if (finalProduct?.metadata?.page_access && finalProduct?.metadata?.feature_limits) {
    try {
      const pageAccess = JSON.parse(finalProduct.metadata.page_access);
      const featureLimits = JSON.parse(finalProduct.metadata.feature_limits);
      
      return createSubscriptionPlanFromMetadata(
        finalProduct.name || 'Custom Plan',
        pageAccess,
        featureLimits
      );
    } catch (error) {
      console.error('Error parsing metadata:', error);
    }
  }
  
  // Fallback to default free plan if no metadata available
  return DEFAULT_FREE_PLAN;
}

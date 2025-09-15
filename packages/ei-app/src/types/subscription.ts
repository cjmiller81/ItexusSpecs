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

// Predefined subscription plans based on the requirements
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
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
  },
  BASIC_MONTHLY: {
    id: "basic_monthly",
    name: "Basic Monthly",
    pageAccess: [
      "/investing/marketCapWeighted",
      "/investing/marketCapEqualWeighted",
      "/charts",
      "/derivatives",
      "/liquidity_pools",
      "/vaults",
      "/myWallets/decentralized",
      "/tradeAggregator/dex",
      "/tradeAggregator/cex"
    ],
    featureLimits: {
      savedStrategyCount: 8,
      tableExport: false,
      tradeAggregatorQuoteCountDEX: 1,
      walletConncectionCountCEX: 1,
      walletConncectionCountDEX: 2
    }
  },
  POWER_MONTHLY: {
    id: "power_monthly",
    name: "Power Monthly",
    pageAccess: [
      "/investing/marketCapWeighted",
      "/investing/marketCapEqualWeighted",
      "/charts",
      "/derivatives",
      "/liquidity_pools",
      "/vaults",
      "/myWallets/decentralized",
      "/tradeAggregator/dex",
      "/tradeAggregator/cex"
    ],
    featureLimits: {
      savedStrategyCount: 24,
      tableExport: true,
      tradeAggregatorQuoteCountDEX: 3,
      walletConncectionCountCEX: 3,
      walletConncectionCountDEX: 6
    }
  },
  PRO_MONTHLY: {
    id: "pro_monthly",
    name: "Pro Monthly",
    pageAccess: [
      "/investing/marketCapWeighted",
      "/investing/marketCapEqualWeighted",
      "/charts",
      "/derivatives",
      "/liquidity_pools",
      "/vaults",
      "/myWallets/decentralized",
      "/tradeAggregator/dex",
      "/tradeAggregator/cex"
    ],
    featureLimits: {
      savedStrategyCount: 72,
      tableExport: true,
      tradeAggregatorQuoteCountDEX: 5,
      walletConncectionCountCEX: 6,
      walletConncectionCountDEX: 12
    }
  }
};

export interface UserSubscription {
  plan: SubscriptionPlan;
  isActive: boolean;
  customerId?: string;
}

// Helper function to determine subscription plan from Stripe metadata
export function getSubscriptionPlanFromMetadata(
  productName?: string,
  pageAccess?: string[],
  featureLimits?: FeatureLimits
): SubscriptionPlan {
  // If we have explicit metadata, use it
  if (pageAccess && featureLimits) {
    const customPlan = {
      id: productName?.toLowerCase().replace(/\s+/g, '_') || 'custom',
      name: productName || 'Custom',
      pageAccess,
      featureLimits
    };
    return customPlan;
  }

  // Fallback to predefined plans based on product name
  const normalizedName = productName?.toLowerCase() || '';
  
  if (normalizedName.includes('pro')) {
    return SUBSCRIPTION_PLANS.PRO_MONTHLY;
  } else if (normalizedName.includes('power')) {
    return SUBSCRIPTION_PLANS.POWER_MONTHLY;
  } else if (normalizedName.includes('basic')) {
    return SUBSCRIPTION_PLANS.BASIC_MONTHLY;
  } else {
    return SUBSCRIPTION_PLANS.FREE;
  }
}

// Helper function to determine plan from Stripe subscription data
export function getPlanFromStripeSubscription(subscription: any, productData?: any): SubscriptionPlan {
  if (!subscription || !subscription.items || !subscription.items.data || subscription.items.data.length === 0) {
    return SUBSCRIPTION_PLANS.FREE;
  }

  const subscriptionItem = subscription.items.data[0];
  const product = subscriptionItem.plan?.product || subscriptionItem.price?.product;
  
  
  // Use product data if available
  const finalProduct = productData || product;
  
  // Try to get product name from metadata first
  if (finalProduct?.metadata?.page_access && finalProduct?.metadata?.feature_limits) {
    try {
      const pageAccess = JSON.parse(finalProduct.metadata.page_access);
      const featureLimits = JSON.parse(finalProduct.metadata.feature_limits);
      
      const customPlan = {
        id: finalProduct.name?.toLowerCase().replace(/\s+/g, '_') || 'custom',
        name: finalProduct.name || 'Custom',
        pageAccess,
        featureLimits
      };
      
      return customPlan;
    } catch (error) {
      console.error('❌ Error parsing metadata:', error);
    }
  }
  
  // Fallback to product name-based detection
  const productName = finalProduct?.name || '';
  const fallbackPlan = getSubscriptionPlanFromMetadata(productName);
  
  return fallbackPlan;
}

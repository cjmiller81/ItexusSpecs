import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { 
  UserSubscription, 
  SubscriptionPlan, 
  getPlanFromStripeSubscription,
  SUBSCRIPTION_PLANS 
} from '@/types/subscription';
import { fetchProductAsync, RootState } from 'components';

export function useSubscription() {
  const billing = useSelector((state: RootState) => state.billing);
  
  const subscription = useMemo((): UserSubscription => {
    // Get subscription data from billing state
    const stripeSubscription = billing.subscriptions?.[0]; // Get first subscription from array
    
    // Check if subscription is active
    const isActive = stripeSubscription?.status === 'active' || stripeSubscription?.status === 'trialing';
    
    // Determine plan from Stripe subscription data
    const plan = getPlanFromStripeSubscription(stripeSubscription, billing.product);
    
    const result = {
      plan,
      isActive,
      customerId: billing.billing?.id || undefined
    };
    
    return result;
  }, [billing.subscriptions, billing.billing?.id, billing.product]);

  // Helper functions for access control
  const hasPageAccess = useCallback((pagePath: string): boolean => {
    if (!subscription.isActive) {
      return false;
    }
    
    return subscription.plan.pageAccess.includes(pagePath);
  }, [subscription.isActive, subscription.plan.pageAccess]);

  const canSaveStrategy = useCallback((currentCount: number): boolean => {
    if (!subscription.isActive) {
      return false;
    }
    
    return currentCount < subscription.plan.featureLimits.savedStrategyCount;
  }, [subscription.isActive, subscription.plan.featureLimits.savedStrategyCount]);

  const canExportTable = useCallback((): boolean => {
    if (!subscription.isActive) {
      return false;
    }
    
    return subscription.plan.featureLimits.tableExport;
  }, [subscription.isActive, subscription.plan.featureLimits.tableExport]);

  const getTradeAggregatorQuoteLimit = useCallback((): number => {
    if (!subscription.isActive) {
      return 0;
    }
    
    return subscription.plan.featureLimits.tradeAggregatorQuoteCountDEX;
  }, [subscription.isActive, subscription.plan.featureLimits.tradeAggregatorQuoteCountDEX]);

  const canConnectWallet = useCallback((walletType: 'CEX' | 'DEX', currentCount: number): boolean => {
    if (!subscription.isActive) {
      return false;
    }
    
    const limit = walletType === 'CEX' 
      ? subscription.plan.featureLimits.walletConncectionCountCEX
      : subscription.plan.featureLimits.walletConncectionCountDEX;
    
    return currentCount < limit;
  }, [subscription.isActive, subscription.plan.featureLimits.walletConncectionCountCEX, subscription.plan.featureLimits.walletConncectionCountDEX]);

  const getWalletConnectionLimit = useCallback((walletType: 'CEX' | 'DEX'): number => {
    if (!subscription.isActive) {
      return 0;
    }
    
    return walletType === 'CEX' 
      ? subscription.plan.featureLimits.walletConncectionCountCEX
      : subscription.plan.featureLimits.walletConncectionCountDEX;
  }, [subscription.isActive, subscription.plan.featureLimits.walletConncectionCountCEX, subscription.plan.featureLimits.walletConncectionCountDEX]);

  return {
    subscription,
    hasPageAccess,
    canSaveStrategy,
    canExportTable,
    getTradeAggregatorQuoteLimit,
    canConnectWallet,
    getWalletConnectionLimit,
    isFreePlan: subscription.plan.id === SUBSCRIPTION_PLANS.FREE.id,
    isBasicPlan: subscription.plan.id === SUBSCRIPTION_PLANS.BASIC_MONTHLY.id,
    isPowerPlan: subscription.plan.id === SUBSCRIPTION_PLANS.POWER_MONTHLY.id,
    isProPlan: subscription.plan.id === SUBSCRIPTION_PLANS.PRO_MONTHLY.id,
  };
}

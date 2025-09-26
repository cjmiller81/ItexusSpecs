# Subscription-Based Access Control System

## Overview

This system implements subscription-based access control for the EI application, restricting access to pages and features based on the user's Stripe subscription plan metadata.

## Architecture

### Core Components

1. **Types** (`/types/subscription.ts`)
   - `FeatureLimits`: Interface for feature limitations
   - `SubscriptionPlan`: Interface for subscription plans
   - `UserSubscription`: Interface for user subscription state
   - Predefined subscription plans (Free, Basic, Power, Pro)

2. **Hook** (`/hooks/useSubscription.ts`)
   - `useSubscription()`: Main hook for accessing subscription data
   - Helper functions for checking access permissions
   - Integration with Redux billing state

3. **Components**
   - `PageAccessGuard`: Controls access to entire pages
   - `FeatureAccessGuard`: Controls access to specific features

## Subscription Plans

### Free Subscription
- **Page Access**: `/investing/marketCapWeighted`, `/investing/marketCapEqualWeighted`, `/charts`, `/liquidity_pools`, `/vaults`, `/tradeAggregator/cex`
- **Feature Limits**:
  - Saved Strategies: 2
  - Table Export: false
  - DEX Quote Requests: 0
  - Wallet Connections (CEX): 0
  - Wallet Connections (DEX): 0

### Basic Monthly
- **Page Access**: All Free pages + `/derivatives`, `/myWallets/decentralized`, `/tradeAggregator/dex`
- **Feature Limits**:
  - Saved Strategies: 8
  - Table Export: false
  - DEX Quote Requests: 1
  - Wallet Connections (CEX): 1
  - Wallet Connections (DEX): 2

### Power Monthly
- **Page Access**: Same as Basic
- **Feature Limits**:
  - Saved Strategies: 24
  - Table Export: true
  - DEX Quote Requests: 3
  - Wallet Connections (CEX): 3
  - Wallet Connections (DEX): 6

### Pro Monthly
- **Page Access**: Same as Basic
- **Feature Limits**:
  - Saved Strategies: 72
  - Table Export: true
  - DEX Quote Requests: 5
  - Wallet Connections (CEX): 6
  - Wallet Connections (DEX): 12

## Usage Examples

### Page Access Control

```tsx
import { PageAccessGuard } from "@/components/PageAccessGuard";

export default function RestrictedPage() {
  return (
    <PageAccessGuard requiredPage="/charts">
      <div>Your page content here</div>
    </PageAccessGuard>
  );
}
```

### Feature Access Control

```tsx
import { FeatureAccessGuard } from "@/components/FeatureAccessGuard";

function SaveButton({ currentCount }) {
  return (
    <FeatureAccessGuard 
      feature="saveStrategy" 
      currentCount={currentCount}
      showTooltip={true}
    >
      <Button>Save Strategy</Button>
    </FeatureAccessGuard>
  );
}
```

### Using the Hook Directly

```tsx
import { useSubscription } from "@/hooks/useSubscription";

function MyComponent() {
  const { 
    hasPageAccess, 
    canSaveStrategy, 
    canExportTable,
    subscription 
  } = useSubscription();

  if (!hasPageAccess('/charts')) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome to {subscription.plan.name}</h1>
      {canExportTable() && <ExportButton />}
    </div>
  );
}
```

## Implementation Details

### Stripe Integration

The system reads subscription data from Stripe metadata:
- `page_access`: JSON array of accessible page paths
- `feature_limits`: JSON object with feature limitations

### Redux Integration

Subscription data is stored in the Redux billing state and accessed through:
- `billing.product`: Product information from Stripe
- `billing.subscription`: Subscription status
- `billing.customerId`: Customer identifier

### Sidebar Integration

The sidebar automatically disables menu items based on the user's plan:
- Free users: Limited access to trading and income features
- Basic users: No access to derivatives and DEX trading
- Power/Pro users: Full access to all features

## API Endpoint

The system uses the existing billing API endpoint:
```
GET /api/billing/subscriptions?customerId={customerId}
```

## Error Handling

- Graceful fallback to Free plan if subscription data is unavailable
- Clear error messages for access restrictions
- Upgrade prompts for restricted features

## Future Enhancements

1. **Dynamic Plan Updates**: Real-time plan changes without page refresh
2. **Usage Tracking**: Track actual usage against limits
3. **Trial Periods**: Support for trial access with limitations
4. **Custom Plans**: Support for enterprise/custom subscription plans

## Testing

To test different subscription levels:
1. Modify the billing state in Redux DevTools
2. Update the product metadata to simulate different plans
3. Use the browser's localStorage to test feature limits

## Maintenance

- Update subscription plans in `/types/subscription.ts`
- Add new features to `FeatureAccessGuard` component
- Update translations in `/public/locales/en/translation.json`

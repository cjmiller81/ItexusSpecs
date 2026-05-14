import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FeatureAccessGuard } from "./FeatureAccessGuard";
import type { BillingState } from "../slices/billingSlice";

// FeatureAccessGuard reads the current subscription from `state.billing` via
// the `useSubscription` hook and decides whether to render its children
// enabled, disabled, or wrapped in a "blocked" Tooltip with an Upgrade
// button. To exercise the visible states from a story, preload the billing
// slice via `parameters.reduxState`.
//
// `useSubscription` derives the active plan from `billing.subscriptions[0]`
// (status === 'active' | 'trialing'). When that is missing the guard falls
// back to "Loading subscription details…" — i.e. the same UI the apps show
// before billing data has been fetched.
//
// The plan itself is parsed from product metadata on the Stripe subscription
// object. With no metadata present, useSubscription falls back to
// DEFAULT_FREE_PLAN, which is what every story below uses (saved-strategy
// limit = 2, no DEX quotes, no table export, no wallet connections). That
// matches what the apps show free-tier users today and is enough to drive
// the allowed / denied / limit-reached branches below.

// All stories share this billing-slice shape because RTK preloadedState
// replaces (does not deep-merge) slice state — provide every required field
// even if it's the same as the slice's initialState.
const activeFreePlanBilling: BillingState = {
  plans: [],
  // Just needs to be truthy so useSubscription's `hasData` becomes true.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  billing: { id: "cus_storybook" } as any,
  loading: false,
  error: null,
  subscription: null,
  subscriptions: [
    // Status drives `isActive`; the missing items.data triggers the
    // DEFAULT_FREE_PLAN fallback in getPlanFromStripeSubscription.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { status: "active" } as any,
  ],
  defaultSourceId: null,
  paymentIntentClientSecret: null,
  paymentMethods: [],
  customerId: "cus_storybook",
  product: null,
  products: null,
};

const meta = {
  title: "Components/FeatureAccessGuard",
  component: FeatureAccessGuard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Wraps a child action (typically a Button) and disables it — and optionally renders a blocking Tooltip with an Upgrade Plan button — when the current Stripe subscription's plan can't reach the requested feature. Drive states by preloading `state.billing` via `parameters.reduxState`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    feature: "saveStrategy",
    showTooltip: true,
    tooltipPlacement: "top",
    children: <Button variant="contained">Save strategy</Button>,
  },
  argTypes: {
    feature: {
      control: "select",
      options: ["saveStrategy", "tableExport", "tradeAggregatorQuoteDEX", "walletConnectionCEX", "walletConnectionDEX"],
    },
    showTooltip: { control: "boolean" },
    tooltipPlacement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    currentCount: { control: { type: "number", min: 0 } },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, minWidth: 320 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof FeatureAccessGuard>;

export default meta;
type Story = StoryObj<typeof meta>;

// No billing data yet — `useSubscription` returns isActive=false, the guard
// disables the child and (when showTooltip) renders the "Loading
// subscription details…" message instead of the limit copy.
export const LoadingSubscription: Story = {
  args: {
    children: <Button variant="contained">Save strategy</Button>,
  },
};

// Active free plan, currentCount below the limit — child renders enabled.
export const AllowedSaveStrategy: Story = {
  args: {
    feature: "saveStrategy",
    currentCount: 0,
    children: <Button variant="contained">Save strategy</Button>,
  },
  parameters: {
    reduxState: { billing: activeFreePlanBilling },
  },
};

// Active free plan but feature is not in the plan — child disables and
// hovering it surfaces the upgrade tooltip.
export const DeniedTableExport: Story = {
  args: {
    feature: "tableExport",
    showTooltip: true,
    children: <Button variant="outlined">Export CSV</Button>,
  },
  parameters: {
    reduxState: { billing: activeFreePlanBilling },
  },
};

// Active free plan, but currentCount has hit the savedStrategyCount limit
// (2 on the default plan) — child disables and the tooltip cites the limit.
export const DeniedByLimit: Story = {
  args: {
    feature: "saveStrategy",
    currentCount: 2,
    showTooltip: true,
    children: <Button variant="contained">Save strategy</Button>,
  },
  parameters: {
    reduxState: { billing: activeFreePlanBilling },
  },
};

// Side-by-side gallery of every blocked feature with showTooltip on, so
// reviewers can hover each chip without flipping between stories.
export const AllDeniedFeatures: Story = {
  args: {
    children: <Button variant="contained">Action</Button>,
    showTooltip: true,
  },
  parameters: {
    reduxState: { billing: activeFreePlanBilling },
  },
  render: () => (
    <Stack spacing={2}>
      {(
        [
          ["tableExport", "Export CSV"],
          ["tradeAggregatorQuoteDEX", "Get DEX quote"],
          ["walletConnectionCEX", "Connect CEX wallet"],
          ["walletConnectionDEX", "Connect DEX wallet"],
        ] as const
      ).map(([feature, label]) => (
        <Box
          key={feature}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="caption"
            sx={{ width: 220, color: "text.secondary" }}>
            {feature}
          </Typography>
          <FeatureAccessGuard
            feature={feature}
            showTooltip>
            <Button variant="outlined">{label}</Button>
          </FeatureAccessGuard>
        </Box>
      ))}
    </Stack>
  ),
};

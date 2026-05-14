import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Grid } from "@mui/material";
import { BillingPlan } from "./BillingPlan";
import type { PlanModel } from "../models/PlanModel";
import type { Product } from "../models/Product";
import type { BillingState } from "../../../../slices/billingSlice";

// BillingPlan renders a single subscription tier card inside the Billing
// tab's plans grid. It composes the product metadata from
// `state.billing.plans` (via `useSelector`) with the `plan`, `products`,
// and `duplicatePlans` props the parent passes — every story preloads a
// realistic billing slice so the card has enough data to render the
// price, marketing features, monthly/yearly toggle, and the
// contextual primary button (Select / Current / Upgrade / Switch).
//
// `duplicatePlans` is the same plan in both billing intervals (monthly +
// yearly variants). When present, the StyledSwitch toggle appears and
// the price updates as the user flips intervals. Without it, the price
// is locked to whatever the `plan.recurring.interval` says.

const makePlan = (overrides: Partial<PlanModel> = {}): PlanModel =>
  ({
    id: "plan-storybook",
    object: "plan",
    active: true,
    billingScheme: "per_unit",
    created: "2026-01-01",
    currency: "usd",
    customUnitAmount: null,
    deleted: null,
    livemode: false,
    lookupKey: null,
    metadata: {},
    nickname: "Pro",
    product: "prod_storybook",
    recurring: {
      aggregateUsage: null,
      interval: "month",
      intervalCount: 1,
      meter: null,
      trialPeriodDays: null,
      usageType: "licensed",
    },
    taxBehavior: "exclusive",
    tiers: null,
    tiersMode: null,
    transformQuantity: null,
    type: "recurring",
    unit_amount: 1900,
    unitAmountDecimal: 1900,
    ...overrides,
  }) as PlanModel;

const proMonthly = makePlan({ id: "plan-pro-monthly", nickname: "Pro", unit_amount: 1900 });
const proYearly = makePlan({
  id: "plan-pro-yearly",
  nickname: "Pro",
  unit_amount: 19000,
  recurring: { ...proMonthly.recurring!, interval: "year" },
});
const starterPlan = makePlan({
  id: "plan-starter",
  nickname: "Starter",
  product: "prod_starter",
  unit_amount: 0,
});
const enterprisePlan = makePlan({
  id: "plan-enterprise",
  nickname: "Enterprise",
  product: "prod_enterprise",
  unit_amount: 0,
});

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    id: "prod_storybook",
    object: "product",
    active: true,
    created: "2026-01-01",
    defaultPriceId: "plan-pro-monthly",
    defaultPrice: null,
    deleted: null,
    description: "Storybook product",
    images: [],
    livemode: false,
    marketing_features: [
      { name: "Unlimited dashboards", rawJObject: { name: [] }, stripeResponse: null },
      { name: "Custom strategies", rawJObject: { name: [] }, stripeResponse: null },
      { name: "Priority email support", rawJObject: { name: [] }, stripeResponse: null },
    ],
    metadata: { page_access: "pro" },
    name: "Pro Plan",
    packageDimensions: null,
    shippable: null,
    statementDescriptor: null,
    taxCodeId: null,
    taxCode: null,
    type: "service",
    unitLabel: null,
    updated: "2026-01-01",
    url: null,
    rawJObject: null,
    stripeResponse: null,
    ...overrides,
  }) as Product;

const proProduct = makeProduct();
const starterProduct = makeProduct({
  id: "prod_starter",
  name: "Starter Plan",
  marketing_features: [
    { name: "Up to 3 dashboards", rawJObject: { name: [] }, stripeResponse: null },
    { name: "Community support", rawJObject: { name: [] }, stripeResponse: null },
  ],
});
const enterpriseProduct = makeProduct({
  id: "prod_enterprise",
  name: "Enterprise Plan",
  marketing_features: [
    { name: "Dedicated account manager", rawJObject: { name: [] }, stripeResponse: null },
    { name: "SLA-backed uptime", rawJObject: { name: [] }, stripeResponse: null },
    { name: "Custom integrations", rawJObject: { name: [] }, stripeResponse: null },
  ],
});

const baseBilling: BillingState = {
  plans: [proMonthly, proYearly, starterPlan, enterprisePlan],
  billing: null,
  loading: false,
  error: null,
  subscription: null,
  subscriptions: null,
  defaultSourceId: null,
  paymentIntentClientSecret: null,
  paymentMethods: [],
  customerId: null,
  product: null,
  products: [proProduct, starterProduct, enterpriseProduct],
};

const meta = {
  title: "Profile/Billing/BillingPlan",
  component: BillingPlan,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single subscription-plan card. Every story preloads `state.billing.plans` + `state.billing.products` so the marketing features list, monthly/yearly toggle, and the contextual button copy (Select / Current / Upgrade / Switch) all resolve correctly.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSelectPlan: fn(),
  },
  decorators: [
    Story => (
      <Grid
        container
        sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
        <Story />
      </Grid>
    ),
  ],
} satisfies Meta<typeof BillingPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default — Pro plan in a grid with no prior subscription; primary
// button reads "Select this plan".
export const Default: Story = {
  args: {
    plan: proMonthly,
    products: [proProduct, starterProduct, enterpriseProduct],
    duplicatePlans: [proMonthly, proYearly],
    selectedPlanId: null,
  },
  parameters: {
    reduxState: { billing: baseBilling },
  },
};

// This plan is the user's active subscription — primary button reads
// "Current plan" and is disabled. The Cancel Plan button appears below
// (driven by `window.showCancelPlanButton`).
export const CurrentPlan: Story = {
  args: {
    plan: proMonthly,
    isSelected: true,
    selectedPlanId: proMonthly.id,
    products: [proProduct, starterProduct, enterpriseProduct],
    duplicatePlans: [proMonthly, proYearly],
  },
  parameters: {
    reduxState: { billing: baseBilling },
  },
};

// User is on Starter ($0), looking at the Pro card — button reads
// "Upgrade" because the displayed price is greater than the selected
// plan price.
export const UpgradeOffered: Story = {
  args: {
    plan: proMonthly,
    isSelected: false,
    selectedPlanId: starterPlan.id,
    products: [proProduct, starterProduct, enterpriseProduct],
    duplicatePlans: [proMonthly, proYearly],
  },
  parameters: {
    reduxState: { billing: baseBilling },
  },
};

// User is on Pro, looking at the cheaper Starter card — button reads
// "Switch to this plan".
export const SwitchOffered: Story = {
  args: {
    plan: starterPlan,
    isSelected: false,
    selectedPlanId: proMonthly.id,
    products: [proProduct, starterProduct, enterpriseProduct],
    duplicatePlans: [proMonthly, proYearly],
  },
  parameters: {
    reduxState: { billing: baseBilling },
  },
};

// Enterprise variant — swaps the upgrade/switch button for a single
// "Contact us" CTA.
export const Enterprise: Story = {
  args: {
    plan: enterprisePlan,
    products: [proProduct, starterProduct, enterpriseProduct],
    duplicatePlans: null,
    selectedPlanId: null,
  },
  parameters: {
    reduxState: { billing: baseBilling },
  },
};

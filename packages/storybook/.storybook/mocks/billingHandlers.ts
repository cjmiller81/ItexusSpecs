/**
 * Default MSW handlers for the `/api/billing/*` and `/api/request-tracking/*`
 * endpoints `billingService` and `BillingApiUsageCard` hit on mount.
 *
 * Registered globally via `parameters.msw.handlers` in `preview.tsx`; stories
 * that want a specific variant (e.g. attach failure, empty plans list)
 * override individual handlers per-story by re-declaring
 * `parameters.msw.handlers` with the same path.
 */

import { http, HttpResponse } from "msw";

// ---- Shared fixtures -------------------------------------------------------

const customerId = "cus_storybook";

const sampleBilling = {
  id: customerId,
  object: "customer",
  email: "demo@example.com",
  created: new Date("2026-01-01T00:00:00Z").toISOString(),
  delinquent: false,
  invoice_settings: {
    default_payment_method: "pm_storybook_4242",
    defaultPaymentMethodId: "pm_storybook_4242",
  },
  metadata: { userId: "storybook-identity" },
};

const samplePlans = [
  {
    id: "plan_starter_monthly",
    object: "plan",
    active: true,
    nickname: "Starter",
    product: "prod_starter",
    recurring: { interval: "month", intervalCount: 1, usageType: "licensed" },
    unit_amount: 0,
    unitAmountDecimal: 0,
    currency: "usd",
  },
  {
    id: "plan_pro_monthly",
    object: "plan",
    active: true,
    nickname: "Pro",
    product: "prod_pro",
    recurring: { interval: "month", intervalCount: 1, usageType: "licensed" },
    unit_amount: 1900,
    unitAmountDecimal: 1900,
    currency: "usd",
  },
  {
    id: "plan_pro_yearly",
    object: "plan",
    active: true,
    nickname: "Pro",
    product: "prod_pro",
    recurring: { interval: "year", intervalCount: 1, usageType: "licensed" },
    unit_amount: 19000,
    unitAmountDecimal: 19000,
    currency: "usd",
  },
  {
    id: "plan_enterprise",
    object: "plan",
    active: true,
    nickname: "Enterprise",
    product: "prod_enterprise",
    recurring: { interval: "year", intervalCount: 1, usageType: "licensed" },
    unit_amount: 0,
    unitAmountDecimal: 0,
    currency: "usd",
  },
];

const sampleProducts = [
  {
    id: "prod_starter",
    object: "product",
    active: true,
    name: "Starter Plan",
    description: "Free tier",
    marketing_features: [{ name: "Up to 3 dashboards" }, { name: "Community support" }],
    metadata: { page_access: "starter" },
  },
  {
    id: "prod_pro",
    object: "product",
    active: true,
    name: "Pro Plan",
    description: "For power users",
    marketing_features: [
      { name: "Unlimited dashboards" },
      { name: "Custom strategies" },
      { name: "Priority email support" },
    ],
    metadata: { page_access: "pro" },
  },
  {
    id: "prod_enterprise",
    object: "product",
    active: true,
    name: "Enterprise Plan",
    description: "Custom contracts",
    marketing_features: [
      { name: "Dedicated account manager" },
      { name: "SLA-backed uptime" },
      { name: "Custom integrations" },
    ],
    metadata: { page_access: "enterprise" },
  },
];

const samplePaymentMethods = [
  {
    id: "pm_storybook_4242",
    object: "payment_method",
    type: "card",
    card: { last4: "4242", exp_month: 12, exp_year: 2030, brand: "visa" },
  },
  {
    id: "pm_storybook_0341",
    object: "payment_method",
    type: "card",
    card: { last4: "0341", exp_month: 8, exp_year: 2029, brand: "mastercard" },
  },
];

const periodStart = Math.floor(new Date("2026-11-01T00:00:00Z").getTime() / 1000);
const periodEnd = Math.floor(new Date("2026-12-01T00:00:00Z").getTime() / 1000);

const sampleSubscription = {
  id: "sub_storybook",
  object: "subscription",
  status: "active",
  created: periodStart,
  current_period_start: periodStart,
  current_period_end: periodEnd,
  customer: customerId,
  cancel_at_period_end: false,
  items: {
    object: "list",
    has_more: false,
    total_count: 1,
    url: "",
    data: [
      {
        id: "si_storybook",
        object: "subscription_item",
        created: periodStart,
        quantity: 1,
        subscription: "sub_storybook",
        price: {
          id: "plan_pro_monthly",
          object: "price",
          active: true,
          product: "prod_pro",
          unit_amount: 1900,
          currency: "usd",
        },
        plan: {
          id: "plan_pro_monthly",
          object: "plan",
          active: true,
          amount: 1900,
          currency: "usd",
          interval: "month",
          interval_count: 1,
          product: "prod_pro",
          nickname: "Pro",
          usage_type: "licensed",
        },
      },
    ],
  },
};

const sampleApiUsage = {
  userId: "storybook-identity",
  startDate: new Date(periodStart * 1000).toISOString(),
  endDate: new Date(periodEnd * 1000).toISOString(),
  totalRequests: 1234,
  allowedRequests: 5000,
};

// ---- Handlers --------------------------------------------------------------

export const defaultBillingHandlers = [
  http.get("*/api/billing/plans", () => HttpResponse.json(samplePlans)),
  http.get("*/api/billing/products", () => HttpResponse.json(sampleProducts)),
  http.get("*/api/billing/product/:productId", ({ params }) => {
    const product = sampleProducts.find(p => p.id === params.productId);
    return product ? HttpResponse.json(product) : HttpResponse.json({ message: "Product not found" }, { status: 404 });
  }),
  http.get("*/api/billing", () => HttpResponse.json(sampleBilling)),
  http.post("*/api/billing", () => HttpResponse.json(sampleBilling)),
  http.get("*/api/billing/paymentMethods", () => HttpResponse.json(samplePaymentMethods)),
  http.post("*/api/billing/attach", () => HttpResponse.json({ success: true })),
  http.post("*/api/billing/detachPaymentMethod", () => HttpResponse.json({ success: true })),
  http.post("*/api/billing/setDefaultPaymentMethod", () => HttpResponse.json({ success: true })),
  http.get("*/api/billing/subscriptions", () => HttpResponse.json([sampleSubscription])),
  http.post("*/api/billing/subscriptions", () => HttpResponse.json(sampleSubscription)),
  http.post("*/api/billing/paymentIntent", () =>
    HttpResponse.json({
      id: "pi_storybook",
      clientSecret: "pi_storybook_secret",
      status: "succeeded",
    }),
  ),
  http.post("*/api/billing/updateSubscription", () => HttpResponse.json(sampleSubscription)),
  http.post("*/api/billing/cancelSubscription", () => HttpResponse.json({ ...sampleSubscription, status: "canceled" })),
  http.get("*/api/request-tracking/status", () => HttpResponse.json(sampleApiUsage)),
];

// Re-exported so individual stories can build variants on top.
export const billingFixtures = {
  customerId,
  billing: sampleBilling,
  plans: samplePlans,
  products: sampleProducts,
  paymentMethods: samplePaymentMethods,
  subscription: sampleSubscription,
  apiUsage: sampleApiUsage,
  periodStart,
  periodEnd,
};

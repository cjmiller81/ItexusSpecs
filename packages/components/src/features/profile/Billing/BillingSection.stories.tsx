import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse } from "msw";
import { Elements } from "@stripe/react-stripe-js";
import Box from "@mui/material/Box";
import { BillingContainer } from "./BillingSection";

// Sliced from `.storybook/mocks/billingHandlers.ts` (the global MSW
// default) so this story can build variant handlers without reaching
// outside the component library's `rootDir`. Keep these shapes aligned
// with the global fixtures when extending the variants below.
const firstPaymentMethod = {
  id: "pm_storybook_4242",
  object: "payment_method",
  type: "card",
  card: { last4: "4242", exp_month: 12, exp_year: 2030, brand: "visa" },
};

const apiUsageFixture = {
  userId: "storybook-identity",
  startDate: new Date("2026-11-01T00:00:00Z").toISOString(),
  endDate: new Date("2026-12-01T00:00:00Z").toISOString(),
  totalRequests: 1234,
  allowedRequests: 5000,
};

// `BillingContainer` (file: `BillingSection.tsx`) is the orchestrator
// for the Billing tab. On mount it dispatches the full thunk fan-out —
// `getBillingAsync`, `fetchPlansAsync`, `fetchProductsAsync`,
// `fetchPaymentMethodsAsync`, `fetchSubscriptionsAsync`,
// `fetchProductAsync` — and renders:
//
//   - `BillingApiUsageCard` (left)         → `/api/request-tracking/status`
//   - Payment methods `ProfileContainer`   → `/api/billing/paymentMethods`
//   - Plans grid of `BillingPlan` cards    → `/api/billing/plans` + `/products`
//   - YesNoDialog for card-delete confirm
//   - `PaymentMethodModal` for add / edit  → mock Stripe + `/api/billing/attach`
//   - MUI Dialog for plan-cancel confirm   → `/api/billing/cancelSubscription`
//
// All of those endpoints are wired up by the default MSW handler set
// registered in `preview.tsx`. Per-story overrides under
// `parameters.msw.handlers` drive the empty/error variants.
//
// BillingContainer also calls `useStripe()` / `useElements()` itself for
// the `createPaymentIntent` flow, so every story wraps the component in
// the mock `<Elements stripe={null}>` provider (which our mock turns
// into a synchronous, non-null Stripe instance).

const meta = {
  title: "Profile/Billing/BillingSection",
  component: BillingContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "End-to-end Billing tab — API usage + payment methods + plans grid. Wraps the production component in the mock Stripe `<Elements>` and the global MSW billing handlers; per-story overrides switch into the empty/error states.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Elements stripe={null}>
        <Box sx={{ p: 4 }}>
          <Story />
        </Box>
      </Elements>
    ),
  ],
} satisfies Meta<typeof BillingContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default — everything resolves. User has an active Pro subscription
// (`prod_pro` monthly) with two saved cards.
export const Default: Story = {};

// No active subscription — `subscriptions` returns `[]`, no card is
// selected, every plan's button reads "Select this plan", and the
// Cancel Plan button is hidden.
export const NoSubscription: Story = {
  parameters: {
    msw: {
      handlers: [http.get("*/api/billing/subscriptions", () => HttpResponse.json([]))],
    },
  },
};

// No cards on file — the payment methods section renders the
// "No payment methods on file" empty state and the API usage card sits
// alone on the left.
export const NoCards: Story = {
  parameters: {
    msw: {
      handlers: [http.get("*/api/billing/paymentMethods", () => HttpResponse.json([]))],
    },
  },
};

// Plans endpoint 500s — the plans grid stays empty (Redux falls back to
// the initialState `[]`), but the rest of the tab still renders.
export const PlansFetchFails: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/billing/plans", () =>
          HttpResponse.json({ message: "Plans service unavailable" }, { status: 500 }),
        ),
      ],
    },
  },
};

// Single-card account, monthly plan with high API usage — same payload
// shape as Default but with `totalRequests` near the limit so the
// progress bar visibly fills.
export const NearApiLimit: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/billing/paymentMethods", () => HttpResponse.json([firstPaymentMethod])),
        http.get("*/api/request-tracking/status", () => HttpResponse.json({ ...apiUsageFixture, totalRequests: 4850 })),
      ],
    },
  },
};

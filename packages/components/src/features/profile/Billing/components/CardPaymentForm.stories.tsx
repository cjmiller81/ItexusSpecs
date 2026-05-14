import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { http, HttpResponse } from "msw";
import { Elements } from "@stripe/react-stripe-js";
import Box from "@mui/material/Box";
import { CardPaymentForm } from "./CardPaymentForm";

// CardPaymentForm is the Formik+Stripe card-entry form rendered inside
// `PaymentMethodEditor` and `PaymentMethodSelector`. Two collaborators
// it needs to function in stories:
//
//   1. Stripe Elements — `@stripe/react-stripe-js` is aliased to a
//      Storybook mock in `.storybook/main.ts`. The mock provides
//      `useStripe()`/`useElements()` plus styled placeholders for the
//      three CardElement components, so the form lays out correctly
//      without loading `js.stripe.com`. The form's `handleSubmit` calls
//      our `defaultMockStripe.createPaymentMethod`, which returns a
//      successful Visa 4242 result.
//
//   2. Billing service — the form dispatches `getBillingAsync` on mount
//      and `attachPaymentMethodAsync` on submit. The default MSW handlers
//      in `preview.tsx` return a populated `Billing` and `success: true`
//      from `/api/billing/attach`; per-story overrides under
//      `parameters.msw.handlers` drive the failure paths.

const meta = {
  title: "Profile/Billing/CardPaymentForm",
  component: CardPaymentForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Stripe card-entry form wrapped in the Storybook `<Elements>` mock. Clicking Save runs the form's full submit flow — mock `stripe.createPaymentMethod` → MSW-backed `attachPaymentMethodAsync` → parent `onAttachCard` callback (recorded as a Storybook action).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onAttachCard: fn(),
    paymentMethods: [],
  },
  decorators: [
    Story => (
      <Elements stripe={null}>
        <Box sx={{ p: 4, maxWidth: 720, mx: "auto", position: "relative", minHeight: 360 }}>
          <Story />
        </Box>
      </Elements>
    ),
  ],
} satisfies Meta<typeof CardPaymentForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Happy path — the default MSW handlers + the default mock Stripe both
// succeed; clicking Save fires `onAttachCard` with the Visa 4242 result.
export const Default: Story = {};

// `attachPaymentMethodAsync` resolves but with `success: false` — the
// form surfaces the returned error message in the red Typography line.
export const AttachReturnsError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/api/billing/attach", () =>
          HttpResponse.json({ success: false, message: "Card declined by issuer" }),
        ),
      ],
    },
  },
};

// Backend rejects the attach call (500) — the form sets a generic error.
export const AttachFails500: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/api/billing/attach", () =>
          HttpResponse.json({ message: "Internal server error" }, { status: 500 }),
        ),
      ],
    },
  },
};

// Same payment method already attached — `paymentMethods` includes the
// id the mock `createPaymentMethod` returns (`pm_storybook_4242`), so
// the form short-circuits with "This card is already linked".
export const DuplicateCard: Story = {
  args: {
    paymentMethods: [{ id: "pm_storybook_4242", card: { last4: "4242", exp_month: 12, exp_year: 2030 } }],
  },
};

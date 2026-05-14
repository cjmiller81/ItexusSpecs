import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Elements } from "@stripe/react-stripe-js";
import Box from "@mui/material/Box";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

// PaymentMethodSelector composes `PaymentTabs` with one of two
// per-tab bodies — `CardPaymentForm` (when `tab === "card"`) or a
// "Coming soon" placeholder for every other tab. Internal state seeds
// `tab` to `"card"`, so the default story mounts the Stripe card form;
// the `CryptoTab` story uses Storybook's `play` function to click the
// Crypto tab after render.
//
// **Stripe note**: `CardPaymentForm` calls `<CardNumberElement>` etc.,
// which require a `<Elements>` provider. The stories wrap in
// `<Elements stripe={null}>` so the React tree mounts cleanly — the
// Stripe iframes stay empty (no public key loaded), which is enough
// for visual review of the surrounding form chrome. End-to-end card
// entry will be covered in a follow-up batch once we mock Stripe +
// the billing service endpoints (`/api/billing/...`).
const meta = {
  title: "Profile/Billing/PaymentMethodSelector",
  component: PaymentMethodSelector,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composition of `PaymentTabs` + per-tab body. Tab state is owned internally; the Crypto story uses a `play` function to switch tabs after render. Card-tab Stripe Elements are stubbed via `<Elements stripe={null}>` for visual review only.",
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
        <Box sx={{ p: 4, maxWidth: 720, mx: "auto", position: "relative", minHeight: 480 }}>
          <Story />
        </Box>
      </Elements>
    ),
  ],
} satisfies Meta<typeof PaymentMethodSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state — Card tab is active. Stripe iframes are empty (no
// public key configured); reviewers see the form layout + Save/Cancel
// chrome.
export const CardTab: Story = {};

// Switches to the Crypto tab after render to surface the "Coming soon"
// placeholder + a disabled Save button.
export const CryptoTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cryptoTab = await canvas.findByRole("button", { name: /crypto/i });
    await userEvent.click(cryptoTab);
    await expect(await canvas.findByText(/coming soon/i)).toBeVisible();
  },
};

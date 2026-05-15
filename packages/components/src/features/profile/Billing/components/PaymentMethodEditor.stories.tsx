import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import { PaymentMethodEditor } from "./PaymentMethodEditor";

// PaymentMethodEditor is the "edit an existing card" panel rendered
// inside `PaymentMethodModal`. It wraps `CardPaymentForm` in its own
// `<Elements>` provider (using `loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)`).
// The Storybook Vite alias swaps both `@stripe/react-stripe-js` and
// `@stripe/stripe-js` for in-tree mocks, so the editor's `<Elements>`
// resolves to a synchronous mock Stripe and the inner card-input slots
// render as styled placeholders — no `js.stripe.com` fetch, no real
// publishable key.
const meta = {
  title: "Profile/Billing/PaymentMethodEditor",
  component: PaymentMethodEditor,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Edit-card panel — own `<Elements>` wrap, prefilled with the existing masked card details. Submit flow goes through the same mock Stripe + MSW `/api/billing/attach` path as `CardPaymentForm`.",
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
      <Box sx={{ p: 4, maxWidth: 720, mx: "auto", position: "relative", minHeight: 420 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof PaymentMethodEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default — empty card fields (mock Stripe placeholders) and the Save
// button wired to the happy-path MSW handlers.
export const Default: Story = {};

// Edit an existing card — `number`/`expiry`/`cvc` props mirror what the
// BillingSection passes when opening the editor for a saved card.
export const EditingExistingCard: Story = {
  args: {
    number: "**** **** **** 0341",
    expiry: "08/29",
    cvc: "•••",
  },
};

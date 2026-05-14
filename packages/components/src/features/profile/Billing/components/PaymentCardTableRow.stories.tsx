import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Stack, useTheme } from "@mui/material";
import { PaymentCardTableRow } from "./PaymentCardTableRow";

// PaymentCardTableRow is the per-card row rendered inside the "Payment
// methods" ProfileContainer. It's purely presentational — `isDefault`
// switches the right-hand control between the "Default" Chip and the
// "Make default" Button, and the trailing Delete button always fires
// `onDelete`. Copy comes from the `BillingContainer` namespace plus
// `Common.Delete`.
const meta = {
  title: "Profile/Billing/PaymentCardTableRow",
  component: PaymentCardTableRow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single payment-method row used inside the Billing tab's payment-methods list. Stateless — the parent owns the cards array and the `onSetDefault` / `onDelete` callbacks. The card number is rendered as `Card ending in {last 4}` so reviewers can pass a masked `**** **** **** 4242` style string straight through.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    number: "**** **** **** 4242",
    isDefault: false,
    onSetDefault: fn(),
    onDelete: fn(),
  },
  argTypes: {
    isDefault: { control: "boolean" },
    number: { control: "text" },
  },
  decorators: [
    Story => (
      <Stack sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
        <Story />
      </Stack>
    ),
  ],
} satisfies Meta<typeof PaymentCardTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IsDefault: Story = {
  args: { isDefault: true },
};

// Two rows stacked to verify the divider between consecutive cards
// (PaymentMethodsCard owns the `borderBottom` style, so the stories pin
// it in via the row's `sx` prop to mirror what BillingSection passes).
const StackedRender = (args: React.ComponentProps<typeof PaymentCardTableRow>) => {
  const theme = useTheme();
  return (
    <>
      <PaymentCardTableRow
        {...args}
        number="**** **** **** 4242"
        isDefault
        sx={{
          borderBottom: "solid",
          borderWidth: "1px",
          borderColor: theme.palette.divider,
        }}
      />
      <PaymentCardTableRow
        {...args}
        number="**** **** **** 0341"
        isDefault={false}
      />
    </>
  );
};

export const StackedRows: Story = {
  render: args => <StackedRender {...args} />,
};

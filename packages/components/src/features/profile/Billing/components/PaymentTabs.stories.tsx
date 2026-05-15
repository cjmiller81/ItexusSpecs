import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import { PaymentTabs, type PaymentTabsProps, type TabsType } from "./PaymentTabs";

// PaymentTabs is a horizontal Stack of `SelectableButton`s for choosing the
// active payment method. The Apple Pay / Google Pay rows live in the
// component but are commented out in production today, so this story
// covers the two enabled tabs (Card / Crypto). Labels come from the
// `PaymentTabs` i18n namespace added in preview.tsx.
const ControlledRender = (args: PaymentTabsProps) => {
  const [tab, setTab] = useState<TabsType>(args.tab);
  return (
    <Box sx={{ minWidth: 360 }}>
      <PaymentTabs
        {...args}
        tab={tab}
        onTabChange={next => {
          setTab(next);
          args.onTabChange?.(next);
        }}
      />
    </Box>
  );
};

const meta = {
  title: "Profile/Billing/PaymentTabs",
  component: PaymentTabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Horizontal payment-method picker built from `SelectableButton`s. `tab` is controlled — the parent owns the state and `onTabChange` fires on every selection.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    tab: "card",
    onTabChange: fn(),
  },
  argTypes: {
    tab: {
      control: "select",
      options: ["card", "apple-pay", "google-pay", "crypto"],
    },
  },
} satisfies Meta<typeof PaymentTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardSelected: Story = {
  render: args => <ControlledRender {...args} />,
};

export const CryptoSelected: Story = {
  args: { tab: "crypto" },
  render: args => <ControlledRender {...args} />,
};

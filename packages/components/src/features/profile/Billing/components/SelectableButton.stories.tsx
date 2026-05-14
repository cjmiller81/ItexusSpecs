import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { SelectableButton } from "./SelectableButton";

// SelectableButton wraps MUI's outlined Button with a `selected` flag that
// switches the border + label colour to `primary.main`. Used inside the
// payment-method tabs and other "pick one" rows in the billing UI.
const meta = {
  title: "Profile/Billing/SelectableButton",
  component: SelectableButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Outlined MUI Button with a `selected` flag that swaps border + text colour to the theme's primary. Designed to be used in groups (payment method tabs, billing-period chooser, etc.).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    children: "Credit card",
    onClick: fn(),
  },
  argTypes: {
    selected: { control: "boolean" },
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ minWidth: 220 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof SelectableButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// Demonstrates the typical use as a single-select group — clicking a row
// promotes it to the "selected" state.
const SingleSelectRender = () => {
  const [active, setActive] = useState("card");
  const options = [
    { id: "card", label: "Credit card" },
    { id: "google", label: "Google Pay" },
    { id: "ach", label: "Bank transfer" },
  ];
  return (
    <Stack
      spacing={1}
      sx={{ width: 280 }}>
      {options.map(o => (
        <SelectableButton
          key={o.id}
          selected={active === o.id}
          onClick={() => setActive(o.id)}>
          {o.label}
        </SelectableButton>
      ))}
    </Stack>
  );
};

export const SingleSelectGroup: Story = {
  render: () => <SingleSelectRender />,
};

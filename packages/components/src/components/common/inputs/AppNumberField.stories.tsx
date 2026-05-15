import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppNumberField } from "./AppNumberField";

const meta = {
  title: "Common/Inputs/AppNumberField",
  component: AppNumberField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    label: { control: "text" },
    required: { control: "boolean" },
    fieldError: { control: "text" },
    max: { control: "number" },
    maxDecimals: { control: "number" },
  },
  decorators: [
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <AppNumberField
        {...args}
        value={value}
        onChange={next => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
} satisfies Meta<typeof AppNumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Amount",
    value: 0,
    maxDecimals: 2,
  },
};

export const Required: Story = {
  args: {
    label: "Order size",
    required: true,
    value: 100,
    maxDecimals: 2,
  },
};

export const WithMax: Story = {
  args: {
    label: "Slippage tolerance",
    value: 1.5,
    max: 100,
    maxDecimals: 2,
  },
};

export const ManyDecimals: Story = {
  args: {
    label: "ETH amount",
    value: 0.123456,
    maxDecimals: 8,
  },
};

export const WithError: Story = {
  args: {
    label: "Order size",
    required: true,
    value: 999999,
    max: 10000,
    fieldError: "Amount exceeds maximum allowed",
    maxDecimals: 2,
  },
};

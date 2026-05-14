import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppPercentageField } from "./AppPercentageField";

const meta = {
  title: "Common/Inputs/AppPercentageField",
  component: AppPercentageField,
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
      <AppPercentageField
        {...args}
        value={value}
        onChange={next => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
} satisfies Meta<typeof AppPercentageField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Slippage tolerance",
    value: 0.5,
    max: 100,
    maxDecimals: 2,
  },
};

export const Required: Story = {
  args: {
    label: "Allocation",
    required: true,
    value: 25,
    max: 100,
    maxDecimals: 2,
  },
};

export const FullyAllocated: Story = {
  args: {
    label: "Allocation",
    value: 100,
    max: 100,
    maxDecimals: 2,
  },
};

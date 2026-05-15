import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { AppDatePicker } from "./AppDatePicker";

const meta = {
  title: "Common/Inputs/AppDatePicker",
  component: AppDatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    tooltip: { control: "text" },
    required: { control: "boolean" },
  },
  decorators: [
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState<Date | null>((args.value as Date | null) ?? null);
    return (
      <AppDatePicker
        {...args}
        value={value}
        onChange={(next, context) => {
          setValue(next);
          args.onChange?.(next, context);
        }}
      />
    );
  },
} satisfies Meta<typeof AppDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Start date",
    value: new Date(2026, 4, 1),
  },
};

export const Required: Story = {
  args: {
    label: "Activation date",
    required: true,
    value: new Date(2026, 4, 12),
  },
};

export const WithTooltip: Story = {
  args: {
    label: "Filter from",
    tooltip: "Only show transactions on or after this date.",
    required: true,
    value: new Date(2026, 0, 1),
  },
};

export const Empty: Story = {
  args: {
    label: "Optional date",
    value: null,
  },
};

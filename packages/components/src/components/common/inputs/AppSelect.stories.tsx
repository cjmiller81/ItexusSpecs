import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MenuItem from "@mui/material/MenuItem";
import { AppSelect } from "./AppSelect";

const meta = {
  title: "Common/Inputs/AppSelect",
  component: AppSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
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
    const [value, setValue] = useState(args.value ?? "ETH");
    return (
      <AppSelect
        {...args}
        value={value}
        onChange={(event, child) => {
          setValue(event.target.value as string);
          args.onChange?.(event, child);
        }}>
        <MenuItem value="ETH">Ethereum</MenuItem>
        <MenuItem value="ARB">Arbitrum</MenuItem>
        <MenuItem value="OP">Optimism</MenuItem>
        <MenuItem value="BASE">Base</MenuItem>
        <MenuItem value="POLY">Polygon</MenuItem>
      </AppSelect>
    );
  },
} satisfies Meta<typeof AppSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Network",
    value: "ETH",
  },
};

export const Required: Story = {
  args: {
    label: "Network",
    required: true,
    value: "ARB",
  },
};

export const WithTooltip: Story = {
  args: {
    label: "Network",
    tooltip: "Pick the chain you want to operate on.",
    required: true,
    value: "ETH",
  },
};

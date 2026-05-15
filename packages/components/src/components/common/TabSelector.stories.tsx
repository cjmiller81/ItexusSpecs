import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StarIcon from "@mui/icons-material/Star";
import BoltIcon from "@mui/icons-material/Bolt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { TabSelector } from "./TabSelector";

const meta = {
  title: "Common/TabSelector",
  component: TabSelector,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    fullWidth: { control: "boolean" },
    value: { control: "text" },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <TabSelector
        {...args}
        value={value}
        onChange={next => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
} satisfies Meta<typeof TabSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { label: "Swap", value: "swap" },
      { label: "Bridge", value: "bridge" },
    ],
    value: "swap",
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { label: "Swap", value: "swap", icon: <SwapHorizIcon fontSize="small" /> },
      { label: "Lightning", value: "lightning", icon: <BoltIcon fontSize="small" /> },
      { label: "Favorites", value: "favorites", icon: <StarIcon fontSize="small" /> },
    ],
    value: "lightning",
  },
};

export const ThreeOptions: Story = {
  args: {
    options: [
      { label: "Trending", value: "trending" },
      { label: "All", value: "all" },
      { label: "Favorites", value: "favorites" },
    ],
    value: "all",
  },
};

export const FullWidth: Story = {
  args: {
    options: [
      { label: "Open", value: "open" },
      { label: "Closed", value: "closed" },
      { label: "All", value: "all" },
    ],
    value: "open",
    fullWidth: true,
  },
  decorators: [
    Story => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
};

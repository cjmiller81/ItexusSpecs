import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Box } from "@mui/material";

import MultiSelectDexDropdown, { type Dex } from "./MultiSelectDexDropdown";

const dexFixture: Dex[] = [
  { id: "uniswap-v3", title: "Uniswap V3" },
  { id: "sushiswap", title: "SushiSwap" },
  { id: "curve", title: "Curve" },
  { id: "balancer", title: "Balancer" },
  { id: "pancakeswap", title: "PancakeSwap" },
];

// MultiSelectDexDropdown is fully controlled — host wraps it in state so the
// rendered story is interactive and reflects user picks.
const Host = (args: { dexs: Dex[]; maxSelections?: number; initial?: Dex[] }) => {
  const [selectedDexs, setSelectedDexs] = useState<Dex[]>(args.initial ?? []);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box sx={{ width: 480, padding: 2 }}>
      <MultiSelectDexDropdown
        dexs={args.dexs}
        selectedDexs={selectedDexs}
        setSelectedDexs={setSelectedDexs}
        isDexDropdownOpen={isOpen}
        setIsDexDropdownOpen={setIsOpen}
        maxSelections={args.maxSelections}
      />
    </Box>
  );
};

const meta = {
  title: "EI App/TradeAggregator/MultiSelectDexDropdown",
  component: Host,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    dexs: dexFixture,
  },
} satisfies Meta<typeof Host>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSelection: Story = {
  args: {
    initial: [dexFixture[0], dexFixture[2]],
  },
};

export const MaxReached: Story = {
  args: {
    maxSelections: 2,
    initial: [dexFixture[0], dexFixture[1]],
  },
};

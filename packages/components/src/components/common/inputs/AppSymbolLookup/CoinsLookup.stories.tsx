import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CoinsLookup, type CoinsLookUpOption, type CoinsLookupProps } from "./CoinsLookup";

// CoinsLookup is a *multi*-select picker driven by a custom button +
// Popper combination (not a vanilla Autocomplete). Clicking the button
// toggles the popper open; the popper hosts a virtualized Autocomplete
// with three "Top N Coins" shortcut rows pre-pended to whatever options
// the caller provides.
//
// Selecting a Top N row replaces the current selection with the first N
// coins from `options`. Selecting it again clears the selection.
// `useTranslation(["CoinsLookup", "Common"])` resolves via the namespaces
// added in preview.tsx.
const sampleCoins: CoinsLookUpOption[] = Array.from({ length: 600 }, (_, i) => {
  const symbols = ["BTC", "ETH", "SOL", "ADA", "DOT", "MATIC", "LINK", "UNI", "AVAX", "ATOM"];
  const symbol = symbols[i % symbols.length];
  return {
    id: `${symbol.toLowerCase()}-${i}`,
    label: `${symbol}${i} - ${symbol} Token ${i}`,
    iconUrl: null,
  };
});

const ControlledRender = (args: CoinsLookupProps) => {
  const [value, setValue] = useState<CoinsLookUpOption[]>(args.value ?? []);
  return (
    <Box sx={{ width: 220 }}>
      <CoinsLookup
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as CoinsLookUpOption[])}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}>
        Selected: {value.length} of {args.options.length}
      </Typography>
    </Box>
  );
};

const meta = {
  title: "Inputs/AppSymbolLookup/CoinsLookup",
  component: CoinsLookup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Multi-select coin picker rendered as a custom button + popper. The popper exposes three quick-select rows ('Top 100/300/500 Coins') that bulk-set the selection from the caller's `options` array.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: false,
    options: sampleCoins,
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof CoinsLookup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty initial selection — button reads "Coins". Click it to open the
// popper and try the Top N shortcuts.
export const Default: Story = {
  render: args => <ControlledRender {...args} />,
};

// Single selection — button collapses the symbol to the part before the
// dash (e.g. "ETH" not "ETH0 - ETH Token 0").
export const SingleSelected: Story = {
  args: {
    value: [sampleCoins[1]],
  },
  render: args => <ControlledRender {...args} />,
};

// Multi-selection — button shows "{count} selected".
export const ManySelected: Story = {
  args: {
    value: sampleCoins.slice(0, 7),
  },
  render: args => <ControlledRender {...args} />,
};

// Smaller `options` list disables the Top 300/500 quick-select effect
// (they still appear in the menu but only return whatever options exist).
export const SmallOptionsList: Story = {
  args: {
    options: sampleCoins.slice(0, 12),
  },
  render: args => <ControlledRender {...args} />,
};

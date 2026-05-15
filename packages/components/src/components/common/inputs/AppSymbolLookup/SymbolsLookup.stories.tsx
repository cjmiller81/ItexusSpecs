import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SymbolLookup, type LookUpOption, type SymbolsLookupProps } from "./SymbolsLookup";

// SymbolLookup is a single-select MUI Autocomplete with a virtualized
// listbox (react-window). It accepts a `(LookUpOption | null)[]` (nulls
// are used by the virtualized wrapper as "filler" placeholders while a
// page is being fetched). Stories below pass real options and skip the
// virtualization wrapper — see SymbolsLookupVirtualized for the paged
// fetch pattern.
const sampleTokens: LookUpOption[] = [
  { id: "btc", label: "BTC - Bitcoin", iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png" },
  { id: "eth", label: "ETH - Ethereum", iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png" },
  { id: "sol", label: "SOL - Solana", iconUrl: "https://assets.coincap.io/assets/icons/sol@2x.png" },
  { id: "ada", label: "ADA - Cardano", iconUrl: "https://assets.coincap.io/assets/icons/ada@2x.png" },
  { id: "dot", label: "DOT - Polkadot", iconUrl: "https://assets.coincap.io/assets/icons/dot@2x.png" },
  { id: "matic", label: "MATIC - Polygon", iconUrl: "https://assets.coincap.io/assets/icons/matic@2x.png" },
  { id: "link", label: "LINK - Chainlink", iconUrl: "https://assets.coincap.io/assets/icons/link@2x.png" },
  { id: "uni", label: "UNI - Uniswap", iconUrl: "https://assets.coincap.io/assets/icons/uni@2x.png" },
];

// useState in stories needs a real component (eslint
// react-hooks/rules-of-hooks doesn't recognize bare `render` arrows).
const ControlledRender = (args: SymbolsLookupProps) => {
  const [value, setValue] = useState<LookUpOption | null>(args.value ?? null);
  const [inputValue, setInputValue] = useState("");
  return (
    <Box sx={{ width: 360 }}>
      <SymbolLookup
        {...args}
        value={value}
        inputValue={inputValue}
        onChange={(_, newValue) => setValue(newValue)}
        onInputChange={(_, newInput) => setInputValue(newInput)}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}>
        Selected: {value ? `${value.label} (${value.id})` : "none"}
      </Typography>
    </Box>
  );
};

const meta = {
  title: "Inputs/AppSymbolLookup/SymbolsLookup",
  component: SymbolLookup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single-select MUI Autocomplete tuned for token/symbol pickers. Has a virtualized listbox (react-window) and renders the selected option's icon next to the search input. Used standalone for static option lists; wrap in `SymbolsLookupVirtualized` for paged fetches.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Symbol",
    options: sampleTokens,
    onChange: fn(),
    onInputChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    tooltip: { control: "text" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof SymbolLookup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => <ControlledRender {...args} />,
};

export const Preselected: Story = {
  args: {
    value: sampleTokens[1],
  },
  render: args => <ControlledRender {...args} />,
};

export const Loading: Story = {
  args: {
    loading: true,
    options: [],
  },
  render: args => <ControlledRender {...args} />,
};

export const NoResults: Story = {
  args: {
    options: [],
    label: "Symbol (none available)",
  },
  render: args => <ControlledRender {...args} />,
};

export const WithTooltip: Story = {
  args: {
    label: "Token",
    tooltip: "Pick the symbol to load market data for.",
  },
  render: args => <ControlledRender {...args} />,
};

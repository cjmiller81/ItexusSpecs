import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { ChainChip } from "./ChainChip";
import "./ChainChip.css";

// ChainChip renders a small pill with an optional chain logo + name, or
// falls back to an "unsupported" variant when no lifiChain is provided.
//
// Styling lives in a sibling CSS file that the component itself does NOT
// import — apps load it via global stylesheets. For stories we import the
// CSS directly so the pill renders correctly. The CSS scopes most of its
// theme variants under `.theme-light` / `.theme-dark` ancestors, so the
// decorator below adds the right class based on Storybook's color scheme.

const sampleLifiChain = {
  id: 1,
  key: "eth",
  name: "Ethereum",
  logoURI: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  coin: "ETH",
  mainnet: true,
};

const sampleLifiChainNoLogo = {
  ...sampleLifiChain,
  name: "Custom Chain",
  logoURI: "",
};

const meta = {
  title: "ChainChip",
  component: ChainChip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pill that displays a chain logo + name when a `lifiChain` is provided, or falls back to a muted dot + `networkName` for unsupported chains. Stories import `ChainChip.css` directly — apps load it globally.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box className="theme-dark">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ChainChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ethereum: Story = {
  args: {
    lifiChain: sampleLifiChain,
    networkName: "Ethereum",
  },
};

// Logo URL intentionally empty — the <img> simply doesn't render, but the
// chip layout stays intact (this also exercises the onError fallback path).
export const NoLogo: Story = {
  args: {
    lifiChain: sampleLifiChainNoLogo,
    networkName: "Custom Chain",
  },
};

// Falls into the "unsupported" branch where the dot replaces the logo and
// the chip dims its border.
export const Unsupported: Story = {
  args: {
    lifiChain: null,
    networkName: "Unknown network",
  },
};

// The CSS scopes theme styles under `.theme-light` ancestors. This story's
// decorator override swaps the dark wrapper for a light one so the
// light-mode palette is exercised.
export const LightTheme: Story = {
  args: {
    lifiChain: sampleLifiChain,
    networkName: "Ethereum",
  },
  decorators: [
    Story => (
      <Box
        className="theme-light"
        sx={{ p: 1, bgcolor: "#ffffff" }}>
        <Story />
      </Box>
    ),
  ],
};

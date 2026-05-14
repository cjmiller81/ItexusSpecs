import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { TotalWalletsWorthCard } from "./TotalWalletsWorthCard";

// TotalWalletsWorthCard renders the My Wallets summary chip — total
// portfolio worth (USD-formatted) and a percentage change pill whose
// colour comes from the active MUI theme's `success.*` / `error.*`
// palette. Pure prop-driven; the only collaborator is the global
// `I18nextProvider` decorator (for the `TotalWalletWorth` label).
const meta = {
  title: "MyWallets/TotalWalletsWorthCard",
  component: TotalWalletsWorthCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Summary card for the My Wallets dashboard — total worth in USD plus a coloured percentage-change pill. Negative `growPercentage` flips the icon to `TrendingDown` and the chip colour to `error.*`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    totalWorth: { control: { type: "number" } },
    growPercentage: { control: { type: "number", step: 0.1 } },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TotalWalletsWorthCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: { totalWorth: 24580.12, growPercentage: 3.42 },
};

export const Negative: Story = {
  args: { totalWorth: 24580.12, growPercentage: -2.18 },
};

// Zero / flat — the implementation routes 0 through the `>= 0` branch,
// so the pill stays green with an up-arrow at exactly 0%.
export const Flat: Story = {
  args: { totalWorth: 1000, growPercentage: 0 },
};

// Stress the number formatter with a large balance — `Intl.NumberFormat`
// renders thousand separators and two decimals.
export const HighBalance: Story = {
  args: { totalWorth: 1_234_567.89, growPercentage: 12.5 },
};

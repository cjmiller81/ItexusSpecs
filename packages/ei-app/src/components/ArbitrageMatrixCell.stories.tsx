import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ArbitrageMatrixCell } from "./ArbitrageMatrixCell";
import type { ArbitrageMatrixPrice } from "../features/tradeAggregator/TradeTableApi";

// ArbitrageMatrixCell renders one cell in the buy/sell exchange matrix on the
// CEX trade aggregator page. The visible state is purely derived from
// `arbitragePrices`: matching exchange ids → price → spread color (green
// gradient for profit, red gradient for loss, neutral when zero).

const buildPrices = (buyPrice: number, sellPrice: number): ArbitrageMatrixPrice[] => [
  {
    exchangeId: "binance",
    exchangeName: "Binance",
    price: buyPrice,
    base: "BTC",
    target: "USD",
    timestamp: 1_700_000_000,
  },
  {
    exchangeId: "coinbase",
    exchangeName: "Coinbase",
    price: sellPrice,
    base: "BTC",
    target: "USD",
    timestamp: 1_700_000_000,
  },
];

const meta = {
  title: "EI App/Components/ArbitrageMatrixCell",
  component: ArbitrageMatrixCell,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Single cell in the CEX arbitrage matrix. Colour-codes the spread between two exchanges' prices via `getColorForPercentage`. Pass `isDiagonal` for self-pairs (renders a muted dash instead).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    buyExchangeId: "binance",
    sellExchangeId: "coinbase",
    arbitragePrices: buildPrices(60_000, 60_120),
    isDiagonal: false,
  },
  decorators: [
    Story => (
      <Box sx={{ width: 160 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ArbitrageMatrixCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Profit: Story = {};

export const HighProfit: Story = {
  args: {
    arbitragePrices: buildPrices(60_000, 60_900),
  },
};

export const Loss: Story = {
  args: {
    arbitragePrices: buildPrices(60_000, 59_900),
  },
};

export const NoData: Story = {
  args: {
    arbitragePrices: [],
  },
};

export const Diagonal: Story = {
  args: {
    isDiagonal: true,
  },
};

export const SpreadGallery: Story = {
  name: "Spread gallery",
  render: () => (
    <Stack
      spacing={2}
      sx={{ width: 220 }}>
      {(
        [
          ["High profit", buildPrices(60_000, 60_900)],
          ["Profit", buildPrices(60_000, 60_120)],
          ["Marginal", buildPrices(60_000, 60_005)],
          ["No data", []],
          ["Marginal loss", buildPrices(60_000, 59_995)],
          ["Loss", buildPrices(60_000, 59_880)],
          ["Big loss", buildPrices(60_000, 59_100)],
        ] as const
      ).map(([label, prices]) => (
        <Box key={label}>
          <Typography
            variant="caption"
            color="text.secondary">
            {label}
          </Typography>
          <ArbitrageMatrixCell
            buyExchangeId="binance"
            sellExchangeId="coinbase"
            arbitragePrices={prices as ArbitrageMatrixPrice[]}
          />
        </Box>
      ))}
    </Stack>
  ),
};

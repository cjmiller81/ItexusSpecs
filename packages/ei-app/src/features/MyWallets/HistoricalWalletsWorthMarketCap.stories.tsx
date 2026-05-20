import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { HistoricalWalletsWorthMarketCap } from "./HistoricalWalletsWorthMarketCap";

const makeSeries = (name: string, base: number, amplitude: number) => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    {
      name,
      data: Array.from({ length: 30 }, (_, i) => {
        const x = new Date(now - (29 - i) * day);
        const drift = (i / 29 - 0.5) * amplitude;
        const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * (amplitude * 0.18);
        return { x: x.getTime(), y: Number((base + drift + noise).toFixed(2)) };
      }),
    },
  ];
};

const noopFetchPage = async () => ({ items: [], totalCount: 0 });

const meta = {
  title: "EI App/MyWallets/HistoricalWalletsWorthMarketCap",
  component: HistoricalWalletsWorthMarketCap,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 980 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Market-cap weighted index — historical performance",
    period: "daily",
    onPeriodChange: () => {},
    onFromDateChange: () => {},
    onToDateChange: () => {},
    fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    toDate: new Date(),
    onChartSubmit: () => {},
    lookupLoading: false,
    lookupOption: null,
    onOptionChange: () => {},
    minChartValue: -25,
    maxChartValue: 30,
    chartAxisTicks: 5,
    onToggleSeries: () => {},
    submitButtonDisabled: false,
    onFetchPage: noopFetchPage,
    chartSeries: makeSeries("MarketCap", 0, 20) as never,
  },
} satisfies Meta<typeof HistoricalWalletsWorthMarketCap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { chartDataLoading: true },
};

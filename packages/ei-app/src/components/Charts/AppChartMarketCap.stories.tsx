import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";

import { AppChartMarketCap } from "./AppChartMarketCap";

// `AppChartMarketCap` is the variant used for index-modelling pages
// (market-cap weighted index, equal-weighted index, etc.). Same wrapper
// pattern as `AppChart` / `AppChartHome` but does not force a background
// colour, so the chart inherits its container's surface.

const days = (count: number) => {
  const day = 24 * 60 * 60 * 1000;
  const start = new Date("2026-01-01T00:00:00Z").getTime();
  return Array.from({ length: count }, (_, i) => start + i * day);
};

const series = (count: number, base: number, drift = 80, vol = 220) =>
  days(count).map((ts, i) => [ts, base + i * drift + Math.sin(i / 3) * vol]);

const meta = {
  title: "EI App/Components/Charts/AppChartMarketCap",
  component: AppChartMarketCap,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Index-modelling variant of `AppChart`. Inherits surface background from its parent so it sits flat inside the Investing dashboards. Used by `MarketCapWeightedIndex` and `MarketCapEqualWeightedIndex` pages.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    height: 320,
    series: [
      { name: "Cap-weighted index", data: series(90, 100, 0.6, 4) },
      { name: "BTC reference", data: series(90, 100, 0.45, 3) },
    ],
  },
  decorators: [
    Story => (
      <Box sx={{ width: "min(960px, 100%)" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AppChartMarketCap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomColors: Story = {
  name: "With custom colours",
  args: {
    optionsOverrides: {
      colors: ["#22c55e", "#0ea5e9"],
      legend: { position: "top" },
    },
  },
};

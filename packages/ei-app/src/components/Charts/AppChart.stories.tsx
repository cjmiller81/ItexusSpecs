import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";

import { AppChart } from "./AppChart";

// `AppChart` is the workspace's base wrapper around `react-apexcharts` with
// dark-mode-friendly defaults (transparent background, theme-aware grid,
// smooth curves, datetime x-axis). The story supplies a synthetic price
// series so the chart can render without hitting the real backend.

const days = (count: number) => {
  const day = 24 * 60 * 60 * 1000;
  const start = new Date("2026-01-01T00:00:00Z").getTime();
  return Array.from({ length: count }, (_, i) => start + i * day);
};

const priceSeries = (count: number, base: number, drift = 80, vol = 220) =>
  days(count).map((ts, i) => [ts, base + i * drift + Math.sin(i / 3) * vol]);

const meta = {
  title: "EI App/Components/Charts/AppChart",
  component: AppChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Base ApexCharts wrapper. Merges caller-supplied `optionsOverrides` over a theme-aware default options object (transparent background, white/dark grid border, smooth curve, datetime x-axis). Used by the analytics dashboards as the building block for index, market-cap, and yield charts.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    height: 320,
    series: [
      { name: "BTC", data: priceSeries(60, 60_000, 90, 280) },
      { name: "ETH", data: priceSeries(60, 3_000, 8, 25) },
    ],
  },
  decorators: [
    Story => (
      <Box sx={{ width: "min(960px, 100%)" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AppChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    series: [{ name: "Portfolio worth", data: priceSeries(90, 50_000, 60, 1200) }],
  },
};

export const WithTitleOverride: Story = {
  name: "With title override",
  args: {
    optionsOverrides: {
      title: { text: "BTC vs ETH (Jan – Mar)", align: "left" },
      colors: ["#f7931a", "#627eea"],
    },
  },
};

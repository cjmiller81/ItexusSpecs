import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";

import { AppChartHome } from "./AppChartHome";

// `AppChartHome` is the dashboard variant of `AppChart`. Same ApexCharts
// wrapper but with a white background in light mode and no axis grid lines
// (cleaner for tile-sized previews). The story supplies a synthetic series
// so nothing hits the real backend.

const days = (count: number) => {
  const day = 24 * 60 * 60 * 1000;
  const start = new Date("2026-01-01T00:00:00Z").getTime();
  return Array.from({ length: count }, (_, i) => start + i * day);
};

const priceSeries = (count: number, base: number, drift = 80, vol = 220) =>
  days(count).map((ts, i) => [ts, base + i * drift + Math.sin(i / 3) * vol]);

const meta = {
  title: "EI App/Components/Charts/AppChartHome",
  component: AppChartHome,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Dashboard-tile variant of `AppChart`. Drops the explicit grid borders/dashes and uses a light-mode white background so it sits cleanly inside the home dashboard tiles. Otherwise the same merge-`optionsOverrides`-on-defaults pattern.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    height: 260,
    series: [{ name: "Total wallet worth", data: priceSeries(120, 50_000, 90, 1800) }],
  },
  decorators: [
    Story => (
      <Box sx={{ width: "min(720px, 100%)" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AppChartHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleAssets: Story = {
  name: "Multiple assets",
  args: {
    series: [
      { name: "BTC", data: priceSeries(120, 60_000, 90, 280) },
      { name: "ETH", data: priceSeries(120, 3_000, 8, 25) },
      { name: "SOL", data: priceSeries(120, 150, 0.4, 8) },
    ],
  },
};

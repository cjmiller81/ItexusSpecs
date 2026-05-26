import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import { TradingViewTile } from "./TradingViewTile";

// TradingViewTile loads two iframes from tradingview.com via `next/dynamic`.
// They render only when network access reaches the live TradingView CDN; in
// CI / offline the iframes show their own retry UI, which is the expected
// behaviour for the production app as well.
const meta: Meta<typeof TradingViewTile> = {
  title: "EI App/Dashboard/TradingViewTile",
  component: TradingViewTile,
  parameters: {
    layout: "fullscreen",
    // `TradingViewTile`'s props extend `DashboardTileProps`, which inherits
    // from MUI `StackProps` — bringing in `color` / `bgcolor` / `borderColor`
    // typed as `ResponsiveStyleValue<…>` (react-docgen "other"). Combined
    // with the preview-level matcher ``color: /(background|color)$/i``
    // (see `.storybook/preview.tsx`), autodocs would log
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead".
    // Restrict the controls panel to the props this story actually varies.
    // (Same root cause and fix as `CryptoNewsTile.stories.tsx`.)
    controls: { include: ["title", "icon"] },
  },
  decorators: [
    Story => (
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", p: 2, minHeight: 700 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Markets",
    icon: <ShowChartIcon fontSize="small" />,
  },
};

export default meta;

type Story = StoryObj<typeof TradingViewTile>;

export const Default: Story = {};

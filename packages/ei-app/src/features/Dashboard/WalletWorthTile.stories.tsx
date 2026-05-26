import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { WalletWorthTile } from "./WalletWorthTile";
import type { CompareToValues } from "@/libs/redux/Slices/Shared";

const makeSeries = (count: number, base: number, amplitude: number, step = 1): CompareToValues => {
  const now = Date.now();
  const out: CompareToValues = [];
  for (let i = 0; i < count; i++) {
    const x = new Date(now - (count - 1 - i) * step * 24 * 60 * 60 * 1000);
    const drift = (i / Math.max(count - 1, 1) - 0.5) * amplitude;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * (amplitude * 0.18);
    out.push({ x, y: Number((base + drift + noise).toFixed(2)) });
  }
  return out;
};

const growthSeries = makeSeries(30, 0, 18);
const valueSeries = makeSeries(30, 42_000, 6_000);

const meta: Meta<typeof WalletWorthTile> = {
  title: "EI App/Dashboard/WalletWorthTile",
  component: WalletWorthTile,
  parameters: {
    layout: "centered",
    // `WalletWorthTile`'s props extend `DashboardTileProps`, which inherits
    // from MUI `StackProps` — bringing in `color` / `bgcolor` / `borderColor`
    // typed as `ResponsiveStyleValue<…>` (react-docgen "other"). Combined
    // with the preview-level matcher ``color: /(background|color)$/i``
    // (see `.storybook/preview.tsx`), autodocs would log
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead".
    // Restrict the controls panel to the props this story actually varies.
    // (Same root cause and fix as `CryptoNewsTile.stories.tsx`.)
    controls: { include: ["icon", "chartDataGrowth", "chartDataValue", "chartLoading"] },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 720, height: 520 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    chartDataGrowth: growthSeries,
    chartDataValue: valueSeries,
  },
};

export default meta;

type Story = StoryObj<typeof WalletWorthTile>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    chartLoading: true,
  },
};

export const NoData: Story = {
  args: {
    chartDataGrowth: null,
    chartDataValue: null,
  },
};

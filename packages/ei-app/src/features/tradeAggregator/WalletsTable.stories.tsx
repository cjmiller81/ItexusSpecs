import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import { WalletsTable } from "./WalletsTable";

const columns: GridColDef[] = [
  { field: "asset", headerName: "Symbol", flex: 1 },
  { field: "chain", headerName: "Chain", flex: 1 },
  { field: "balance", headerName: "Balance", flex: 1, type: "number" },
];

const rows = [
  { id: 1, asset: "ETH", chain: "Ethereum", balance: 2.4521 },
  { id: 2, asset: "USDC", chain: "Arbitrum", balance: 1500.0 },
  { id: 3, asset: "WBTC", chain: "Ethereum", balance: 0.025 },
  { id: 4, asset: "STETH", chain: "Ethereum", balance: 1.8 },
];

const meta = {
  title: "EI App/TradeAggregator/WalletsTable",
  component: WalletsTable,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: "100%", padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    columns,
    rows,
  },
} satisfies Meta<typeof WalletsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

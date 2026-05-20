import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import CustomNoWalletOverlay from "./CustomNoWalletOverlay";

// `CustomNoWalletOverlay` is a DataGrid `noRowsOverlay` slot used on the
// wallet-bound tables (positions, portfolio, etc.) when the user has not
// saved a wallet address yet. It includes a pulsing CTA that routes to
// `/profile/wallets`. The story wraps the overlay in an empty DataGrid so
// the `GridOverlay` positioning context is satisfied.

const meta = {
  title: "EI App/Components/CustomNoWalletOverlay",
  component: CustomNoWalletOverlay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Empty-state overlay for the DataGrid-backed wallet tables. Rendered when the user has not yet saved a wallet; clicking the CTA navigates to the wallets profile tab.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 520, height: 360 }}>
        <DataGrid
          rows={[]}
          columns={[{ field: "asset", headerName: "Asset", flex: 1 }]}
          slots={{ noRowsOverlay: () => <Story /> }}
        />
      </Box>
    ),
  ],
} satisfies Meta<typeof CustomNoWalletOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

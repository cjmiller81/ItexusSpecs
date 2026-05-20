import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import CustomSelectWalletOverlay from "./CustomSelectWalletOverlay";

// `CustomSelectWalletOverlay` is the DataGrid `noRowsOverlay` companion to
// `CustomNoWalletOverlay` — used when the user has saved wallets but has not
// yet chosen one for the current table view. The story wraps the overlay in
// an empty DataGrid so the `GridOverlay` positioning context is satisfied.

const meta = {
  title: "EI App/Components/CustomSelectWalletOverlay",
  component: CustomSelectWalletOverlay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Empty-state overlay shown when the user has saved wallets but the active table requires picking one. Pairs with `CustomNoWalletOverlay` for the zero-wallets branch.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 520, height: 320 }}>
        <DataGrid
          rows={[]}
          columns={[{ field: "asset", headerName: "Asset", flex: 1 }]}
          slots={{ noRowsOverlay: () => <Story /> }}
        />
      </Box>
    ),
  ],
} satisfies Meta<typeof CustomSelectWalletOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

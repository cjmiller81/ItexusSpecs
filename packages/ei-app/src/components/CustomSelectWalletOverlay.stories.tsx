import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DataGrid } from "@mui/x-data-grid";

import CustomSelectWalletOverlay from "./CustomSelectWalletOverlay";

// `CustomSelectWalletOverlay` is the DataGrid `noRowsOverlay` companion to
// `CustomNoWalletOverlay`. See that story file for a deep comment on why
// the wrapper has to be a fixed-pixel `div` + a non-flex DataGrid column
// (avoids the `useResizeContainer` warning and runaway column flex loop).

const meta = {
  title: "EI App/Components/CustomSelectWalletOverlay",
  component: CustomSelectWalletOverlay,
  parameters: {
    layout: "padded",
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
      <div style={{ width: 520 }}>
        <DataGrid
          autoHeight
          rows={[]}
          columns={[{ field: "asset", headerName: "Asset", width: 520 }]}
          disableVirtualization
          disableColumnMenu
          disableColumnSelector
          hideFooter
          slots={{ noRowsOverlay: () => <Story /> }}
          sx={{ "--DataGrid-overlayHeight": "320px" }}
        />
      </div>
    ),
  ],
} satisfies Meta<typeof CustomSelectWalletOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

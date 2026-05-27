import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DataGrid } from "@mui/x-data-grid";

import CustomNoWalletOverlay from "./CustomNoWalletOverlay";

// `CustomNoWalletOverlay` is a DataGrid `noRowsOverlay` slot used on the
// wallet-bound tables (positions, portfolio, etc.) when the user has not
// saved a wallet address yet. It includes a pulsing CTA that routes to
// `/profile/wallets`.
//
// `GridOverlay` reads from `GridRootPropsContext` (via `useGridRootProps`),
// so the story must mount a real DataGrid. The grid is configured with:
//   - `autoHeight` so it sizes itself instead of running `useResizeContainer`
//     against the parent (which would otherwise log
//     "useResizeContainer - parent ... has an empty height" on first paint),
//   - `--DataGrid-overlayHeight` to control how tall the no-rows area is,
//   - fixed pixel column width (no `flex` metric, which earlier caused a
//     ResizeObserver feedback loop that grew the grid horizontally),
//   - virtualization + column menus disabled to remove other measurement
//     work that can re-emit size updates.

const meta = {
  title: "EI App/Components/CustomNoWalletOverlay",
  component: CustomNoWalletOverlay,
  parameters: {
    layout: "padded",
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
          sx={{ "--DataGrid-overlayHeight": "360px" }}
        />
      </div>
    ),
  ],
} satisfies Meta<typeof CustomNoWalletOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";
import { BasicTable } from "../../components/DataDisplay";
import type { Wallet } from "../../models";
import { getDexWalletsColumns } from "./DexWalletsTableColumnsDefs";

const rows: Wallet[] = [
  {
    walletId: "d1",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    walletName: "DEX primary",
    isValid: true,
    isPersonal: true,
    chainAssets: [],
  },
  {
    walletId: "d2",
    address: "0x000000000000000000000000000000000000dEaD",
    walletName: "Tracked",
    isValid: true,
    isPersonal: false,
    chainAssets: [],
  },
];

function DexWalletsColumnsDemo({ isXL }: { isXL: boolean }) {
  const columns = useMemo(
    () =>
      getDexWalletsColumns({
        handleSaveClick: () => {},
        handleEditClick: () => {},
        handleCancelClick: () => {},
        handleDeleteClick: () => {},
        onExpandClick: () => {},
        gridRowModesModel: {},
        expandedRows: [],
        isXL,
      }),
    [isXL],
  );

  return (
    <div style={{ height: 360, width: "100%", maxWidth: 960 }}>
      <BasicTable
        rows={rows}
        columns={columns}
        getRowId={r => r.walletId}
      />
    </div>
  );
}

const meta: Meta<typeof DexWalletsColumnsDemo> = {
  title: "MyWallets/DexWalletsTableColumnDefs",
  component: DexWalletsColumnsDemo,
  argTypes: {
    isXL: { control: "boolean" },
  },
  args: {
    isXL: true,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`getDexWalletsColumns` — same wallet columns as CEX-style table with breakpoint-aware flex widths (`isXL`).",
      },
    },
  },
  tags: ["autodocs"],
  render: args => <DexWalletsColumnsDemo isXL={args.isXL} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactBreakpoint: Story = {
  args: { isXL: false },
};

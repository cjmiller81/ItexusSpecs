import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";
import { BasicTable } from "../../components/DataDisplay";
import type { Wallet } from "../../models";
import { getWalletsColumns } from "./WalletsTableColumnsDefs";

const rows: Wallet[] = [
  {
    walletId: "w1",
    address: "0x1234567890123456789012345678901234567890",
    walletName: "Main vault",
    isValid: true,
    isPersonal: true,
    chainAssets: [],
  },
  {
    walletId: "w2",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    walletName: "Public watch",
    isValid: true,
    isPersonal: false,
    chainAssets: [],
  },
];

function WalletsColumnsDemo() {
  const columns = useMemo(
    () =>
      getWalletsColumns({
        handleSaveClick: () => {},
        handleEditClick: () => {},
        handleCancelClick: () => {},
        handleDeleteClick: () => {},
        onExpandClick: () => {},
        gridRowModesModel: {},
        expandedRows: [],
      }),
    [],
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

const meta: Meta<typeof WalletsColumnsDemo> = {
  title: "MyWallets/WalletsTableColumnDefs",
  component: WalletsColumnsDemo,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`getWalletsColumns` — address, editable label, personal/public indicator, row actions, and expand control (handlers are no-ops in this demo).",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <WalletsColumnsDemo />,
};

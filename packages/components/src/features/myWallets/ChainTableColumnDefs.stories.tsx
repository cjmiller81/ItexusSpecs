import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";
import { BasicTable } from "../../components/DataDisplay";
import { getChainNamesColumns } from "./ChainTableColumnDefs";

interface KrakenBalanceRow {
  asset: string;
  balance: number;
}

const rows: KrakenBalanceRow[] = [
  { asset: "XXBT", balance: 0.042 },
  { asset: "ZUSD", balance: 1250.5 },
];

function ChainBalancesDemo() {
  const columns = useMemo(() => getChainNamesColumns(), []);
  return (
    <div style={{ height: 320, width: "100%", maxWidth: 520 }}>
      <BasicTable
        rows={rows}
        columns={columns}
        getRowId={r => r.asset}
      />
    </div>
  );
}

const meta: Meta<typeof ChainBalancesDemo> = {
  title: "MyWallets/ChainTableColumnDefs",
  component: ChainBalancesDemo,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "`getChainNamesColumns` — asset + amount columns for expandable Kraken balance tables.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ChainBalancesDemo />,
};

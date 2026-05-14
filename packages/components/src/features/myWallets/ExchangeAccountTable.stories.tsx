import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo, useState } from "react";
import type { GridRowId } from "@mui/x-data-grid";
import { fn } from "storybook/test";
import { BasicTable } from "../../components/DataDisplay";
import type { IExchange } from "../../models";
import { getExchangeAccountColumns } from "./ExchangeAccountTable";

const exchangeRows: IExchange[] = [
  { exchange_id: "kraken-1", name: "Primary Kraken", apiKey: "••••", apiSecret: "••••" },
  { exchange_id: "coinbase-1", name: "Coinbase trading", apiKey: "••••", apiSecret: "••••" },
];

function ExchangeAccountTableDemo() {
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
  const columns = useMemo(
    () =>
      getExchangeAccountColumns({
        handleEditClick: fn(),
        handleDeleteClick: fn(),
        onExpandClick: (id, expanded) => {
          setExpandedRows(expanded ? [id] : []);
        },
        expandedRows,
      }),
    [expandedRows],
  );

  return (
    <div style={{ height: 360, width: "100%", maxWidth: 720 }}>
      <BasicTable
        rows={exchangeRows}
        columns={columns}
        getRowId={row => row.exchange_id}
      />
    </div>
  );
}

const meta = {
  title: "MyWallets/ExchangeAccountTable",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`getExchangeAccountColumns` — name, row actions (delete), and expand affordance for CEX account grids.",
      },
    },
  },
  tags: ["autodocs"],
  component: ExchangeAccountTableDemo,
} satisfies Meta<typeof ExchangeAccountTableDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ExchangeAccountTableDemo />,
};

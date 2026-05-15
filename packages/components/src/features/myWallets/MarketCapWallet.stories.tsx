import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { BasicTableProps } from "../../components/DataDisplay/BasicTable/BasicTable";
import type { GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { MarketCapWallet } from "./MarketCapWallet";

interface Row {
  id: number;
  walletName: string;
  weightPct: number;
}

const columns: GridColDef<Row>[] = [
  { field: "walletName", headerName: "Wallet", flex: 1, minWidth: 160 },
  {
    field: "weightPct",
    headerName: "Weight %",
    type: "number",
    flex: 0.6,
    minWidth: 100,
    valueFormatter: (params: GridValueFormatterParams<number>) =>
      params.value != null ? `${Number(params.value).toFixed(1)}%` : "",
  },
];

const rows: Row[] = [
  { id: 1, walletName: "Alpha vault", weightPct: 42.5 },
  { id: 2, walletName: "Beta indexer", weightPct: 33.0 },
  { id: 3, walletName: "Gamma LP", weightPct: 24.5 },
];

const meta: Meta<BasicTableProps> = {
  title: "MyWallets/MarketCapWallet",
  component: MarketCapWallet,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`BasicTable` (`DataGrid`) styled for investing index / market-cap screens — scroll bounds, editing-row border treatment, and primary-tinted wallet-name cell when editing.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div style={{ height: 420, width: "100%", maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows,
    columns,
    getRowId: (r: Row) => r.id,
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    columns,
    getRowId: (r: Row) => r.id,
  },
};

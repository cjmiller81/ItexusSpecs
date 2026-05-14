import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GridColDef } from "@mui/x-data-grid";
import { BasicTable } from "./BasicTable";

interface WalletRow {
  id: number;
  chain: string;
  address: string;
  balance: number;
  valueUsd: number;
}

const columns: GridColDef<WalletRow>[] = [
  { field: "chain", headerName: "Chain", flex: 1, minWidth: 100 },
  { field: "address", headerName: "Address", flex: 2, minWidth: 200 },
  {
    field: "balance",
    headerName: "Balance",
    type: "number",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 4 }),
  },
  {
    field: "valueUsd",
    headerName: "Value (USD)",
    type: "number",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
  },
];

const chains = ["Ethereum", "Arbitrum", "Optimism", "Base", "Polygon", "Solana"];
const truncatedAddress = (i: number) => `0x${i.toString(16).padStart(4, "0")}…${(i * 7919).toString(16).slice(-4)}`;

const rows: WalletRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  chain: chains[i % chains.length],
  address: truncatedAddress(i + 1),
  balance: Math.round(Math.random() * 100000) / 100,
  valueUsd: Math.round(Math.random() * 250000) / 100,
}));

const meta = {
  title: "DataDisplay/BasicTable",
  component: BasicTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div style={{ height: 520, width: "100%", maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BasicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows,
    columns,
  },
};

export const SmallPageSize: Story = {
  args: {
    rows,
    columns,
    defaultRowsPerPage: 5,
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    columns,
  },
};

export const Loading: Story = {
  args: {
    rows: [],
    columns,
    loading: true,
  },
};

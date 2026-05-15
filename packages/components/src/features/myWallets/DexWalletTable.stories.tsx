import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GridColDef } from "@mui/x-data-grid";
import { DexWalletsTable } from "./DexWalletTable";

interface Row {
  id: number;
  label: string;
  value: string;
}

const columns: GridColDef<Row>[] = [
  { field: "label", headerName: "Wallet", flex: 1, minWidth: 140 },
  { field: "value", headerName: "Note", flex: 1, minWidth: 120 },
];

const rows: Row[] = [
  { id: 1, label: "DEX overview A", value: "Expanded layout demo" },
  { id: 2, label: "DEX overview B", value: "Sticky header styling" },
];

const meta: Meta<typeof DexWalletsTable> = {
  title: "MyWallets/DexWalletsTable",
  component: DexWalletsTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Styled `BasicTable` for DEX wallet grids — virtual scroller bounds, sticky headers, and optional expanded-row height (`$hasExpandedRows`, `$minHeight`).",
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

export const ExpandedHeight: Story = {
  args: {
    rows,
    columns,
    getRowId: (r: Row) => r.id,
    $hasExpandedRows: true,
    $minHeight: "360px",
  },
};

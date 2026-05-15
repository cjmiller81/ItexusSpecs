import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GridColDef } from "@mui/x-data-grid";
import { StyledWalletsTable } from "./WalletsTable";

interface Row {
  id: number;
  name: string;
  tag: string;
}

const columns: GridColDef<Row>[] = [
  { field: "name", headerName: "Account", flex: 1, minWidth: 160 },
  { field: "tag", headerName: "Tag", flex: 0.8, minWidth: 100 },
];

const rows: Row[] = [
  { id: 1, name: "Primary", tag: "CEX" },
  { id: 2, name: "Cold storage", tag: "Watch" },
];

const meta: Meta<typeof StyledWalletsTable> = {
  title: "MyWallets/StyledWalletsTable",
  component: StyledWalletsTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Styled `BasicTable` for CEX / saved-wallet grids (editing row chrome, scroll, footer height).",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div style={{ height: 400, width: "100%", maxWidth: 720 }}>
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

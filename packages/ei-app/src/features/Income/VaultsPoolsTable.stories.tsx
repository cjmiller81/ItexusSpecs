import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import { VaultsPoolsTable } from "./VaultsPoolsTable";
import { vaultsFixture } from "../../mocks/tablesHandlers";

const dataSource = new DataSource({
  store: new ArrayStore({
    key: "id",
    data: vaultsFixture,
  }),
  paginate: true,
  pageSize: 10,
});

const meta = {
  title: "EI App/Income/VaultsPoolsTable",
  component: VaultsPoolsTable,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: "100%", padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    loading: false,
    onUpdate: () => {},
    dataSource: dataSource as never,
  },
} satisfies Meta<typeof VaultsPoolsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import { DefiPoolsTable } from "./DefiPoolsTable";
import { poolFixtures, dexsFixture } from "../../mocks/tablesHandlers";

const dataSource = new DataSource({
  store: new ArrayStore({
    key: "pool",
    data: poolFixtures,
  }),
  paginate: true,
  pageSize: 10,
});

const meta = {
  title: "EI App/Income/DefiPoolsTable",
  component: DefiPoolsTable,
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
    dexs: dexsFixture,
    chains: ["Ethereum", "Arbitrum", "Optimism"],
    categories: ["Liquid Staking", "Lending", "DEX"],
    projects: ["lido", "aave", "curve"],
    symbols: ["STETH", "USDC", "ETH"],
  },
} satisfies Meta<typeof DefiPoolsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

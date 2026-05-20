import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import { PrefilterTokensTable } from "./PrefilterTokensTable";
import { exchangesFixture } from "../../mocks/tablesHandlers";
import allTokens from "../../mocks/data/tokens/all.json";
import type { ICoin } from "components/src/models/token/ICoin";
import type { IPlatform } from "components/src/models/token/IPlatform";
import type { ICategory } from "components/src/models/token/ICatigory";

const coinFixture = (allTokens as unknown as ICoin[]).slice(0, 25);

const chainsFixture: IPlatform[] = [
  { id: "ethereum", chain_identifier: 1, name: "Ethereum", shortname: "eth", native_coin_id: "ethereum" },
  { id: "arbitrum-one", chain_identifier: 42161, name: "Arbitrum", shortname: "arb", native_coin_id: "ethereum" },
  { id: "optimistic-ethereum", chain_identifier: 10, name: "Optimism", shortname: "opt", native_coin_id: "ethereum" },
];

const categoriesFixture: ICategory[] = [
  { category_id: "layer-1", name: "Layer 1" },
  { category_id: "stablecoins", name: "Stablecoins" },
  { category_id: "defi", name: "DeFi" },
];

const dataSource = new DataSource({
  store: new ArrayStore({
    key: "id",
    data: coinFixture,
  }),
  paginate: true,
  pageSize: 10,
});

const meta = {
  title: "EI App/Investing/PrefilterTokensTable",
  component: PrefilterTokensTable,
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
    onCurrentFilterChange: () => {},
    onSorterChanged: () => {},
    dataSource: dataSource as never,
    chains: chainsFixture,
    categories: categoriesFixture,
    exchanges: exchangesFixture,
    filterType: "market-cap",
  },
} satisfies Meta<typeof PrefilterTokensTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EqualWeight: Story = {
  args: { filterType: "equal-weight" },
};

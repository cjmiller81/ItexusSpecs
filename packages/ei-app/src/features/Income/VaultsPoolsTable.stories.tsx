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

// `dataSource` is deliberately *not* in `args`. A DevExtreme `DataSource`
// instance carries an internal `_eventsStrategy._owner` self-reference,
// which makes `JSON.stringify(args)` throw "Converting circular structure
// to JSON" when Storybook serializes args for the Docs page (source block,
// URL persistence, addon-controls table). Injecting it via `render`
// instead keeps the DataSource out of the serialized args entirely while
// still giving the component what it needs.
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
    // `null` placeholder so `Story = {}` satisfies TS; the real instance
    // is injected by `render` below. See the matching note in
    // `PrefilterTokensSection.stories.tsx`.
    dataSource: null as never,
  },
  render: args => (
    <VaultsPoolsTable
      {...args}
      dataSource={dataSource}
    />
  ),
} satisfies Meta<typeof VaultsPoolsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import PrefilterTokensSection from "./PrefilterTokensSection";
import allTokens from "../../mocks/data/tokens/all.json";
import type { ICoin } from "components/src/models/token/ICoin";

const coinFixture = (allTokens as unknown as ICoin[]).slice(0, 25);

const dataSource = new DataSource({
  store: new ArrayStore({
    key: "id",
    data: coinFixture,
  }),
  paginate: true,
  pageSize: 10,
});

// `dataSource` is deliberately *not* in `args` — see the comment in
// `DefiPoolsTable.stories.tsx`. The DevExtreme `DataSource` instance has
// internal circular references that break `JSON.stringify(args)` on the
// Docs page. Inject it via `render` instead.
const meta = {
  title: "EI App/Investing/PrefilterTokensSection",
  component: PrefilterTokensSection,
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
    persisKey: "prefilter-tokens-storybook",
    onFilterChanged: () => {},
    onSorterChanged: () => {},
    filterType: "market-cap",
    exportFileName: "market-cap-tokens",
    // `null` placeholder so individual stories can stay as `Story = {}`
    // without TS complaining that required `dataSource` is missing.
    // The real instance is injected by `render` below, so the value here
    // is never actually rendered — it only exists to satisfy the type and
    // serialize cleanly to JSON for the Docs page.
    dataSource: null as unknown as DataSource,
  },
  render: args => (
    <PrefilterTokensSection
      {...args}
      dataSource={dataSource}
    />
  ),
} satisfies Meta<typeof PrefilterTokensSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

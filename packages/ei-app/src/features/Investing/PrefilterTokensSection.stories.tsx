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
    dataSource: dataSource as never,
    onFilterChanged: () => {},
    onSorterChanged: () => {},
    filterType: "market-cap",
    exportFileName: "market-cap-tokens",
  },
} satisfies Meta<typeof PrefilterTokensSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

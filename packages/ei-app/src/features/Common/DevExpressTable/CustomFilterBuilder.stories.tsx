import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import type { IPrefilterTokensFilterValues } from "components/src/models/token/IPrefilterTokensFilterValues";

import CustomFilterBuilder from "./CustomFilterBuilder";
import { filterBuilderFields } from "@/constants/PrefilterTokensTable";
import { defiFilterBuilderFields } from "@/features/Income/tableConstants";
import { LIQUIDITY_POOL } from "@/constants/prefilterKeys";
import DevextremeThemeProvider from "@/Layouts/DevextremeThemeProvider";

const predefinedFiltersFixture: IPrefilterTokensFilterValues[] = [
  {
    id: "story-filter-public",
    name: "Large cap focus",
    filter: [["mCap", ">", 1_000_000_000]],
    isPublic: true,
    filterType: "market-cap",
  },
  {
    id: "story-filter-private",
    name: "My ETH watchlist",
    filter: [["sym", "contains", "ETH"]],
    isPublic: false,
    filterType: "market-cap",
  },
];

const poolFiltersFixture: IPrefilterTokensFilterValues[] = [
  {
    id: "story-pool-filter",
    name: "High TVL pools",
    filter: [["tvlUsd", ">", 10_000_000]],
    isPublic: true,
    filterType: LIQUIDITY_POOL,
  },
];

const sharedCallbacks = {
  onCreateFilter: () => {},
  onUpdateFilter: () => {},
  onDeleteFilter: () => {},
  onDisableFilter: () => {},
  onApply: () => {},
};

const meta = {
  title: "EI App/Common/CustomFilterBuilder",
  component: CustomFilterBuilder,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <DevextremeThemeProvider>
        <Box sx={{ width: "100%", padding: 2 }}>
          <Story />
        </Box>
      </DevextremeThemeProvider>
    ),
  ],
  args: {
    ...sharedCallbacks,
    predefinedFilters: [],
    filterLoading: false,
    filterDeletingLoading: false,
    filterToApply: null,
  },
} satisfies Meta<typeof CustomFilterBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MarketCapTokens: Story = {
  args: {
    filterType: "market-cap",
    filterBuilderFields,
    predefinedFilters: predefinedFiltersFixture,
  },
};

export const LiquidityPools: Story = {
  args: {
    filterType: LIQUIDITY_POOL,
    filterBuilderFields: defiFilterBuilderFields,
    predefinedFilters: poolFiltersFixture,
  },
};

export const EmptyFilters: Story = {
  args: {
    filterType: "market-cap",
    filterBuilderFields,
    predefinedFilters: [],
  },
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CategoryFiltersSection } from "./CategoryFiltersSection";
import type { CategoryFilterType } from "../types/filter";

// `CategoryFiltersSection` is the DeFi filter pill row used on the Income
// pages. The top row is the main category tab (`All DeFi`, `Lending`, …); the
// card below it surfaces the quick-filter chips for that tab. Selecting a
// chip emits an `onFilterChange(filter, context)` callback with a JSON
// filter the parent feeds into its table query.

const meta = {
  title: "EI App/Components/CategoryFiltersSection",
  component: CategoryFiltersSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Two-tier category pill picker for the Income / DeFi pages. Self-contained state — call sites only need to react to `onFilterChange` to update their queries.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onFilterChange: () => {},
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, width: "min(960px, 100%)" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof CategoryFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmittedFilter: Story = {
  name: "With emitted filter",
  render: args => {
    function CategoryFiltersWithReadout() {
      const [filter, setFilter] = useState<unknown[] | null>(null);
      const [context, setContext] = useState<CategoryFilterType | null>(null);
      return (
        <Stack spacing={2}>
          <CategoryFiltersSection
            {...args}
            onFilterChange={(nextFilter, nextContext) => {
              setFilter(nextFilter);
              setContext(nextContext);
            }}
          />
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "action.hover",
              fontFamily: "monospace",
              fontSize: 12,
            }}>
            <Typography
              variant="caption"
              color="text.secondary">
              onFilterChange payload
            </Typography>
            <pre style={{ margin: 0 }}>{JSON.stringify({ filter, context }, null, 2)}</pre>
          </Box>
        </Stack>
      );
    }
    return <CategoryFiltersWithReadout />;
  },
};

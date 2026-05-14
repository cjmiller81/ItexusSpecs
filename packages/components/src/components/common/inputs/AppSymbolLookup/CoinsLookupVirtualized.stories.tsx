import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  CoinsLookupVirtualized,
  type OnFetchCoinsResponse,
  type CoinsLookupVirtualizedProps,
} from "./CoinsLookupVirtualized";
import type { CoinsLookUpOption } from "./CoinsLookup";

// CoinsLookupVirtualized wraps CoinsLookup with `usePaginatedVirtualList`,
// the same pagination hook the symbol picker uses. The Top N quick-select
// rows still appear in the popper but bulk-select against the *currently
// loaded buffer* — pages that haven't been fetched yet are placeholders.
//
// Stories below back `onFetchPage` with a synthetic generator. In
// production this is wired to `/api/coins?page=N` (or similar). Selection
// state is owned by the story so reviewers can see the button copy
// transition through "Coins" / "{label}" / "{n} selected".

const TOTAL_COINS = 1000;

const generateCoins = (page: number, pageSize: number): CoinsLookUpOption[] => {
  const start = page * pageSize;
  const end = Math.min(start + pageSize, TOTAL_COINS);
  return Array.from({ length: end - start }, (_, i) => {
    const idx = start + i;
    return {
      id: `coin-${idx}`,
      label: `COIN${idx} - Coin Number ${idx}`,
      iconUrl: null,
    };
  });
};

const ControlledRender = (args: CoinsLookupVirtualizedProps) => {
  const [value, setValue] = useState<CoinsLookUpOption[]>([]);
  return (
    <Box sx={{ width: 220 }}>
      <CoinsLookupVirtualized
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as CoinsLookUpOption[])}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}>
        Selected: {value.length} · {TOTAL_COINS} total
      </Typography>
    </Box>
  );
};

const meta = {
  title: "Inputs/AppSymbolLookup/CoinsLookupVirtualized",
  component: CoinsLookupVirtualized,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Paged virtualization wrapper around `CoinsLookup`. Fetches one page at a time as the user scrolls; Top N quick-selects operate against whatever has been loaded into the buffer.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: false,
    pageSize: 50,
    onChange: fn(),
    onFetchPage: async (page: number): Promise<OnFetchCoinsResponse> => ({
      items: generateCoins(page, 50),
      totalCount: TOTAL_COINS,
    }),
  },
  argTypes: {
    pageSize: { control: { type: "number", min: 10, step: 10 } },
  },
} satisfies Meta<typeof CoinsLookupVirtualized>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => <ControlledRender {...args} />,
};

// 400ms artificial delay per page so reviewers can see the placeholder
// rows render before each batch arrives.
export const SlowPages: Story = {
  args: {
    onFetchPage: async (page: number): Promise<OnFetchCoinsResponse> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { items: generateCoins(page, 50), totalCount: TOTAL_COINS };
    },
  },
  render: args => <ControlledRender {...args} />,
};

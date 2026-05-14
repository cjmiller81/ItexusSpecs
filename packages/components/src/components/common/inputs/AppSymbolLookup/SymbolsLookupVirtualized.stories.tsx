import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  SymbolsLookupVirtualized,
  type OnFetchResponse,
  type SymbolsLookupVirtualizedProps,
} from "./SymbolsLookupVirtualized";
import type { LookUpOption } from "./SymbolsLookup";

// SymbolsLookupVirtualized wraps SymbolLookup with `usePaginatedVirtualList`.
// The caller provides `pageSize` and an async `onFetchPage(pageNumber)` —
// the hook fills in placeholder rows until each page resolves and only
// fetches pages the listbox actually scrolls into view.
//
// Stories below back `onFetchPage` with a synthetic data generator so
// reviewers can scroll a 1000-item dataset without an MSW handler. Add a
// short delay to the resolved promise to exercise the placeholder render
// before each batch arrives.

const TOTAL_ITEMS = 1000;

const generateItems = (page: number, pageSize: number): LookUpOption[] => {
  const start = page * pageSize;
  const end = Math.min(start + pageSize, TOTAL_ITEMS);
  return Array.from({ length: end - start }, (_, i) => {
    const idx = start + i;
    return {
      id: `tok-${idx}`,
      label: `TOK${idx} - Token ${idx}`,
      iconUrl: null,
    };
  });
};

const ControlledRender = (args: SymbolsLookupVirtualizedProps) => {
  const [value, setValue] = useState<LookUpOption | null>(null);
  const [inputValue, setInputValue] = useState("");
  return (
    <Box sx={{ width: 360 }}>
      <SymbolsLookupVirtualized
        {...args}
        value={value}
        inputValue={inputValue}
        onChange={(_, newValue) => setValue(newValue)}
        onInputChange={(_, newInput) => setInputValue(newInput)}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}>
        Selected: {value ? `${value.label} (${value.id})` : "none"} · {TOTAL_ITEMS} total items
      </Typography>
    </Box>
  );
};

const meta = {
  title: "Inputs/AppSymbolLookup/SymbolsLookupVirtualized",
  component: SymbolsLookupVirtualized,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Paged virtualization wrapper around `SymbolLookup`. Stories back `onFetchPage` with a synthetic generator so the listbox can scroll a 1000-item dataset without a real network round-trip — production callers swap the generator for an HTTP request, typically against `/api/symbols?page=N`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Symbol",
    pageSize: 50,
    onChange: fn(),
    onInputChange: fn(),
    onFetchPage: async (page: number): Promise<OnFetchResponse> => ({
      items: generateItems(page, 50),
      totalCount: TOTAL_ITEMS,
    }),
  },
  argTypes: {
    label: { control: "text" },
    pageSize: { control: { type: "number", min: 10, step: 10 } },
  },
} satisfies Meta<typeof SymbolsLookupVirtualized>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1000-item synthetic dataset; pages resolve immediately so reviewers see
// the populated rows on first open.
export const Default: Story = {
  render: args => <ControlledRender {...args} />,
};

// Inject a 400ms delay per page so the filler placeholders render long
// enough to be visible while scrolling.
export const SlowPages: Story = {
  args: {
    onFetchPage: async (page: number): Promise<OnFetchResponse> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { items: generateItems(page, 50), totalCount: TOTAL_ITEMS };
    },
  },
  render: args => <ControlledRender {...args} />,
};

// Smaller pageSize means more frequent fetches as the user scrolls — a
// useful sanity check that the hook re-keys correctly per inputValue.
export const SmallPages: Story = {
  args: {
    pageSize: 20,
    onFetchPage: async (page: number): Promise<OnFetchResponse> => ({
      items: generateItems(page, 20),
      totalCount: TOTAL_ITEMS,
    }),
  },
  render: args => <ControlledRender {...args} />,
};

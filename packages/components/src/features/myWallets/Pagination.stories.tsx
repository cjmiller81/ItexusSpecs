import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import { fn } from "storybook/test";
import Pagination, { type PaginationProps } from "./Pagination";

// Pagination is a stand-alone presentational pager used by the
// transaction-history pane. It builds a `1 … N` window around the
// current page (size controlled by `maxWindow`) and emits page numbers
// through `onPageChange`. The component has no i18n, no Redux, and no
// runtime dependencies beyond React inline styles.
const meta = {
  title: "MyWallets/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pure pager. Renders prev/next + a windowed page list with collapsed ellipses. Re-emits the clicked page via `onPageChange`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    totalItems: { control: { type: "number" } },
    itemsPerPage: { control: { type: "number" } },
    maxWindow: { control: { type: "number", min: 0 } },
    onPageChange: { action: "page-change" },
  },
  args: {
    onPageChange: fn(),
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, backgroundColor: "#0a0a0a", borderRadius: 1 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Static stories — useful for visual regressions of each state.
export const FirstPage: Story = {
  args: {
    page: 1,
    totalPages: 5,
    totalItems: 47,
    itemsPerPage: 10,
    maxWindow: 2,
  },
};

export const MiddlePage: Story = {
  args: {
    page: 6,
    totalPages: 12,
    totalItems: 119,
    itemsPerPage: 10,
    maxWindow: 2,
  },
};

export const LastPage: Story = {
  args: {
    page: 12,
    totalPages: 12,
    totalItems: 119,
    itemsPerPage: 10,
    maxWindow: 2,
  },
};

// Single-page edge case — implementation returns an empty items array,
// so only the disabled prev/next arrows render.
export const SinglePage: Story = {
  args: { page: 1, totalPages: 1, totalItems: 4, itemsPerPage: 10 },
};

export const WithoutItemCounts: Story = {
  args: { page: 3, totalPages: 8, maxWindow: 2 },
};

// Live-controlled variant — clicking pages actually advances the
// current page; useful when QA-ing the windowing math by hand.
const ControlledRender = (args: PaginationProps) => {
  const [page, setPage] = useState(args.page);
  return (
    <Pagination
      {...args}
      page={page}
      onPageChange={p => {
        setPage(p);
        args.onPageChange(p);
      }}
    />
  );
};

export const Controlled: Story = {
  args: {
    page: 1,
    totalPages: 15,
    totalItems: 142,
    itemsPerPage: 10,
    maxWindow: 2,
  },
  render: args => <ControlledRender {...args} />,
};

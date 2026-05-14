import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { SidebarItem } from "./SidebarItem";
import type { SidebarListItem } from "./types";

// SidebarItem reads the current route via next/router's useRouter() to
// compute its selected state (item.href === router.asPath). The Storybook
// next.js framework mocks the router; stories can drive router.asPath via
// `parameters.nextjs.router.asPath` — see the `Selected` story.

const baseLeafItem: SidebarListItem & { open: boolean } = {
  title: "Trade Aggregator",
  icon: <ShowChartIcon />,
  href: "/trade-aggregator/cex",
  open: false,
};

const branchItem: SidebarListItem & { open: boolean } = {
  title: "Trade Aggregator",
  icon: <ShowChartIcon />,
  open: true,
  children: [
    { title: "CEX", href: "/trade-aggregator/cex" },
    { title: "DEX", href: "/trade-aggregator/dex" },
    { title: "Derivatives", href: "/trade-aggregator/derivatives", disabled: true },
  ],
};

const meta = {
  title: "Sidebar/SidebarItem",
  component: SidebarItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single sidebar entry. Can be a plain link (leaf) or a collapsible group with nested children. Selected state derives from `next/router`'s `asPath` — use `parameters.nextjs.router.asPath` to drive it from a story.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isSidebarOpened: { control: "boolean" },
    open: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ bgcolor: "#363640", width: 256, p: 1 }}>
        <List component="nav">
          <Story />
        </List>
      </Box>
    ),
  ],
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeafItem: Story = {
  args: {
    item: baseLeafItem,
    isSidebarOpened: true,
    open: false,
    setOpen: fn(),
  },
};

// When the sidebar is collapsed, only the icon should be visible — no label,
// no expand chevron, no children.
export const SidebarCollapsed: Story = {
  args: {
    item: { ...baseLeafItem, icon: <AccountBalanceIcon /> },
    isSidebarOpened: false,
    open: false,
    setOpen: fn(),
  },
};

// Drives the selected state through the mocked next/router. The item's
// href matches router.asPath so the left border + tint render.
export const Selected: Story = {
  parameters: {
    nextjs: {
      router: { asPath: "/wallets" },
    },
  },
  args: {
    item: {
      title: "Wallets",
      icon: <AccountBalanceIcon />,
      href: "/wallets",
      open: false,
    },
    isSidebarOpened: true,
    open: false,
    setOpen: fn(),
  },
};

// useState wires the expand/collapse toggle so the chevron rotates and the
// child list actually animates on click in the canvas.
export const WithChildren: Story = {
  args: {
    item: branchItem,
    isSidebarOpened: true,
    open: true,
    setOpen: fn(),
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <SidebarItem
        {...args}
        item={{ ...args.item, open }}
        open={open}
        setOpen={setOpen}
      />
    );
  },
};

// SidebarItem hardcodes a "Coming Soon" badge for items whose title is
// "Open Source" or "Updates" and have children. This story exercises that
// branch.
export const ComingSoonBadge: Story = {
  args: {
    item: { ...branchItem, title: "Open Source" },
    isSidebarOpened: true,
    open: true,
    setOpen: fn(),
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SettingsIcon from "@mui/icons-material/Settings";
import { SidebarSection } from "./SidebarSection";
import type { SidebarListItem } from "./types";

// SidebarSection renders a list of SidebarItems. Branch items (those with
// children) need their expand/collapse state tracked by the parent, which
// is why `onSetItemOpen(title, open)` is on the public API. The interactive
// story wires that up to a useState-backed map so clicking actually
// expands/collapses the relevant branch.

const platformItems: (SidebarListItem & { open?: boolean })[] = [
  { title: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  {
    title: "Trade Aggregator",
    icon: <ShowChartIcon />,
    children: [
      { title: "CEX", href: "/trade-aggregator/cex" },
      { title: "DEX", href: "/trade-aggregator/dex" },
    ],
  },
  {
    title: "Wallets",
    icon: <AccountBalanceIcon />,
    href: "/wallets",
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    href: "/settings",
  },
];

const meta = {
  title: "Sidebar/SidebarSection",
  component: SidebarSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Section of related sidebar entries plus the special `isDisclaimer` branch for legal text at the bottom of the sidebar. Branch items' open state is owned by the parent — stories track it with local state via `onSetItemOpen`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sectionName: { control: "text" },
    open: { control: "boolean" },
    isDisclaimer: { control: "boolean" },
    isLastInGroup: { control: "boolean" },
  },
  args: {
    sectionName: "Platform",
    open: true,
    toggleSide: fn(),
    onSetItemOpen: fn(),
    items: platformItems,
  },
  decorators: [
    Story => (
      <Box sx={{ bgcolor: "#363640", width: 256, p: 1 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof SidebarSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Drives the selected highlight via the mocked next/router. Both the
// leaf "Wallets" item (rendered inline by SidebarSection) and any selected
// child link route through useRouter().asPath.
export const ItemSelected: Story = {
  parameters: {
    nextjs: {
      router: { asPath: "/wallets" },
    },
  },
};

// When the sidebar is collapsed the section still renders, but only icons
// are visible. Branch items don't expand because Collapse is forced shut.
export const SidebarCollapsed: Story = {
  args: { open: false },
};

// Interactive variant: a useState map tracks per-item open state so
// clicking a branch (e.g. Trade Aggregator) actually toggles it.
export const InteractiveExpand: Story = {
  render: function Render(args) {
    const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
    return (
      <SidebarSection
        {...args}
        items={args.items.map(item => ({ ...item, open: openMap[item.title] }))}
        onSetItemOpen={(title, open) => setOpenMap(prev => ({ ...prev, [title]: open }))}
      />
    );
  },
};

// Disclaimer mode bypasses the items array entirely and renders the legal
// blurb from APP_CONSTANTS. `items` is still required by the prop type so
// we pass an empty array.
export const Disclaimer: Story = {
  args: {
    sectionName: "Disclaimer",
    isDisclaimer: true,
    items: [],
  },
};

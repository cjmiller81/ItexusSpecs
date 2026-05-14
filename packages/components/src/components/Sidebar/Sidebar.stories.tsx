import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import InsightsIcon from "@mui/icons-material/Insights";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Sidebar } from "./Sidebar";
import type { SidebarItems } from "./types";

// Sidebar composes StyledDrawer + StyledDrawerHeader + SidebarSection. Each
// of those is already storied in isolation; the goal here is to verify that
// the composition renders correctly when `open` toggles and that disclaimer
// rows pin to the bottom.
//
// The decorator gives the Drawer some height/width so the permanent variant
// (which the component hardcodes via `variant="permanent"`) has room to lay
// out. The Drawer takes its full `MuiDrawer-root` width from theme tokens.
const sampleItems: SidebarItems[] = [
  {
    title: "Home",
    sidebarListItems: [{ title: "Dashboard", icon: <HomeIcon />, href: "/dashboard" }],
  },
  {
    title: "Analytics",
    sidebarListItems: [
      {
        title: "Investing",
        icon: <InsightsIcon />,
        children: [
          { title: "Strategies", href: "/analytics/investing/strategies" },
          { title: "Performance", href: "/analytics/investing/performance" },
        ],
      },
      {
        title: "Wallets",
        icon: <AccountBalanceWalletIcon />,
        href: "/analytics/wallets",
      },
    ],
  },
  {
    title: "Tools",
    sidebarListItems: [
      { title: "Trade aggregator", icon: <SwapHorizIcon />, href: "/tools/trade" },
      { title: "Billing", icon: <ReceiptLongIcon />, href: "/tools/billing" },
    ],
  },
  {
    title: "Disclaimer",
    isDisclaimer: true,
    sidebarListItems: [{ title: "Beta — not financial advice", icon: <HelpOutlineIcon /> }],
  },
];

const meta = {
  title: "Sidebar/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composition of StyledDrawer, StyledDrawerHeader, and SidebarSection. Includes a SimpleBar-managed scroll area for overflowing sections and pins disclaimer rows to the bottom when `open` is true.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: true,
    sidebarItems: sampleItems,
    toggleSide: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ position: "relative", height: "100vh", display: "flex" }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>{/* Page content stub so the drawer has a sibling to push against. */}</Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Collapsed: Story = {
  args: { open: false },
};

// A selected route is driven by `parameters.nextjs.router.asPath`, which
// SidebarItem reads via useRouter() to decide which list item is "active".
export const ItemSelected: Story = {
  parameters: {
    nextjs: {
      router: { asPath: "/analytics/wallets" },
    },
  },
};

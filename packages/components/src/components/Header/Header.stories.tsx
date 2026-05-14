import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import { Header } from "./Header";

// Header composes StyledAppBar, ThemeToggler, UserMenu, and ApiUsageStatus.
// All sub-components are storied in isolation; the goal here is to verify
// the full top-bar layout and to exercise the session-expiry countdown
// branch by overriding `parameters.oryContext.session.expires_at`.
//
// The AppBar uses `position: "fixed"`, so the decorator gives it a sized
// container that scopes the fixed layout to the story preview.
const meta = {
  title: "Header/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Top app bar with sidebar toggle, title, ApiUsageStatus, ThemeToggler, and UserMenu. When the active Ory session is within 30 minutes of expiry, a countdown chip with a Renew button appears.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Elan Insights",
    mode: "dark",
    defaultAvatar: "https://i.pravatar.cc/96?img=12",
    toggleSide: fn(),
    toggleTheme: fn(),
    logOut: fn(),
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["dark", "light"],
    },
    title: { control: "text" },
    avatarUrl: { control: "text" },
    open: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ position: "relative", minHeight: 240, bgcolor: "background.default" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default session has ~1 hour left, so the countdown chip stays hidden.
export const Default: Story = {};

// Same as Default but with the sidebar closed (drives the menu icon variant).
export const SidebarClosed: Story = {
  args: { open: false },
};

export const LightMode: Story = {
  args: { mode: "light" },
};

// Override the Ory session so it expires in 5 minutes — Header's effect
// flips `showCountdown` to true and renders the warning chip + Renew button.
export const WithSessionCountdown: Story = {
  parameters: {
    oryContext: {
      session: {
        id: "storybook-session",
        active: true,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        identity: {
          id: "storybook-identity",
          traits: {
            email: "demo@example.com",
            name: { first: "Demo", last: "User" },
            avatarUrl: "",
            newsletter: false,
          },
        },
      },
    },
  },
};

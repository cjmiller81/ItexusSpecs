import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import { UserMenu } from "./UserMenu";

// UserMenu is the avatar IconButton in the top-right of the app that opens
// a dropdown with "Profile" (a next/link to /profile) and "Log out" (calls
// the logOut callback). It uses `useTranslation("UserMenu")`; the
// preview.tsx resources block provides both keys.
//
// The dropdown menu is rendered via a MUI Portal anchored to the avatar,
// so the menu opens *outside* the story root. For the autodocs page that
// means readers should click the avatar in the Default story to see the
// dropdown.
const meta = {
  title: "Header/UserMenu",
  component: UserMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Avatar IconButton that opens a Profile / Log out dropdown. `logOut` is awaited, so async callbacks are supported.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    defaultAvatar: "https://i.pravatar.cc/96?img=12",
    logOut: fn(),
  },
  argTypes: {
    defaultAvatar: { control: "text" },
    avatarUrl: { control: "text" },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, bgcolor: "background.paper" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomAvatarUrl: Story = {
  args: {
    avatarUrl: "https://i.pravatar.cc/96?img=47",
  },
};

// When avatarUrl is empty, the Avatar falls back to defaultAvatar.
export const FallsBackToDefault: Story = {
  args: {
    avatarUrl: "",
  },
};

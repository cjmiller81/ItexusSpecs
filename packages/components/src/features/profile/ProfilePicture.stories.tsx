import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import { ProfilePicture } from "./ProfilePicture";

// ProfilePicture renders an Avatar + helper copy + an Upload button inside
// a `ProfileContainer`. Clicking Upload opens a native file picker via
// `use-file-picker` (jpg/jpeg/png, single file). When a file is selected
// the component fires `onAvatarChanged(file)` — the parent is responsible
// for posting it to Ory's settings flow.
//
// Copy comes from the `ProfilePicture` i18n namespace added in
// preview.tsx. The container picks a beige `contentBgColor` in light mode.
const meta = {
  title: "Profile/ProfilePicture",
  component: ProfilePicture,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Section that displays the current avatar, file-format helpers, and an Upload button that opens the OS file picker. Fires `onAvatarChanged(file: File)` when a file is selected; the loading state of the upload itself is driven by `isAvatarUploading`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onAvatarChanged: fn(),
    defaultAvatarSrc: "https://i.pravatar.cc/96?img=12",
  },
  argTypes: {
    avatarUrl: { control: "text" },
    defaultAvatarSrc: { control: "text" },
    isAvatarUploading: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 480, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ProfilePicture>;

export default meta;
type Story = StoryObj<typeof meta>;

// No `avatarUrl` — falls back to `defaultAvatarSrc`.
export const Default: Story = {};

export const WithAvatar: Story = {
  args: {
    avatarUrl: "https://i.pravatar.cc/96?img=47",
  },
};

// LoadingButton spins while `isAvatarUploading` is true. The Upload button
// label is hidden during the spinner state.
export const Uploading: Story = {
  args: {
    avatarUrl: "https://i.pravatar.cc/96?img=47",
    isAvatarUploading: true,
  },
};

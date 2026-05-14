import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AppContainer } from "./AppContainer";

// AppContainer is a thin styled `Box` that draws a 1px divider-coloured
// border with the theme's `borderRadius`. Used as the outer frame for
// every section in the profile/billing pages.
const meta = {
  title: "Containers/AppContainer",
  component: AppContainer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Bordered container primitive used as the outer frame for profile, billing, and other settings sections. Inherits border colour from `theme.palette.divider` so it stays in sync with light/dark mode.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AppContainer sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="body1">Section content.</Typography>
    </AppContainer>
  ),
};

// Common usage: nested with a Stack of related controls.
export const WithChildren: Story = {
  render: () => (
    <AppContainer sx={{ p: 3, minWidth: 320 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle1">Profile picture</Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          Upload or change your profile image. JPG or PNG, up to 2 MB.
        </Typography>
      </Stack>
    </AppContainer>
  ),
};

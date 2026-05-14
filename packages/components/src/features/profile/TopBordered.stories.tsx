import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TopBordered } from "./TopBordered";

// TopBordered is a styled `Box` with a single 1px top border. Used as the
// content surface inside ProfileContainer to visually separate the section
// header from the body.
const meta = {
  title: "Profile/TopBordered",
  component: TopBordered,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Top-bordered surface used as the content area of profile sections. Border colour follows `theme.palette.divider` so it tracks light/dark mode automatically.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TopBordered>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TopBordered sx={{ p: 2, minWidth: 320 }}>
      <Stack spacing={1}>
        <Typography variant="body2">Section body content.</Typography>
        <Typography
          variant="caption"
          color="text.secondary">
          The single top border separates this from the section&apos;s title row above.
        </Typography>
      </Stack>
    </TopBordered>
  ),
};

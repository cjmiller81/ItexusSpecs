import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { StyledDrawerHeader } from "./StyledDrawerHeader";

// StyledDrawerHeader is a styled <div> that mirrors theme.mixins.toolbar.
// In the apps it sits at the top of the Drawer to anchor the AppBar's
// collapse/expand chevron. It has no props of its own beyond standard
// HTMLDivElement attributes.

const meta = {
  title: "Sidebar/StyledDrawerHeader",
  component: StyledDrawerHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Styled `<div>` with `theme.mixins.toolbar` spread in so it matches the AppBar's minHeight. Provides a flex container with `justifyContent: flex-end` for the collapse icon.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 240, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof StyledDrawerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StyledDrawerHeader>
      <IconButton>
        <ChevronLeftIcon />
      </IconButton>
    </StyledDrawerHeader>
  ),
};

export const Empty: Story = {
  render: () => <StyledDrawerHeader />,
};

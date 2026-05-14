import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { StyledAppBar } from "./StyledAppBar";

// StyledAppBar is a thin MUI AppBar wrapper that animates width/margin
// when its `open` prop changes (used in apps with a collapsible sidebar).
// The decorator below frames it in a relative container so the AppBar's
// position: fixed behavior renders without clipping the rest of Storybook.
const meta = {
  title: "Header/StyledAppBar",
  component: StyledAppBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Styled MUI AppBar that animates width and margin transitions based on its `open` prop. Used in apps with collapsible sidebars.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box
        sx={{
          position: "relative",
          minHeight: 240,
          width: "100%",
          bgcolor: "background.default",
        }}>
        <Story />
      </Box>
    ),
  ],
  render: args => (
    <StyledAppBar
      position="static"
      {...args}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap>
          App title
        </Typography>
      </Toolbar>
    </StyledAppBar>
  ),
} satisfies Meta<typeof StyledAppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { open: false },
};

export const Open: Story = {
  args: { open: true },
};

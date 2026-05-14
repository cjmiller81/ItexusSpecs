import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import { StyledDrawer } from "./StyledDrawer";

// StyledDrawer is the MUI Drawer wrapper used by the Sidebar. It animates
// width transitions based on the `open` prop and uses the `permanent`
// variant in the apps. For stories we keep `variant="permanent"` so the
// drawer renders inline (the default `temporary` variant would render
// into a Modal portal and not show up on the canvas).

const drawerContent = (
  <Box sx={{ overflow: "hidden", color: "common.white" }}>
    <List>
      {[
        { label: "Inbox", icon: <InboxIcon /> },
        { label: "Mail", icon: <MailIcon /> },
        { label: "Settings", icon: <SettingsIcon /> },
      ].map(({ label, icon }) => (
        <ListItem
          key={label}
          disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "common.white" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

const meta = {
  title: "Sidebar/StyledDrawer",
  component: StyledDrawer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'MUI Drawer wrapper that animates its width between an `openedMixin` (240px) and a `closedMixin` (theme.spacing(5.4)) based on the `open` prop. Stories use `variant="permanent"` to render the drawer inline on the canvas.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
  args: {
    open: true,
    variant: "permanent",
  },
  decorators: [
    Story => (
      <Box sx={{ display: "flex", minHeight: 320, bgcolor: "background.default" }}>
        <Story />
      </Box>
    ),
  ],
  render: args => <StyledDrawer {...args}>{drawerContent}</StyledDrawer>,
} satisfies Meta<typeof StyledDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { open: true },
};

export const Closed: Story = {
  args: { open: false },
};

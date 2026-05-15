import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { AppToolTip } from "./AppTooltip";

const meta = {
  title: "Common/AppTooltip",
  component: AppToolTip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    open: { control: "boolean" },
    title: { control: "text" },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 6 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AppToolTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Click to copy your wallet address",
    placement: "top",
    children: <InfoOutlined />,
  },
};

export const AlwaysOpen: Story = {
  args: {
    title: "This tooltip is pinned open",
    placement: "top",
    open: true,
    children: <InfoOutlined />,
  },
};

export const Placements: Story = {
  render: () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 6,
        py: 4,
      }}>
      {(["top", "right", "bottom", "left"] as const).map(placement => (
        <AppToolTip
          key={placement}
          title={`Placement: ${placement}`}
          placement={placement}
          open>
          <InfoOutlined />
        </AppToolTip>
      ))}
    </Box>
  ),
};

export const RichContent: Story = {
  args: {
    placement: "top",
    open: true,
    title: (
      <Box sx={{ p: 0.5 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, display: "block" }}>
          Network status
        </Typography>
        <Typography
          variant="caption"
          component="div">
          Block height: 1,234,567
        </Typography>
      </Box>
    ),
    children: <InfoOutlined />,
  },
};

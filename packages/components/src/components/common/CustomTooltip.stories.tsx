import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CustomTooltip from "./CustomTooltip";

const meta = {
  title: "Common/CustomTooltip",
  component: CustomTooltip,
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
} satisfies Meta<typeof CustomTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Trade aggregator quote",
    placement: "top",
    children: <Chip label="Hover me" />,
  },
};

export const AlwaysOpen: Story = {
  args: {
    title: "Pinned-open tooltip with arrow + brand color",
    placement: "top",
    open: true,
    children: (
      <Chip
        label="Pinned"
        color="primary"
      />
    ),
  },
};

export const BelowTarget: Story = {
  args: {
    title: "Anchored below the trigger",
    placement: "bottom",
    open: true,
    children: <Chip label="Hover for details" />,
  },
};

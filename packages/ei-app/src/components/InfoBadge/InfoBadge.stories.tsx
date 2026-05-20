import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { InfoBadge } from "./InfoBadge";

// InfoBadge is a pulsing pill with a hover-revealed tooltip. The tooltip
// content is whatever React node you pass — keep stories visually distinct by
// using different content shapes (plain text, rich layout, list).

const meta = {
  title: "EI App/Components/InfoBadge",
  component: InfoBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animated info pill (linear-gradient green) with a card-shaped hover tooltip. The badge pulses subtly until hovered; the tooltip slides in with the supplied `tooltipContent`. Tooltip styling auto-adapts to the active MUI theme palette mode.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    title: "New",
    tooltipContent: "We just shipped this — hover for details.",
  },
  decorators: [
    Story => (
      <Box sx={{ p: 6, minWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof InfoBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RichTooltipContent: Story = {
  args: {
    title: "What changed?",
    tooltipContent: (
      <Stack
        spacing={1}
        sx={{ textAlign: "left" }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}>
          v2 highlights
        </Typography>
        <Typography variant="body2">
          Refreshed wallet overview, faster portfolio sync, and richer DeFi tooltips.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary">
          Hover off to dismiss.
        </Typography>
      </Stack>
    ),
  },
};

export const ShortLabel: Story = {
  args: {
    title: "Beta",
    tooltipContent: "Available to beta testers only.",
  },
};

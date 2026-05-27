import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PopupTooltip } from "./PopupTooltip";

// PopupTooltip portals its tooltip into `document.body`, which means the
// trigger's containing layout doesn't affect tooltip placement. Hover the
// trigger to reveal the panel. The component uses `react-dom/createPortal`
// and `getBoundingClientRect()` so a Storybook hover IS sufficient — no need
// for the docs viewport to fake a click.

const TriggerChip = ({ label }: { label: string }) => (
  <Box
    sx={{
      px: 2,
      py: 1,
      borderRadius: 1,
      bgcolor: "action.selected",
      display: "inline-block",
      cursor: "help",
    }}>
    <Typography variant="body2">{label}</Typography>
  </Box>
);

const meta = {
  title: "EI App/Components/PopupTooltip",
  component: PopupTooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Hover-driven tooltip that renders into a portal so it can escape `overflow: hidden` ancestors. Accepts a `title`, free-form `content`, and a side hint (`top` / `bottom` / `left` / `right`). The tooltip footer always includes the standard "For informational purposes only." disclaimer.',
      },
    },
  },
  tags: ["autodocs"],
  args: {
    title: "About this metric",
    content: "30-day rolling average of net inflows minus outflows across tracked wallets.",
    position: "top",
    maxWidth: 280,
    children: <TriggerChip label="Hover me" />,
  },
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    maxWidth: { control: { type: "number", min: 120, step: 20 } },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 8, minWidth: 360, display: "flex", justifyContent: "center" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof PopupTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RichContent: Story = {
  args: {
    title: "What does this score mean?",
    content: (
      <Stack spacing={0.5}>
        <Typography variant="body2">Composite of liquidity, volume, and price stability.</Typography>
        <Typography
          variant="caption"
          color="text.secondary">
          Higher is better. Updated every 15 minutes.
        </Typography>
      </Stack>
    ),
    children: (
      <Button
        variant="outlined"
        size="small">
        Health 87 / 100
      </Button>
    ),
  },
};

export const PositionsGallery: Story = {
  name: "Position gallery",
  render: args => (
    <Stack
      direction="row"
      spacing={6}>
      {(["top", "bottom", "left", "right"] as const).map(position => (
        <PopupTooltip
          {...args}
          key={position}
          position={position}>
          <TriggerChip label={position} />
        </PopupTooltip>
      ))}
    </Stack>
  ),
};

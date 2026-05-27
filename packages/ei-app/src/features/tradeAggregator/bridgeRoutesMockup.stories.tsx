import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { BridgeRoutesMockup } from "./bridgeRoutesMockup";

const meta = {
  title: "EI App/TradeAggregator/BridgeRoutesMockup",
  component: BridgeRoutesMockup,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: 700, padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof BridgeRoutesMockup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

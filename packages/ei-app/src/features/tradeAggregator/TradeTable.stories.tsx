import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import { TradeTable } from "./TradeTable";

const meta = {
  title: "EI App/TradeAggregator/TradeTable",
  component: TradeTable,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ width: "100%", padding: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof TradeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

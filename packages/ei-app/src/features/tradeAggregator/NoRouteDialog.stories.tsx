import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import NoRouteDialog from "./NoRouteDialog";

const meta = {
  title: "EI App/TradeAggregator/Dialogs/NoRouteDialog",
  component: NoRouteDialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => {},
  },
} satisfies Meta<typeof NoRouteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: { open: false },
};

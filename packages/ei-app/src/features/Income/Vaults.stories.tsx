import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Vaults from "./Vaults";

const meta = {
  title: "EI App/Income/Vaults",
  component: Vaults,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    persisKey: "vaults-storybook",
  },
} satisfies Meta<typeof Vaults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

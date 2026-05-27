import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import NoRouteDialog from "./NoRouteDialog";

const meta = {
  title: "EI App/TradeAggregator/Dialogs/NoRouteDialog",
  component: NoRouteDialog,
  parameters: { layout: "centered" },
  // Bound MUI Dialog's `position: fixed` backdrop to a sized container on
  // the Docs page only. On the standalone Story page the dialog renders
  // unmodified (full viewport). See `dialogDocsDecorator.tsx` for why this
  // beats the obvious `parameters.docs.story.inline: false` alternative
  // (each iframe = full Storybook runtime boot = 0.5GB+ on Vite dev).
  decorators: [dialogContainerDecorator(360)],
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

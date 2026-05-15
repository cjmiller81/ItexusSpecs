import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { YesNoDialog } from "./YesNoDialog";

const meta = {
  title: "Modals/YesNoDialog",
  component: YesNoDialog,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 360,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onAgree: fn(),
    onClose: fn(),
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    content: { control: "text" },
    agreeButtonText: { control: "text" },
    disagreeButtonText: { control: "text" },
  },
} satisfies Meta<typeof YesNoDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    title: "Delete this wallet?",
    content: "This will permanently remove the wallet from your account. Existing positions will no longer sync.",
  },
};

export const CustomButtonLabels: Story = {
  args: {
    open: true,
    title: "Sign transaction",
    content: "You're about to submit a swap of 1.0 ETH for 3,200 USDC.",
    agreeButtonText: "Sign and submit",
    disagreeButtonText: "Cancel",
  },
};

export const DefaultLabels: Story = {
  args: {
    open: true,
    title: "Confirm action",
    content: "Button labels fall back to Common.Yes / Common.No translations when not overridden via props.",
  },
};

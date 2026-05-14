import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppInputLabel } from "./AppInputLabel";

const meta = {
  title: "Common/Inputs/AppInputLabel",
  component: AppInputLabel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fieldLabel: { control: "text" },
    tooltip: { control: "text" },
    required: { control: "boolean" },
    labelSize: { control: "radio", options: ["s", "m", "l"] },
  },
} satisfies Meta<typeof AppInputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fieldLabel: "Username",
  },
};

export const Required: Story = {
  args: {
    fieldLabel: "Email address",
    required: true,
  },
};

export const WithTooltip: Story = {
  args: {
    fieldLabel: "Account ID",
    tooltip: "Your unique account identifier shown on every invoice.",
    required: true,
  },
};

export const Large: Story = {
  args: {
    fieldLabel: "Section heading",
    labelSize: "l",
  },
};

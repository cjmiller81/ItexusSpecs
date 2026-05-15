import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AppTextField from "./AppTextField";

const meta = {
  title: "Common/Inputs/AppTextField",
  component: AppTextField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    tooltip: { control: "text" },
    required: { control: "boolean" },
    fieldError: { control: "text" },
  },
  decorators: [
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Username",
    inputProps: { placeholder: "Enter your username" },
  },
};

export const Required: Story = {
  args: {
    label: "Email address",
    required: true,
    inputProps: { placeholder: "you@example.com" },
  },
};

export const WithTooltip: Story = {
  args: {
    label: "Account ID",
    tooltip: "Your unique account identifier shown on every invoice.",
    required: true,
    inputProps: { placeholder: "acct_…" },
  },
};

export const WithError: Story = {
  args: {
    label: "Email address",
    required: true,
    fieldError: "Please enter a valid email address",
    inputProps: { defaultValue: "not-an-email", placeholder: "you@example.com" },
  },
};

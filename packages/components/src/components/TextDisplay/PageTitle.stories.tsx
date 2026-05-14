import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageTitle } from "./PageTitle";

// PageTitle is a thin wrapper around MUI Typography that defaults the
// variant to "h6". Any TypographyProps can still be passed through.

const meta = {
  title: "TextDisplay/PageTitle",
  component: PageTitle,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
  },
  args: {
    children: "Page title",
  },
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Custom: Story = {
  args: {
    children: "A longer page title that demonstrates the typography weight and size",
    color: "primary",
  },
};

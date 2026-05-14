import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import type { PaletteMode } from "@mui/material";
import { ThemeToggler } from "./ThemeToggler";

const meta = {
  title: "Header/ThemeToggler",
  component: ThemeToggler,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onToggleMode: fn(),
  },
  argTypes: {
    mode: { control: "radio", options: ["light", "dark"] },
  },
  render: function Render(args) {
    const [mode, setMode] = useState<PaletteMode>(args.mode);
    return (
      <ThemeToggler
        {...args}
        mode={mode}
        onToggleMode={() => {
          setMode(prev => (prev === "dark" ? "light" : "dark"));
          args.onToggleMode();
        }}
      />
    );
  },
} satisfies Meta<typeof ThemeToggler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    mode: "light",
  },
};

export const Dark: Story = {
  args: {
    mode: "dark",
  },
};

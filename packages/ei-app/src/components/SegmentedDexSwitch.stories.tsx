import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";

import SegmentedDexSwitch from "./SegmentedDexSwitch";

// `SegmentedDexSwitch` toggles between auto-routing ("Get best routes") and
// manual DEX selection ("DEX chooser"). When the chooser is active, the
// component renders a small dot indicator showing how many DEXes the user
// has picked, up to `maxSelections`. Two info-button tooltips explain each
// mode.

const meta = {
  title: "EI App/Components/SegmentedDexSwitch",
  component: SegmentedDexSwitch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Two-option segmented control for picking a DEX routing strategy. The hosted page wires `onToggle` to feature flags + the user's saved DEX preferences. The dot indicator only appears when the chooser branch is active.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    isDexEnabled: false,
    selectedDexsCount: 0,
    maxSelections: 5,
    onToggle: () => {},
  },
  argTypes: {
    selectedDexsCount: { control: { type: "number", min: 0, max: 5, step: 1 } },
    maxSelections: { control: { type: "number", min: 1, max: 10, step: 1 } },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof SegmentedDexSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BestRoutes: Story = {};

export const DexChooserEmpty: Story = {
  name: "DEX chooser (empty)",
  args: {
    isDexEnabled: true,
    selectedDexsCount: 0,
  },
};

export const DexChooserPartial: Story = {
  name: "DEX chooser (3 of 5)",
  args: {
    isDexEnabled: true,
    selectedDexsCount: 3,
  },
};

export const DexChooserFull: Story = {
  name: "DEX chooser (full)",
  args: {
    isDexEnabled: true,
    selectedDexsCount: 5,
  },
};

export const Interactive: Story = {
  name: "Interactive",
  render: args => {
    function InteractiveSwitch() {
      const [enabled, setEnabled] = useState(args.isDexEnabled);
      return (
        <SegmentedDexSwitch
          {...args}
          isDexEnabled={enabled}
          onToggle={setEnabled}
        />
      );
    }
    return <InteractiveSwitch />;
  },
};

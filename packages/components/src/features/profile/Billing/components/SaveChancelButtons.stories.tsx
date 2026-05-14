import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import { SaveChancelButtons } from "./SaveChancelButtons";

// SaveChancelButtons is the standard right-aligned Cancel/Save pair used
// at the bottom of every editable billing form. Labels come from the
// shared `Common` namespace (Cancel / Save) — preview.tsx already
// provides both keys.
const meta = {
  title: "Profile/Billing/SaveChancelButtons",
  component: SaveChancelButtons,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Right-aligned Cancel / Save button pair used at the bottom of editable billing forms. Both labels come from the global `Common` i18n namespace.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onCancel: fn(),
    onSave: fn(),
  },
  argTypes: {
    disableSaveButton: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ minWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof SaveChancelButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Save is disabled (e.g. validation errors block submit).
export const SaveDisabled: Story = {
  args: { disableSaveButton: true },
};

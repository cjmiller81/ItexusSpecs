import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppNumberInput } from "./AppNumberInput";

// AppNumberInput wraps MUI Base's Unstable_NumberInput with the app's
// styled slots (root, input, increment/decrement buttons). Unlike the
// MUI-x NumberField, this uses the unstable Base UI primitive which gives
// up/down arrow buttons that step by the `step` prop.
//
// The component is fully controlled. Stories track the current value with
// local state and surface it in a readout so you can confirm the value
// updates as you click the spinner buttons.

function ValueReadout({ value }: { value: number | null | undefined }) {
  return (
    <Typography
      variant="caption"
      sx={{ display: "block", mt: 1, color: "text.secondary" }}>
      Current value: <code>{String(value)}</code>
    </Typography>
  );
}

const meta = {
  title: "Common/inputs/NumberInput/AppNumberInput",
  component: AppNumberInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    required: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    label: "Amount",
  },
} satisfies Meta<typeof AppNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderControlled = (initialValue: number | null) =>
  function Render(args: React.ComponentProps<typeof AppNumberInput>) {
    const [value, setValue] = useState<number | null>(initialValue);
    return (
      <Box sx={{ minWidth: 280 }}>
        <AppNumberInput
          {...args}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
        />
        <ValueReadout value={value} />
      </Box>
    );
  };

export const Default: Story = {
  args: { step: 1 },
  render: renderControlled(10),
};

export const Required: Story = {
  args: { required: true, step: 1 },
  render: renderControlled(0),
};

// step=0.25 means each arrow click adjusts by a quarter — useful for
// validating that the styled increment/decrement slots honor non-integer
// step values.
export const FractionalStep: Story = {
  args: { step: 0.25, min: 0, max: 10 },
  render: renderControlled(2.5),
};

// Bounded between 0 and 100. The spinner buttons clamp at both ends.
export const Clamped: Story = {
  args: { min: 0, max: 100, step: 5 },
  render: renderControlled(50),
};

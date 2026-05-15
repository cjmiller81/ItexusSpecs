import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DecimalInput } from "./DecimalInput";

// DecimalInput is a controlled numeric TextField that:
// - Formats the displayed value with thousand separators via toLocaleString
// - Validates keystrokes (digits + a single decimal point only)
// - Clamps to optional `min` / `max` on blur
// - Limits decimal places via `maxDecimals`
//
// Stories pair `value` with local state and render a small readout under
// the field so you can verify the parsed numeric value Formik would see.

function DecimalInputReadout({ value }: { value: number }) {
  return (
    <Typography
      variant="caption"
      sx={{ display: "block", mt: 1, color: "text.secondary" }}>
      Parsed value: <code>{value}</code>
    </Typography>
  );
}

const meta = {
  title: "Common/inputs/DecimalInput",
  component: DecimalInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    maxDecimals: { control: "number" },
  },
  args: {
    label: "Amount",
  },
} satisfies Meta<typeof DecimalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderControlled = (initialValue: number) =>
  function Render(args: React.ComponentProps<typeof DecimalInput>) {
    const [value, setValue] = useState(initialValue);
    return (
      <Box sx={{ minWidth: 280 }}>
        <DecimalInput
          {...args}
          value={value}
          onChange={setValue}
        />
        <DecimalInputReadout value={value} />
      </Box>
    );
  };

export const Default: Story = {
  args: { maxDecimals: 2 },
  render: renderControlled(1234.5),
};

// Type past the max — on blur the value clamps to 100.
export const Clamped: Story = {
  args: { min: 0, max: 100, maxDecimals: 2 },
  render: renderControlled(50),
};

// Crypto-grade precision — type up to 8 decimal places.
export const ManyDecimals: Story = {
  args: { maxDecimals: 8 },
  render: renderControlled(0.12345678),
};

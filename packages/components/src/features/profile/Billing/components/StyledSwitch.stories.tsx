import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StyledSwitch } from "./StyledSwitch";

// StyledSwitch is a thin re-skin of MUI's `Switch` with white thumb and a
// primary-coloured track. Used in BillingPlan to toggle the monthly/yearly
// pricing period.
const meta = {
  title: "Profile/Billing/StyledSwitch",
  component: StyledSwitch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Theme-coloured MUI Switch used by the billing pricing-period toggle.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StyledSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToggleRender = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center">
      <Typography sx={{ opacity: checked ? 0.5 : 1 }}>Yearly</Typography>
      <StyledSwitch
        checked={checked}
        onChange={(_, v) => setChecked(v)}
      />
      <Typography sx={{ opacity: checked ? 1 : 0.5 }}>Monthly</Typography>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <ToggleRender />,
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true, checked: false },
};

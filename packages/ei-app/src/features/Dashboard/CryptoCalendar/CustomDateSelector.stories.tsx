import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import { useState } from "react";

import { CustomDateSelector } from "./CustomDateSelector";

const today = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();
const weekFromNow = (() => {
  const d = new Date(today);
  d.setDate(d.getDate() + 7);
  return d;
})();

// CustomDateSelector is an uncontrolled-in-spirit popover. We give it a tiny
// stateful host so the displayed `From` / `To` chips actually update when a
// story interacts with the calendar.
const Host = (props: { initial: [Date, Date] }) => {
  const [range, setRange] = useState<[Date, Date]>(props.initial);
  return (
    <Box sx={{ p: 4, position: "relative", minHeight: 200, width: 480 }}>
      <CustomDateSelector
        selectedDate={range}
        setSelectedDate={setRange}
      />
    </Box>
  );
};

const meta: Meta<typeof Host> = {
  title: "EI App/Dashboard/CustomDateSelector",
  component: Host,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Host>;

export const Default: Story = {
  args: {
    initial: [today, weekFromNow],
  },
};

export const SameDay: Story = {
  args: {
    initial: [today, today],
  },
};

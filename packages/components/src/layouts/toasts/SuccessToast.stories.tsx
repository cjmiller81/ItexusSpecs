import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessToast from "./successToast";

function SuccessToastTriggers() {
  const [saleVisible, setSaleVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);
  return (
    <Box>
      <ToastContainer position="top-center" />
      <Stack
        direction="row"
        spacing={2}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => setSaleVisible(true)}>
          Sale toast
        </Button>
        <Button
          variant="outlined"
          onClick={() => setBuyVisible(true)}>
          Buy toast
        </Button>
      </Stack>
      {saleVisible ? (
        <SuccessToast
          message="Order filled (sale tone)."
          position="top-center"
        />
      ) : null}
      {buyVisible ? (
        <SuccessToast
          message="Order filled (buy tone)."
          event={{ instruction: "Buy" }}
          position="top-center"
        />
      ) : null}
    </Box>
  );
}

const meta = {
  title: "Layouts/Toasts/SuccessToast",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          '`event.instruction === "Buy"` swaps the success chrome to the lighter green palette; other instructions use the alternate red-tinted success container. Same imperative mount semantics as `ErrorToast` — gated behind buttons here.',
      },
    },
  },
  tags: ["autodocs"],
  render: () => <SuccessToastTriggers />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

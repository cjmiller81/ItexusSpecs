import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorToast from "./errorToast";

function ErrorToastTrigger() {
  const [visible, setVisible] = useState(false);
  return (
    <Box>
      <ToastContainer position="top-center" />
      <Button
        variant="outlined"
        color="error"
        onClick={() => setVisible(true)}>
        Show error toast
      </Button>
      {visible ? (
        <ErrorToast
          message="Something went wrong in Storybook."
          position="top-center"
        />
      ) : null}
    </Box>
  );
}

const meta = {
  title: "Layouts/Toasts/ErrorToast",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Imperative wrapper around `react-toastify` with shared error chrome (`FaExclamationTriangle` + `getErrorStyles`). Mounting the component triggers `toast.error` once — this demo reveals it behind a click so Storybook doesn't spam on load.",
      },
    },
  },
  tags: ["autodocs"],
  render: () => <ErrorToastTrigger />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

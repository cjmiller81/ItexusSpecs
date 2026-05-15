import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ToastifyLayout } from "./ToastifyLayout";
import { addError, addMessage, useAppDispatch } from "../slices/index";

function ToastifyDemo() {
  const dispatch = useAppDispatch();
  return (
    <ToastifyLayout>
      <Stack
        spacing={2}
        sx={{ maxWidth: 400 }}>
        <Typography
          variant="body2"
          color="text.secondary">
          Global toast queue driven from Redux `ui.errors` / `ui.messages`: each render drains the queue with
          react-toastify and dispatches the corresponding clear action.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => dispatch(addError({ message: "Example error toast from Redux" }))}>
          Dispatch error
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => dispatch(addMessage({ message: "Example success toast" }))}>
          Dispatch message
        </Button>
      </Stack>
    </ToastifyLayout>
  );
}

const meta = {
  title: "Layouts/ToastifyLayout",
  component: ToastifyLayout,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Subscribes to `ui.errors` and `ui.messages`, mirrors each entry to `react-toastify`, then immediately dispatches `clearErrors` / `clearMessages`. Preload neither array in `reduxState` — interactions queue work deliberately.",
      },
    },
  },
  tags: ["autodocs"],
  render: () => <ToastifyDemo />,
} satisfies Meta<typeof ToastifyLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

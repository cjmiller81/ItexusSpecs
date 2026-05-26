import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { dialogContainerDecorator } from "../../storybookMocks/dialogDocsDecorator";
import { AppModal } from "./AppModal";

const modalContent = (
  <Box sx={{ display: "block" }}>
    <Typography
      variant="h6"
      sx={{ mb: 1 }}>
      Confirm trade
    </Typography>
    <Typography
      variant="body2"
      sx={{ mb: 2 }}
      component="div">
      You&apos;re about to swap <strong>1.0 ETH</strong> for approximately <strong>3,200 USDC</strong>. Network fees and
      slippage may apply.
    </Typography>
    <Stack
      direction="row"
      spacing={1}
      justifyContent="flex-end">
      <Button
        variant="outlined"
        size="small">
        Cancel
      </Button>
      <Button
        variant="contained"
        size="small">
        Confirm
      </Button>
    </Stack>
  </Box>
);

// AppModal is a portal-rendered MUI Modal. On the Docs page the portal would
// otherwise overlay the rest of the page; `dialogContainerDecorator` contains
// it inside a bounded card (Docs view only — Story view renders the modal
// at its normal full-viewport sizing). See `dialogDocsDecorator.tsx` for why
// this is preferred over `docs.story.inline = false`.
const meta = {
  title: "Modals/AppModal",
  component: AppModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [dialogContainerDecorator(480)],
  args: {
    open: false,
    onClose: fn(),
    children: modalContent,
  },
  argTypes: {
    open: { control: "boolean" },
  },
} satisfies Meta<typeof AppModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
  },
};

export const Closed: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <AppModal
          open={open}
          onClose={() => setOpen(false)}>
          {modalContent}
        </AppModal>
      </Box>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { PaymentMethodModal } from "./PaymentMethodModal";

// PaymentMethodModal is a thin wrapper around `AppModal` with the wider
// 700×400 body sizing the Billing tab uses for its "Add a payment method"
// flow. Because it's a portal-rendered Modal, the autodocs preview can't
// inline-render it without overlapping siblings — `docs.story.inline =
// false` opens each variant in its own iframe canvas.
const ToggleRender = ({ initialOpen, onClose }: { initialOpen: boolean; onClose?: () => void }) => {
  const [open, setOpen] = useState(initialOpen);
  const close = () => {
    setOpen(false);
    onClose?.();
  };
  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}>
        Open payment method modal
      </Button>
      <PaymentMethodModal
        open={open}
        onClose={close}>
        <Stack
          spacing={2}
          sx={{ minHeight: "100%" }}>
          <Typography variant="h6">Add a payment method</Typography>
          <Typography color="text.secondary">
            This is sample modal content — `PaymentMethodModal` only owns the chrome (size, close button, backdrop). The
            real Billing tab renders `PaymentMethodSelector` or `PaymentMethodEditor` inside this slot.
          </Typography>
          <Button
            variant="outlined"
            onClick={close}>
            Close
          </Button>
        </Stack>
      </PaymentMethodModal>
    </Box>
  );
};

const meta = {
  title: "Profile/Billing/PaymentMethodModal",
  component: PaymentMethodModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Wider variant of `AppModal` (700×400 min size, responsive down to 90% width below `md`) used for the Billing tab's payment-method dialogs. Stories render their own children — the modal itself is structural.",
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onClose: fn(),
    children: <></>,
  },
} satisfies Meta<typeof PaymentMethodModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { open: true },
  render: args => (
    <PaymentMethodModal
      {...args}
      onClose={args.onClose}>
      <Stack
        spacing={2}
        sx={{ minHeight: "100%" }}>
        <Typography variant="h6">Add a payment method</Typography>
        <Typography color="text.secondary">
          Children render inside the wider modal body — see `PaymentMethodSelector` for the real composition.
        </Typography>
      </Stack>
    </PaymentMethodModal>
  ),
};

export const ToggleFromButton: Story = {
  render: args => (
    <ToggleRender
      initialOpen={false}
      onClose={args.onClose}
    />
  ),
};

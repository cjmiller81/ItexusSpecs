import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { fn } from "storybook/test";
import { CentralizedWalletModal } from "./CentralizedExchangeDialog";

function CentralizedWalletModalWrapper(props: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  return (
    <Stack
      spacing={2}
      alignItems="flex-start">
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <CentralizedWalletModal
        disableModalPortal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={fn()}
      />
    </Stack>
  );
}

const meta = {
  title: "MyWallets/CentralizedWalletModal",
  component: CentralizedWalletModal,
  args: {
    open: false,
    onClose: fn(),
    onConfirm: fn(),
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Kraken / Coinbase picker dialog (`IndexModelingSection` i18n). Production UI currently omits confirm actions in the source file — this story focuses on the open/close + select interaction.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CentralizedWalletModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: () => <CentralizedWalletModalWrapper />,
};

export const Open: Story = {
  render: () => <CentralizedWalletModalWrapper defaultOpen />,
};

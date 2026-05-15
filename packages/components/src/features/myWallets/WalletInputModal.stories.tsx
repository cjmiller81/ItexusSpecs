import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fn } from "storybook/test";
import { WalletInputModal, type WalletInputProps } from "./WalletInputModal";

const noopHandlers: Pick<WalletInputProps, "onClose" | "onEnter" | "onCleanupError"> = {
  onClose: fn(),
  onEnter: fn(),
  onCleanupError: fn(),
};

function WalletInputModalShell(props: Partial<WalletInputProps> & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [error, setError] = useState<string | null>(props.error ?? null);

  return (
    <Stack
      spacing={2}
      alignItems="flex-start">
      <Typography
        variant="body2"
        color="text.secondary">
        Form validation uses `cryptoWalletFormat` (42-char 0x address) and `WalletInputModal` + `Common` i18n keys from
        Storybook `preview.tsx`.
      </Typography>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}>
        Add wallet
      </Button>
      <WalletInputModal
        disableModalPortal
        open={open}
        onClose={() => {
          setOpen(false);
          noopHandlers.onClose();
        }}
        onEnter={data => {
          noopHandlers.onEnter(data);
          setOpen(false);
        }}
        error={error}
        onCleanupError={() => {
          setError(null);
          noopHandlers.onCleanupError();
        }}
      />
    </Stack>
  );
}

const meta = {
  title: "MyWallets/WalletInputModal",
  component: WalletInputModal,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Formik + Yup modal for naming a wallet and entering an EVM address (`AppModal`). Toggle via the trigger button; `WithDuplicateError` seeds a server-style error string for the address field branch.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: false,
    error: null,
    ...noopHandlers,
  },
} satisfies Meta<typeof WalletInputModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: () => <WalletInputModalShell />,
};

export const OpenEmpty: Story = {
  render: () => <WalletInputModalShell defaultOpen />,
};

export const WithDuplicateError: Story = {
  render: () => (
    <WalletInputModalShell
      defaultOpen
      error="Wallet address already exists"
    />
  ),
};

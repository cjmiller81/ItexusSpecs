import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { SelectChangeEvent } from "@mui/material/Select";
import { fn } from "storybook/test";

import { dialogContainerDecorator } from "../../../storybookMocks/dialogDocsDecorator";

import { ExchangeDialog } from "./ExchangeDialog";

const SERVICE_OPTIONS = ["Kraken", "Coinbase"];

function ExchangeDialogDemo(props: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  return (
    <Stack
      spacing={2}
      alignItems="flex-start">
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}>
        Open exchange picker
      </Button>
      <ExchangeDialog
        disableModalPortal
        open={open}
        title={SERVICE_OPTIONS}
        selectedService={SERVICE_OPTIONS}
        onClose={() => setOpen(false)}
        onServiceChange={fn() as (e: SelectChangeEvent<string>) => void}
      />
    </Stack>
  );
}

const meta: Meta<typeof ExchangeDialog> = {
  title: "MyWallets/dialogs/ExchangeDialog",
  component: ExchangeDialog,
  args: {
    open: false,
    title: SERVICE_OPTIONS,
    selectedService: SERVICE_OPTIONS,
    onClose: fn(),
    onServiceChange: fn(),
    disableModalPortal: true,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Multi-exchange picker used before opening Kraken/Coinbase flows. `selectedService` doubles as the `MenuItem` list in current callers (see CEX wallets page).",
      },
    },
  },
  // Bound the modal to a sized card on the Docs page only. The standalone
  // Story page still gets the dialog at full viewport. See
  // `storybookMocks/dialogDocsDecorator.tsx`.
  decorators: [dialogContainerDecorator(560)],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: () => <ExchangeDialogDemo />,
};

export const Open: Story = {
  render: () => <ExchangeDialogDemo defaultOpen />,
};

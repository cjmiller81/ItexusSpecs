import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";

import CapitalSwitch from "./CapitalSwitch";

// `CapitalSwitch` lets a strategy author toggle between using their own
// wallet's capital and an arbitrary deployment amount. The toggle is locked
// out (and a tooltip prompts the user) until `selectedWallet` is non-null
// and `isValid`. The component is presentational only — wire `onToggle`
// to your form state.

const validWallet = {
  address: "0xC0FfEe000000000000000000000000000000C0Fe",
  walletId: "wallet-pro-1",
  isValid: true,
  walletName: "Primary trading",
  isPersonal: true,
};

const invalidWallet = {
  ...validWallet,
  isValid: false,
};

const meta = {
  title: "EI App/Components/CapitalSwitch",
  component: CapitalSwitch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Two-mode capital selector used in strategy modeling. Switches between **wallet capital** (auto-pulled from the selected wallet's USD balance) and **deployment capital** (a free-form amount). When no valid wallet is selected, the switch is gated and a tooltip prompts the user to pick one.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    walletAmount: 8115.39,
    deploymentAmount: 1000,
    selectedWallet: validWallet,
    onToggle: () => {},
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, minWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof CapitalSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithValidWallet: Story = {};

export const NoWalletSelected: Story = {
  name: "No wallet selected",
  args: {
    selectedWallet: null,
  },
};

export const InvalidWallet: Story = {
  args: {
    selectedWallet: invalidWallet,
  },
};

export const Interactive: Story = {
  name: "Interactive (logs toggle)",
  render: args => {
    function InteractiveCapitalSwitch() {
      const [mode, setMode] = useState<"wallet" | "deployment">("deployment");
      return (
        <Box>
          <Box sx={{ mb: 1, color: "text.secondary", fontSize: 12 }}>
            Active mode: <strong>{mode}</strong>
          </Box>
          <CapitalSwitch
            {...args}
            onToggle={isWallet => setMode(isWallet ? "wallet" : "deployment")}
          />
        </Box>
      );
    }
    return <InteractiveCapitalSwitch />;
  },
};

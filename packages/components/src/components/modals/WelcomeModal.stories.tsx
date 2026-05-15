import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Button from "@mui/material/Button";
import { WelcomeModal } from "./WelcomeModal";

// WelcomeModal is shown once after a successful password change. It calls
// useTranslation("WelcomeModal") for all of its copy — the Storybook
// preview.tsx initializes a "WelcomeModal" namespace with stand-in English
// strings so the modal can render without the real i18n bundles loaded.
//
// Modals render into a portal. With `docs.story.inline = false` the Docs
// page renders each story inside its own iframe so the open modals do not
// stack on top of each other.

const meta = {
  title: "modals/WelcomeModal",
  component: WelcomeModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 720 },
      description: {
        component:
          "Beta-test welcome dialog. The component reads its copy from the `WelcomeModal` i18n namespace — the Storybook preview seeds that namespace with placeholder English strings.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: fn(),
  },
} satisfies Meta<typeof WelcomeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

// Interactive variant: starts closed, with a button to open it. Useful for
// validating the close button + onClose callback are wired correctly.
export const Closed: Story = {
  args: { open: false },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}>
          Open welcome modal
        </Button>
        <WelcomeModal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

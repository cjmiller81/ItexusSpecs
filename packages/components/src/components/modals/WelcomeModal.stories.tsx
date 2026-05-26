import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Button from "@mui/material/Button";
import { dialogContainerDecorator } from "../../storybookMocks/dialogDocsDecorator";
import { WelcomeModal } from "./WelcomeModal";

// WelcomeModal is shown once after a successful password change. It calls
// useTranslation("WelcomeModal") for all of its copy — the Storybook
// preview.tsx initializes a "WelcomeModal" namespace with stand-in English
// strings so the modal can render without the real i18n bundles loaded.
//
// The modal renders into a portal. On the Docs page that would overlay
// the rest of the page; `dialogContainerDecorator` contains the modal in
// a bounded card in Docs view (the Story view still renders it full
// viewport). See `dialogDocsDecorator.tsx` for why this is preferred over
// `docs.story.inline = false` (per-story iframes blow up Vite dev request
// counts and page weight).

const meta = {
  title: "modals/WelcomeModal",
  component: WelcomeModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Beta-test welcome dialog. The component reads its copy from the `WelcomeModal` i18n namespace — the Storybook preview seeds that namespace with placeholder English strings.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [dialogContainerDecorator(720)],
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

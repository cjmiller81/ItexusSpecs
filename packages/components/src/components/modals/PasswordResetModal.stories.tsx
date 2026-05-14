import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PasswordResetModal, type PasswordResetModalProps } from "./PasswordResetModal";

// PasswordResetModal is a Formik-validated dialog that calls Ory's
// onChangePassword. It opens a settings flow on mount via createSettingsFlow
// (the default mock in preview.tsx returns a stub flow, so the LoadingButton
// is enabled immediately in stories — to exercise the "Initializing..." state,
// override createSettingsFlow with a delayed resolution under parameters.oryContext).
//
// The dialog itself is a portal, so stories that render it open use
// docs.story.inline = false to keep the autodocs page readable.
const meta = {
  title: "Modals/PasswordResetModal",
  component: PasswordResetModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Formik-validated password change dialog backed by Ory's settings flow. Validation errors come from the local yup schema; submit errors come from `useOry().onChangePassword`. On success the embedded WelcomeModal opens.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: fn(),
    onSuccess: fn(),
    onWelcomeModalOpen: fn(),
  },
} satisfies Meta<typeof PasswordResetModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  parameters: {
    docs: { story: { inline: false, iframeHeight: 480 } },
  },
};

// Submitting raises a per-story onChangePassword that throws — the
// dispatched error message renders via the global Snackbar host, but the
// dialog itself stays open so reviewers can see the form's submit-error
// branch. Type a >=8 character password and click Change password.
export const SubmitFails: Story = {
  parameters: {
    docs: { story: { inline: false, iframeHeight: 480 } },
    oryContext: {
      onChangePassword: async () => {
        throw new Error("password is too weak");
      },
    },
  },
};

// Inline component is required so eslint's react-hooks/rules-of-hooks
// recognizes useState as being inside a real component (a bare `render`
// arrow doesn't qualify). Same pattern as TabSelector's controlled story.
const ClosedRender = (args: PasswordResetModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="body2"
        sx={{ mb: 2 }}>
        The modal is closed by default. Click the button to open it.
      </Typography>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}>
        Open password reset
      </Button>
      <PasswordResetModal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};

export const Closed: Story = {
  render: args => <ClosedRender {...args} />,
};

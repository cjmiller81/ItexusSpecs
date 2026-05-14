import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { SettingsFlow, UiNode } from "@ory/client";
import Box from "@mui/material/Box";
import { SecurityContainer } from "./SecurityContainer";

// SecurityContainer is the right-half of the Security tab on the Profile
// page: a "Change password" Formik form (password change via Ory) + a
// "Add authenticator app" panel that inspects the active Ory settings flow
// for TOTP nodes (QR-code image + secret + unlink button).
//
// All three TOTP states are driven by overriding
// `parameters.oryContext.settingsFlow.ui.nodes`. The default Ory mock
// returns an empty `nodes` array, which corresponds to the "no MFA setup
// in progress" state — only the password change card is interactive.
//
// Stories that exercise the QR / unlink branches build a minimal
// `SettingsFlow` with the specific node shapes SecurityContainer
// inspects (`isUiNodeImageAttributes`, `text.id === 1050006`, and
// `name === "totp_unlink"`).

// Build a minimal SettingsFlow with whatever TOTP nodes are requested.
// Cast through `unknown` because @ory/client's types include many fields
// SecurityContainer never reads.
const buildSettingsFlow = (nodes: UiNode[]): SettingsFlow =>
  ({
    id: "storybook-settings-flow",
    type: "browser",
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    issued_at: new Date().toISOString(),
    request_url: "https://storybook.local/self-service/settings",
    state: "show_form",
    ui: {
      action: "https://storybook.local/self-service/settings",
      method: "POST",
      nodes,
      messages: [],
    },
  }) as unknown as SettingsFlow;

const totpImageNode = {
  type: "img",
  group: "totp",
  attributes: {
    src: "https://placehold.co/200x200/ffffff/000000?text=QR+CODE",
    id: 1050008,
    width: 200,
    height: 200,
    node_type: "img",
  },
  messages: [],
  meta: { label: { id: 1, text: "QR code", type: "info" } },
} as unknown as UiNode;

const totpSecretNode = {
  type: "text",
  group: "totp",
  attributes: {
    text: { id: 1050006, text: "JBSWY3DPEHPK3PXP", type: "info", context: {} },
    id: 1050006,
    node_type: "text",
  },
  messages: [],
  meta: { label: { id: 1, text: "TOTP Secret", type: "info" } },
} as unknown as UiNode;

const totpUnlinkNode = {
  type: "input",
  group: "totp",
  attributes: {
    name: "totp_unlink",
    type: "submit",
    value: "true",
    disabled: false,
    node_type: "input",
  },
  messages: [],
  meta: { label: { id: 1, text: "Unlink", type: "info" } },
} as unknown as UiNode;

const meta = {
  title: "Profile/SecurityContainer",
  component: SecurityContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Two-column security panel — Change Password (Formik + `useOry().onChangePassword`) and Add Authenticator App (driven by the Ory settings flow's TOTP nodes). Override `parameters.oryContext.settingsFlow` to drive the QR-code, already-linked, and empty TOTP states.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 1080, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof SecurityContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Ory mock returns an empty settings flow — only the password
// change form is interactive. The TOTP card renders empty.
export const Default: Story = {};

// QR code state — settings flow contains the TOTP image + secret nodes
// the user scans into their authenticator app, plus a verification code
// input to confirm the link.
export const TotpQrCode: Story = {
  parameters: {
    oryContext: {
      settingsFlow: buildSettingsFlow([totpImageNode, totpSecretNode]),
    },
  },
};

// Already-linked state — settings flow contains the `totp_unlink` input
// node; the QR section is hidden and the Unlink button is shown instead.
export const TotpAlreadyLinked: Story = {
  parameters: {
    oryContext: {
      settingsFlow: buildSettingsFlow([totpUnlinkNode]),
    },
  },
};

// Forced password-change flow — landing on the page with
// `?requireChangePassword=true` dispatches a warning and focuses the
// password field. Reviewers can verify the warning Snackbar appears in
// the top-right of the canvas.
export const PasswordChangeRequired: Story = {
  parameters: {
    nextjs: {
      router: { query: { requireChangePassword: "true" } },
    },
  },
};

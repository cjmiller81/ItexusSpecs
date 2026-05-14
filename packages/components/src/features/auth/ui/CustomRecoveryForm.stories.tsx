import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { RecoveryFlow } from "@ory/client";
import Stack from "@mui/material/Stack";
import { fn } from "storybook/test";
import { CustomRecoveryForm } from "./CustomRecoveryForm";
import { StyledAuthContainer } from "./StyledAuthContainer";

// `CustomRecoveryForm` is the email-then-code recovery card. It
// flips between two visual stages driven by `flow.state` /
// `codeAttributes`:
//
//   1. "Send recovery email" — accepts an email address.
//   2. "Enter recovery code" — accepts the 6-digit code Ory mails
//      back. A "Resend code" button reuses the captured email via
//      the optional `onResend` callback.
//
// Global `ui.messages` are surfaced as MUI `<Alert>`s above the
// inputs.
const meta = {
  title: "Auth/CustomRecoveryForm",
  component: CustomRecoveryForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Recovery card with two stages — request email and enter code. Stage selection is driven by `flow.state === 'sent_email'` or the presence of a `code` input in `flow.ui.nodes`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn(),
    onResend: fn(),
  },
  decorators: [
    Story => (
      <StyledAuthContainer>
        <Stack
          alignItems="center"
          gap={1}
          sx={{ width: "100%" }}>
          <Story />
        </Stack>
      </StyledAuthContainer>
    ),
  ],
} satisfies Meta<typeof CustomRecoveryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const ISO_2026_01_01 = "2026-01-01T00:00:00Z";

const baseFlow = {
  id: "storybook-recovery-flow",
  type: "browser" as const,
  expires_at: ISO_2026_01_01,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/recovery/browser",
};

// Stage 1 — Ory's initial `choose_method` flow. `state` is
// `choose_method`, `ui.nodes` contains an `email` input plus the
// submit + return-to-login link.
const emailStageFlow: RecoveryFlow = {
  ...baseFlow,
  state: "choose_method",
  ui: {
    action: "https://example.test/self-service/recovery",
    method: "POST",
    messages: [],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "email",
          type: "email",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070007, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "method",
          type: "submit",
          value: "code",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070005, text: "Submit", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Stage 2 — `state === "sent_email"`. The fixture preserves the
// captured email value (the production page also seeds this from a
// `useState` ref but the form re-reads it from `node.attributes.value`)
// and replaces the `email` input with a `code` input.
const codeStageFlow: RecoveryFlow = {
  ...baseFlow,
  state: "sent_email",
  ui: {
    action: "https://example.test/self-service/recovery",
    method: "POST",
    messages: [
      {
        id: 1060003,
        type: "info",
        text: "An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
        context: {},
      },
    ],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "email",
          type: "email",
          value: "demo@example.com",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070007, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "code",
          type: "text",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070008, text: "Recovery code", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "method",
          type: "submit",
          value: "code",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070009, text: "Submit code", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Stage 2 + a server-side error message attached to the global
// `ui.messages` array. Tests the `Alert` surface in both severity
// branches.
const codeStageWithErrorFlow: RecoveryFlow = {
  ...codeStageFlow,
  ui: {
    ...codeStageFlow.ui,
    messages: [
      {
        id: 4060006,
        type: "error",
        text: "The recovery code is invalid or has already been used. Please try again.",
        context: {},
      },
    ],
  },
};

export const EmailStage: Story = {
  args: { flow: emailStageFlow },
};

export const CodeStage: Story = {
  args: { flow: codeStageFlow },
};

export const CodeStageWithError: Story = {
  args: { flow: codeStageWithErrorFlow },
};

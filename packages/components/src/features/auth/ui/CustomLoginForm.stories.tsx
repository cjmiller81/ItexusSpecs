import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { LoginFlow } from "@ory/client";
import Stack from "@mui/material/Stack";
import { fn } from "storybook/test";
import { CustomLoginForm } from "./CustomLoginForm";
import { StyledAuthContainer } from "./StyledAuthContainer";

// `CustomLoginForm` is the bespoke sign-in card the production auth
// pages render inside `<StyledAuthContainer>`. It owns its own form
// state, switches between password and TOTP step-up based on whether
// `flow.ui.nodes` contains a `totp_code` input, surfaces global Ory
// messages, and renders the "expired form" fallback when
// `isRefreshFlowIdNeeded` is true. The Turnstile widget is gated on
// `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — unset in Storybook, so the
// CAPTCHA branch never renders.
const meta = {
  title: "Auth/CustomLoginForm",
  component: CustomLoginForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Branded sign-in card. Drives method selection (`password` vs `totp`) from `flow.ui.nodes`, renders the recovery / sign-up links, and falls back to an expired-form refresh prompt when the flow id has aged out.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    isRefreshFlowIdNeeded: false,
    onSubmit: fn(),
    onRefreshFlowId: fn(),
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
} satisfies Meta<typeof CustomLoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const ISO_2026_01_01 = "2026-01-01T00:00:00Z";

// Standard email-and-password login flow plus the recovery + signup
// links Ory returns when password authentication is enabled. The
// component looks each input up by `attributes.name`, so additional
// nodes outside the recognized set are ignored.
const passwordFlow: LoginFlow = {
  id: "storybook-login-flow",
  type: "browser",
  expires_at: ISO_2026_01_01,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/login/browser",
  ui: {
    action: "https://example.test/self-service/login",
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
        group: "password",
        attributes: {
          name: "identifier",
          type: "email",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070002, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070001, text: "Password", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1010001, text: "Sign in", type: "info" } },
        messages: [],
      },
      {
        type: "a",
        group: "default",
        attributes: {
          id: "recovery-link",
          href: "/ui/recovery",
          title: { id: 1060001, text: "Forgot password?", type: "info" },
          node_type: "a",
        },
        meta: { label: { id: 1060001, text: "Forgot password?", type: "info" } },
        messages: [],
      },
      {
        type: "a",
        group: "default",
        attributes: {
          id: "signup-link",
          href: "/ui/registration",
          title: { id: 1040003, text: "Sign up", type: "info" },
          node_type: "a",
        },
        meta: { label: { id: 1040003, text: "Sign up", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Step-up flow returned by Ory after a password challenge succeeds
// for an AAL2 account. The `totp_code` node swaps the password +
// recovery-link block for the 6-digit OTP input.
const totpFlow: LoginFlow = {
  ...passwordFlow,
  id: "storybook-login-flow-totp",
  ui: {
    ...passwordFlow.ui,
    nodes: [
      passwordFlow.ui.nodes[0], // CSRF
      passwordFlow.ui.nodes[1], // identifier
      {
        type: "input",
        group: "totp",
        attributes: {
          name: "totp_code",
          type: "text",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070003, text: "Authenticator code", type: "info" } },
        messages: [],
      },
      {
        ...passwordFlow.ui.nodes[3], // submit, swap method value
        attributes: {
          ...passwordFlow.ui.nodes[3].attributes,
          value: "totp",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    ],
  },
};

// Server-side error attached to the flow's global `ui.messages`. The
// component surfaces these above the email field in a red
// 0.8rem-line-height stack.
const errorFlow: LoginFlow = {
  ...passwordFlow,
  ui: {
    ...passwordFlow.ui,
    messages: [
      {
        id: 4000006,
        type: "error",
        text: "The provided credentials are invalid. Check for spelling mistakes in your password or email address.",
        context: {},
      },
    ],
  },
};

export const Default: Story = {
  args: { flow: passwordFlow },
};

// `flow.ui.nodes` contains a `totp_code` input — the component
// switches off the password / recovery-link block and renders the
// MFA prompt instead.
export const TotpStepUp: Story = {
  args: { flow: totpFlow },
};

// Surface a global error message. The submit button stays enabled so
// the user can retry once they fix the input.
export const WithGlobalError: Story = {
  args: { flow: errorFlow },
};

// `isRefreshFlowIdNeeded` short-circuits both the field block and the
// CAPTCHA block in favour of the localized "form expired" message
// plus a refresh button bound to `onRefreshFlowId`. The flow object
// is still required because the component reads `flow.ui.action`
// for the form element regardless of which branch renders.
export const ExpiredFlow: Story = {
  args: { flow: passwordFlow, isRefreshFlowIdNeeded: true },
};

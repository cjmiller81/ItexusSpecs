import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { LoginFlow, SettingsFlow, UpdateLoginFlowBody } from "@ory/client";
import Box from "@mui/material/Box";
import { fn } from "storybook/test";
import { Flow } from "./Flow";

// `Flow` is the auth-form workhorse. It owns its own form state, mounts
// the global `Messages` strip, walks `flow.ui.nodes` (optionally
// filtered by `only`), and renders each entry through the `Node`
// dispatcher. Submission collects the form-data, merges in the
// internally tracked `values`, and hands the merged body to
// `onSubmit`. The component is a class component, so the meta below
// uses `Flow<UpdateLoginFlowBody>` to anchor the generic — every
// individual story narrows it again to match its flow fixture.
const meta = {
  title: "Auth/Flow",
  component: Flow<UpdateLoginFlowBody>,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Generic Ory-flow renderer. Filters `flow.ui.nodes` by `only` (`'password' | 'oidc' | 'totp' | …`), pre-fills the internal `values` from non-button input attribute values, and emits a merged body via `onSubmit` on form submit.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn(),
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 480 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Flow<UpdateLoginFlowBody>>;

export default meta;
type Story = StoryObj<typeof meta>;

const ISO_2026_01_01 = "2026-01-01T00:00:00Z";

// Minimal password-only login flow. Covers the four node groups the
// dispatcher routes (`input` x {hidden, text, password, submit}) and
// adds a global info message so the `hideGlobalMessages` toggle has
// something to hide.
const passwordLoginFlow: LoginFlow = {
  id: "storybook-login-flow",
  type: "browser",
  expires_at: ISO_2026_01_01,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/login/browser",
  ui: {
    action: "https://example.test/self-service/login",
    method: "POST",
    messages: [{ id: 1010001, type: "info", text: "Please sign in to continue.", context: {} }],
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
          value: "demo@example.com",
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
    ],
  },
  // Identical structure for the per-group `methods` slot — the
  // component never reads it, but Ory's type requires the field.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Adds an OIDC group on top of the password flow so the `only`
// filter has something to discard. Mirrors what Ory returns when
// social-login providers are configured.
const passwordPlusOidcFlow: LoginFlow = {
  ...passwordLoginFlow,
  id: "storybook-login-flow-oidc",
  ui: {
    ...passwordLoginFlow.ui,
    nodes: [
      ...passwordLoginFlow.ui.nodes,
      {
        type: "a",
        group: "oidc",
        attributes: {
          id: "oidc-google",
          href: "#sign-in-with-google",
          title: { id: 1040002, text: "Sign in with Google", type: "info" },
          node_type: "a",
        },
        meta: { label: { id: 1040002, text: "Sign in with Google", type: "info" } },
        messages: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ],
  },
};

// Settings flow with a password-change section and an info-level
// global message. Drives the `Flow<UpdateSettingsFlowBody>`
// instantiation through a cast — Storybook's `typeof Flow` is locked
// to `UpdateLoginFlowBody` at the meta level, so the cast lives in
// the args.
const settingsFlow: SettingsFlow = {
  id: "storybook-settings-flow",
  type: "browser",
  expires_at: ISO_2026_01_01,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/settings/browser",
  state: "show_form",
  ui: {
    action: "https://example.test/self-service/settings",
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
          name: "password",
          type: "password",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070001, text: "New password", type: "info" } },
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
        meta: { label: { id: 1070003, text: "Update password", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Default — password-only login flow with a global info message.
export const LoginPasswordOnly: Story = {
  args: { flow: passwordLoginFlow },
};

// Two groups present (`password`, `oidc`); `only: "password"` filters
// the OIDC anchor out of the rendered list while the default-group
// CSRF token stays put.
export const FilteredByMethod: Story = {
  args: { flow: passwordPlusOidcFlow, only: "password" },
};

// Same fixture as `LoginPasswordOnly` but with `hideGlobalMessages`
// — the top-level `<Messages>` strip is suppressed even though
// `ui.messages` is non-empty.
export const HideGlobalMessages: Story = {
  args: { flow: passwordLoginFlow, hideGlobalMessages: true },
};

// `flow` is undefined — the component returns `null`, so the
// decorator wrapper renders empty. Verifies the early-return guard.
export const FlowMissing: Story = {
  args: { flow: undefined },
};

// A `SettingsFlow` fed through the `Flow<UpdateLoginFlowBody>` meta
// instantiation. The component is structurally compatible with any
// of the five flow shapes Ory ships — the body type is only relevant
// at the `onSubmit` callsite, so the meta's default `fn()` covers
// reviewers' needs without re-typing the callback.
export const SettingsFlowVariant: Story = {
  args: { flow: settingsFlow },
};

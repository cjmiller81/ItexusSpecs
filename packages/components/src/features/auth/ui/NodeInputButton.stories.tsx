import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeInputAttributes } from "@ory/client";
import Box from "@mui/material/Box";
import { fn } from "storybook/test";
import { NodeInputButton } from "./NodeInputButton";

// `NodeInputButton` is the renderer for Ory `input` nodes whose
// attribute type is `button` — i.e. *non*-submit buttons that drive a
// method change before the form submits. The most common consumer is
// the TOTP / WebAuthn unlink flow, where the button writes
// `attributes.value` into the form state via `setValue` and then
// calls `dispatchSubmit` to fire the parent `<form>`.
//
// `attributes.onclick` is reserved for WebAuthn payloads — when Ory
// hands back a `string` of JS, the component shells out to
// `callWebauthnFunction` which polls `window.__oryWebAuthnInitialized`
// before `eval`-ing the body. The stories don't exercise that path —
// they only cover the normal `setValue(value).then(dispatchSubmit)`
// chain.
const meta = {
  title: "Auth/Nodes/NodeInputButton",
  component: NodeInputButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Non-submit button renderer for Ory input nodes (`type === 'button'`). Clicking writes `attributes.value` into the form state (`setValue`) and then dispatches the parent `<form>` (`dispatchSubmit`).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    disabled: false,
    value: undefined,
    setValue: fn(async () => {}),
    dispatchSubmit: fn(async () => {}),
  },
  decorators: [
    Story => (
      <Box
        component="form"
        sx={{ p: 4 }}
        onSubmit={e => e.preventDefault()}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeInputButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeInputAttributes.node_type` is the wider `UiNodeInputAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"input"` automatically when
// the attrs are pre-built into a `UiNodeInputAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeButtonNode = (attributes: UiNodeInputAttributes, labelText: string): UiNode => ({
  type: "input",
  group: "totp",
  attributes: attributes as UiNode["attributes"],
  meta: { label: { id: 1070004, text: labelText, type: "info" } },
  messages: [],
});

const unlinkTotpAttrs: UiNodeInputAttributes = {
  name: "totp_unlink",
  type: "button",
  value: "true",
  required: false,
  node_type: "input",
  disabled: false,
};

const registerWebauthnAttrs: UiNodeInputAttributes = {
  name: "webauthn_register",
  type: "button",
  value: "trigger",
  required: false,
  node_type: "input",
  disabled: false,
};

export const Default: Story = {
  args: {
    node: makeButtonNode(unlinkTotpAttrs, "Unlink TOTP"),
    attributes: unlinkTotpAttrs,
  },
};

// Mirrors the WebAuthn register button — the label comes from the
// node's `meta.label.text`, the actual click handler still uses the
// normal `setValue → dispatchSubmit` chain because no `onclick`
// payload is provided.
export const Register: Story = {
  args: {
    node: makeButtonNode(registerWebauthnAttrs, "Register a new security key"),
    attributes: registerWebauthnAttrs,
  },
};

// Both `attributes.disabled` and the parent `disabled` prop are
// truthy — the component `||`s them, so either path locks the button.
export const Disabled: Story = {
  args: {
    node: makeButtonNode({ ...unlinkTotpAttrs, disabled: true }, "Unlink TOTP (disabled)"),
    attributes: { ...unlinkTotpAttrs, disabled: true },
    disabled: true,
  },
};

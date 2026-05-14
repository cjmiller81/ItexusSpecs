import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeTextAttributes } from "@ory/client";
import Box from "@mui/material/Box";
import { NodeText } from "./NodeText";

// `NodeText` renders an Ory `text`-type UI node. Most text nodes show
// the `attributes.text.text` inside a monospaced scrollable `<code>`
// block, but the lookup-secrets text node (`attributes.text.id ===
// 1050015`) has a custom branch that splays the secrets array as a
// grid, marking already-used codes with the literal word "Used"
// (recognised by their inner UiText id `1050014`).
//
// The component also handles a quirk in the Ory payload: the
// `context.secrets` value can be either a string or an array of
// UiText objects, and gets normalised before render.
const meta = {
  title: "Auth/Nodes/NodeText",
  component: NodeText,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders an Ory text node. The default branch wraps `attributes.text.text` in a monospaced scrollable `<code>` block; the lookup-secrets branch (`text.id === 1050015`) splays the `context.secrets` array as a grid and marks each used secret (`id === 1050014`) with the word `Used`.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 3, maxWidth: 640 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeText>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeTextAttributes.node_type` is the wider `UiNodeTextAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"text"` automatically when
// the attrs are pre-built into a `UiNodeTextAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeTextNode = (attributes: UiNodeTextAttributes, labelText: string): UiNode => ({
  type: "text",
  group: "default",
  attributes: attributes as UiNode["attributes"],
  meta: { label: { id: attributes.text.id, text: labelText, type: "info" } },
  messages: [],
});

// Plain text node — exercises the default `ScrollableCodeBox` branch.
const plainTextAttrs: UiNodeTextAttributes = {
  id: "recovery-code",
  text: {
    id: 1050005,
    type: "info",
    text: "ory_rc_2024_demo_recovery_token_value_abc123xyz",
    context: {},
  },
  node_type: "text",
};

// Lookup-secrets list — Ory sends `context.secrets` as an array; one
// of the entries (`id: 1050014`) marks an already-used secret.
const lookupSecretsArrayAttrs: UiNodeTextAttributes = {
  id: "lookup-secrets-list",
  text: {
    id: 1050015,
    type: "info",
    text: "These are your recovery codes — store them somewhere safe.",
    context: {
      secrets: [
        { id: 1050010, type: "info", text: "k4yh-7a2m", context: {} },
        { id: 1050014, type: "info", text: "f3xq-9b1n", context: {} },
        { id: 1050010, type: "info", text: "h8z2-q4cv", context: {} },
        { id: 1050010, type: "info", text: "m5pr-3jdo", context: {} },
        { id: 1050014, type: "info", text: "t9wn-6el5", context: {} },
        { id: 1050010, type: "info", text: "y2mb-x7s8", context: {} },
      ],
    },
  },
  node_type: "text",
};

// Lookup-secrets list — Ory sometimes sends `context.secrets` as a
// single string for the freshly-generated secret. The component
// normalises that to `[{ text: <string> }]` before render.
const lookupSecretsStringAttrs: UiNodeTextAttributes = {
  id: "lookup-secrets-single",
  text: {
    id: 1050015,
    type: "info",
    text: "Your new recovery code:",
    context: {
      secrets: "single-fresh-code-from-server",
    },
  },
  node_type: "text",
};

export const PlainText: Story = {
  args: {
    node: makeTextNode(plainTextAttrs, "Your recovery code"),
    attributes: plainTextAttrs,
  },
};

export const LookupSecretsList: Story = {
  args: {
    node: makeTextNode(lookupSecretsArrayAttrs, "Recovery codes"),
    attributes: lookupSecretsArrayAttrs,
  },
};

// Edge case — the string-shaped `context.secrets` returned for the
// freshly-generated lookup secret. The normalisation in the component
// wraps it into the same single-entry array shape.
export const SingleSecretAsString: Story = {
  args: {
    node: makeTextNode(lookupSecretsStringAttrs, "Recovery code"),
    attributes: lookupSecretsStringAttrs,
  },
};

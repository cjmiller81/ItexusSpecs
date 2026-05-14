import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeInputAttributes } from "@ory/client";
import Box from "@mui/material/Box";
import { fn } from "storybook/test";
import { NodeInputSubmit } from "./NodeInputSubmit";

// `NodeInputSubmit` renders the primary submit button for an Ory
// flow — the "Sign in", "Create account", "Update password" CTAs that
// sit at the bottom of every flow. It's a thin wrapper around the
// MUI contained `Button` whose `type="submit"` lets the surrounding
// `<form>` handle the actual dispatch.
const meta = {
  title: "Auth/Nodes/NodeInputSubmit",
  component: NodeInputSubmit,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Primary CTA button for an Ory flow form. Always renders as `type="submit"` so the surrounding `<form>` element handles dispatch; the component itself never reads `setValue` or `dispatchSubmit`.',
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
} satisfies Meta<typeof NodeInputSubmit>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeInputAttributes.node_type` is the wider `UiNodeInputAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"input"` automatically when
// the attrs are pre-built into a `UiNodeInputAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeSubmitNode = (attributes: UiNodeInputAttributes, labelText: string): UiNode => ({
  type: "input",
  group: "password",
  attributes: attributes as UiNode["attributes"],
  meta: { label: { id: 1070003, text: labelText, type: "info" } },
  messages: [],
});

const signInAttrs: UiNodeInputAttributes = {
  name: "method",
  type: "submit",
  value: "password",
  required: false,
  node_type: "input",
  disabled: false,
};

export const Default: Story = {
  args: {
    node: makeSubmitNode(signInAttrs, "Sign in"),
    attributes: signInAttrs,
  },
};

// `attributes.disabled` from Ory and the parent's `disabled` prop are
// `||`d together; the story sets both to verify the locked state.
export const Disabled: Story = {
  args: {
    node: makeSubmitNode({ ...signInAttrs, disabled: true }, "Sign in (disabled)"),
    attributes: { ...signInAttrs, disabled: true },
    disabled: true,
  },
};

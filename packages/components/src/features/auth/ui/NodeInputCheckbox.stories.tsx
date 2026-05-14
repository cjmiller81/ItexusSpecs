import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeInputAttributes, UiText } from "@ory/client";
import { useState } from "react";
import Box from "@mui/material/Box";
import { fn } from "storybook/test";
import { NodeInputCheckbox } from "./NodeInputCheckbox";
import type { NodeInputProps } from "./helpers";

// `NodeInputCheckbox` is the renderer for Ory `input` nodes whose
// attribute type is `checkbox` — most notably the "remember me" /
// "subscribe to newsletter" toggles attached to login + registration.
// Label resolution goes through `@ory/integrations/ui`'s
// `getNodeLabel`, which reads `node.meta.label.text` (with fallbacks
// to `attributes.label`).
//
// `attributes.value` is the initial checked state; on each change the
// component invokes the (async) `setValue` callback with the new
// boolean. `node.messages` are concatenated into the input's HTML
// `title` so any Ory validation hints show up as a native tooltip.
const meta = {
  title: "Auth/Nodes/NodeInputCheckbox",
  component: NodeInputCheckbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MUI `Checkbox` + `FormControlLabel` wrapper for Ory checkbox nodes. Uncontrolled by default (`defaultChecked` reads `attributes.value`); the change handler calls the async `setValue` callback with the new boolean.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    disabled: false,
    setValue: fn(async () => {}),
    dispatchSubmit: fn(async () => {}),
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeInputCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeInputAttributes.node_type` is the wider `UiNodeInputAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"input"` automatically when
// the attrs are pre-built into a `UiNodeInputAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeCheckboxNode = (attributes: UiNodeInputAttributes, labelText: string, messages: UiText[] = []): UiNode => ({
  type: "input",
  group: "default",
  attributes: attributes as UiNode["attributes"],
  meta: { label: { id: 1070002, text: labelText, type: "info" } },
  messages,
});

const newsletterAttrs: UiNodeInputAttributes = {
  name: "traits.newsletter",
  type: "checkbox",
  value: false,
  required: false,
  node_type: "input",
  disabled: false,
};

const rememberMeAttrs: UiNodeInputAttributes = {
  name: "remember",
  type: "checkbox",
  value: true,
  required: false,
  node_type: "input",
  disabled: false,
};

const ControlledRender = (args: NodeInputProps) => {
  const [value, setValue] = useState<boolean>(Boolean(args.attributes.value));
  return (
    <NodeInputCheckbox
      {...args}
      value={value}
      setValue={async next => {
        setValue(Boolean(next));
        await args.setValue(next);
      }}
    />
  );
};

export const Default: Story = {
  args: {
    node: makeCheckboxNode(newsletterAttrs, "Subscribe to our newsletter"),
    attributes: newsletterAttrs,
    value: false,
  },
  render: args => <ControlledRender {...args} />,
};

// `attributes.value` is truthy — the underlying MUI Checkbox starts
// already ticked via `defaultChecked`.
export const InitiallyChecked: Story = {
  args: {
    node: makeCheckboxNode(rememberMeAttrs, "Remember me on this device"),
    attributes: rememberMeAttrs,
    value: true,
  },
  render: args => <ControlledRender {...args} />,
};

// `attributes.disabled` flips on — this branch the component takes
// `attributes.disabled || disabled`, so either path locks the input.
export const Disabled: Story = {
  args: {
    node: makeCheckboxNode({ ...rememberMeAttrs, disabled: true }, "Remember me (disabled)"),
    attributes: { ...rememberMeAttrs, disabled: true },
    value: true,
    disabled: true,
  },
  render: args => <ControlledRender {...args} />,
};

// Adds `node.messages` — the component joins them with `\n` into the
// HTML `title` attribute, so hovering the checkbox surfaces the hint
// natively (visible in browser dev tools).
export const WithMessages: Story = {
  args: {
    node: makeCheckboxNode(newsletterAttrs, "Subscribe to our newsletter", [
      { id: 1070001, type: "info", text: "Hover to see this hint", context: {} },
    ]),
    attributes: newsletterAttrs,
    value: false,
  },
  render: args => <ControlledRender {...args} />,
};

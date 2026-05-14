import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeInputAttributes } from "@ory/client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { fn } from "storybook/test";
import { NodeInputDefault } from "./NodeInputDefault";
import type { NodeInputProps } from "./helpers";

// `NodeInputDefault` is the catch-all for Ory `input` nodes that
// don't match a more specific component (e.g. checkbox, submit,
// button). It renders an MUI `TextField` whose `type` mirrors the
// underlying attribute — `email`, `password`, plain `text`, etc.
//
// The component is fully controlled by `NodeInputProps`, so the
// stories provide a `ControlledRender` wrapper that owns `value`
// state and threads it back through the (async) `setValue` stub.
const meta = {
  title: "Auth/Nodes/NodeInputDefault",
  component: NodeInputDefault,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MUI `TextField` wrapper for generic Ory input nodes. `attributes.type` drives the underlying HTML input type (`email`, `password`, `text`, …); `node.meta.label.text` becomes the floating label. `attributes.onclick` is reserved for WebAuthn — the on-click path `eval`s the JavaScript string from Ory, which is intentionally not exercised here.",
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
      <Box sx={{ p: 4, width: 360 }}>
        <Stack spacing={2}>
          <Story />
        </Stack>
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeInputDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeInputAttributes.node_type` is the wider `UiNodeInputAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"input"` automatically when
// the attrs are pre-built into a `UiNodeInputAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeInputNode = (attributes: UiNodeInputAttributes, labelText: string): UiNode => ({
  type: "input",
  group: "default",
  attributes: attributes as UiNode["attributes"],
  meta: { label: { id: 1070002, text: labelText, type: "info" } },
  messages: [],
});

const emailAttrs: UiNodeInputAttributes = {
  name: "identifier",
  type: "email",
  required: true,
  node_type: "input",
  disabled: false,
};

const passwordAttrs: UiNodeInputAttributes = {
  name: "password",
  type: "password",
  required: true,
  node_type: "input",
  disabled: false,
};

const totpAttrs: UiNodeInputAttributes = {
  name: "totp_code",
  type: "text",
  required: true,
  node_type: "input",
  disabled: false,
};

const ControlledRender = (args: NodeInputProps) => {
  const [value, setValue] = useState<string>(args.value ?? "");
  return (
    <NodeInputDefault
      {...args}
      value={value}
      setValue={async next => {
        setValue(String(next ?? ""));
        await args.setValue(next);
      }}
    />
  );
};

export const Email: Story = {
  args: {
    node: makeInputNode(emailAttrs, "Email"),
    attributes: emailAttrs,
    value: "",
  },
  render: args => <ControlledRender {...args} />,
};

// MUI's `TextField type="password"` masks input — useful for verifying
// the type passthrough.
export const Password: Story = {
  args: {
    node: makeInputNode(passwordAttrs, "Password"),
    attributes: passwordAttrs,
    value: "",
  },
  render: args => <ControlledRender {...args} />,
};

// Six-digit TOTP code field — same `text` type, narrower visual usage.
export const TotpCode: Story = {
  args: {
    node: makeInputNode(totpAttrs, "Authenticator code"),
    attributes: totpAttrs,
    value: "",
  },
  render: args => <ControlledRender {...args} />,
};

// `disabled` can be set either by the parent (`disabled` prop on the
// component) or by Ory itself (`attributes.disabled`). The component
// `||`s them, so either path locks the field — the story sets both.
export const Disabled: Story = {
  args: {
    node: makeInputNode({ ...emailAttrs, disabled: true }, "Email (disabled)"),
    attributes: { ...emailAttrs, disabled: true },
    value: "demo@example.com",
    disabled: true,
  },
  render: args => <ControlledRender {...args} />,
};

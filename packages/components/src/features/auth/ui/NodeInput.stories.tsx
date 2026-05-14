import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeInputAttributes } from "@ory/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fn } from "storybook/test";
import { NodeInput } from "./NodeInput";
import type { NodeInputProps } from "./helpers";

// `NodeInput` is the inner dispatcher routing an Ory `input`-typed UI
// node to one of the five leaf renderers (`Hidden`, `Checkbox`,
// `Button`, `Submit`, `Default`). One story per `attributes.type`
// branch, plus a `HiddenRevealed` variant that wraps the hidden input
// in a `<details>` so reviewers can see the otherwise-invisible
// element on the docs page.
const meta = {
  title: "Auth/Nodes/NodeInput",
  component: NodeInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dispatcher for `input`-typed Ory nodes. Picks one of the five leaf renderers based on `attributes.type`. `Hidden` and `Submit` only emit a single `<input>` / `<button>`, so the stories wrap them in a `<form>` decorator for a realistic context.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    disabled: false,
    value: "",
    setValue: fn(async () => {}),
    dispatchSubmit: fn(async () => {}),
  },
  decorators: [
    Story => (
      <Box
        component="form"
        sx={{ p: 4, width: 360 }}
        onSubmit={e => e.preventDefault()}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeInputNode = (attributes: UiNodeInputAttributes, labelText: string): UiNode => ({
  type: "input",
  group: "default",
  attributes: attributes as unknown as UiNode["attributes"],
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

const checkboxAttrs: UiNodeInputAttributes = {
  name: "remember",
  type: "checkbox",
  value: true,
  required: false,
  node_type: "input",
  disabled: false,
};

const submitAttrs: UiNodeInputAttributes = {
  name: "method",
  type: "submit",
  value: "password",
  required: false,
  node_type: "input",
  disabled: false,
};

const buttonAttrs: UiNodeInputAttributes = {
  name: "totp_unlink",
  type: "button",
  value: "true",
  required: false,
  node_type: "input",
  disabled: false,
};

const hiddenAttrs: UiNodeInputAttributes = {
  name: "csrf_token",
  type: "hidden",
  value: "storybook-csrf-token",
  required: false,
  node_type: "input",
  disabled: false,
};

export const TextInputBranch: Story = {
  args: {
    node: makeInputNode(emailAttrs, "Email"),
    attributes: emailAttrs,
  },
};

export const CheckboxBranch: Story = {
  args: {
    node: makeInputNode(checkboxAttrs, "Remember me on this device"),
    attributes: checkboxAttrs,
  },
};

export const SubmitBranch: Story = {
  args: {
    node: makeInputNode(submitAttrs, "Sign in"),
    attributes: submitAttrs,
  },
};

export const ButtonBranch: Story = {
  args: {
    node: makeInputNode(buttonAttrs, "Unlink TOTP"),
    attributes: buttonAttrs,
  },
};

// `NodeInputHidden` emits a plain `<input type="hidden">` — nothing
// visible. This story exposes the rendered element via a sibling
// `<details>` block so reviewers can confirm the dispatch routed
// correctly without inspecting the DOM directly.
const HiddenRender = (args: NodeInputProps) => (
  <>
    <NodeInput {...args} />
    <details
      style={{ marginTop: 16, opacity: 0.7 }}
      open>
      <summary>
        <Typography
          variant="body2"
          component="span">
          Hidden input (rendered above; no visible UI)
        </Typography>
      </summary>
      <Typography
        variant="caption"
        component="pre"
        sx={{ mt: 1, opacity: 0.8 }}>
        {`<input type="hidden" name="${args.attributes.name}" value="${args.attributes.value || "true"}" />`}
      </Typography>
    </details>
  </>
);

export const HiddenBranch: Story = {
  args: {
    node: makeInputNode(hiddenAttrs, "CSRF token"),
    attributes: hiddenAttrs,
  },
  render: args => <HiddenRender {...args} />,
};

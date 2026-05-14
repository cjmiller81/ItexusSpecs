import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { fn } from "storybook/test";
import { Node } from "./Node";

// `Node` is the discriminated-union dispatcher that turns an Ory
// `UiNode` into the appropriate slot renderer:
//
//   - `isUiNodeImageAttributes` -> `<NodeImage>`
//   - `isUiNodeScriptAttributes` -> `<NodeScript>` (no UI surface; not exercised here)
//   - `isUiNodeTextAttributes` -> `<NodeText>`
//   - `isUiNodeAnchorAttributes` -> `<NodeAnchor>`
//   - `isUiNodeInputAttributes` -> `<NodeInput>` (which sub-dispatches by `attributes.type`)
//
// One story per branch — the individual renderers already have their
// own deep stories, this file just verifies the routing.
const meta = {
  title: "Auth/Nodes/Node",
  component: Node,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Discriminated-union dispatcher that routes a `UiNode` to one of the slot-specific renderers based on `attributes.node_type` / the corresponding type guard from `@ory/integrations/ui`.",
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
        <Stack spacing={2}>
          <Story />
        </Stack>
      </Box>
    ),
  ],
} satisfies Meta<typeof Node>;

export default meta;
type Story = StoryObj<typeof meta>;

const imageAttrs: UiNodeImageAttributes = {
  id: "node-image",
  src: "/oryIcon.svg",
  width: 64,
  height: 64,
  node_type: "img",
};
const imageNode: UiNode = {
  type: "img",
  group: "default",
  attributes: imageAttrs as unknown as UiNode["attributes"],
  meta: { label: { id: 1050009, text: "Ory branding", type: "info" } },
  messages: [],
};

const anchorAttrs: UiNodeAnchorAttributes = {
  id: "node-anchor",
  href: "#sign-up",
  title: { id: 1040004, text: "Create an account", type: "info" },
  node_type: "a",
};
const anchorNode: UiNode = {
  type: "a",
  group: "default",
  attributes: anchorAttrs as unknown as UiNode["attributes"],
  meta: { label: { id: 1040004, text: "Create an account", type: "info" } },
  messages: [],
};

const textAttrs: UiNodeTextAttributes = {
  id: "node-text",
  text: {
    id: 1050005,
    type: "info",
    text: "demo_recovery_code_token_value",
    context: {},
  },
  node_type: "text",
};
const textNode: UiNode = {
  type: "text",
  group: "default",
  attributes: textAttrs as unknown as UiNode["attributes"],
  meta: { label: { id: 1050005, text: "Recovery code", type: "info" } },
  messages: [],
};

const inputAttrs: UiNodeInputAttributes = {
  name: "identifier",
  type: "email",
  required: true,
  node_type: "input",
  disabled: false,
};
const inputNode: UiNode = {
  type: "input",
  group: "default",
  attributes: inputAttrs as unknown as UiNode["attributes"],
  meta: { label: { id: 1070002, text: "Email", type: "info" } },
  messages: [],
};

export const ImageBranch: Story = {
  args: { node: imageNode },
};

export const AnchorBranch: Story = {
  args: { node: anchorNode },
};

export const TextBranch: Story = {
  args: { node: textNode },
};

// Inputs route through a second dispatcher (`NodeInput`) which picks
// `NodeInputDefault` / `Checkbox` / `Submit` / `Button` / `Hidden`
// based on `attributes.type`. `NodeInput.stories.tsx` exercises each
// sub-branch individually.
export const InputBranch: Story = {
  args: { node: inputNode },
};

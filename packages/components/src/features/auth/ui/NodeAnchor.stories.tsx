import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeAnchorAttributes } from "@ory/client";
import Box from "@mui/material/Box";
import { NodeAnchor } from "./NodeAnchor";

// `NodeAnchor` renders an Ory `a`-type UI node (e.g. the "Sign in with
// Google" social-login button on the registration flow) as an MUI
// Button that, on click, hard-navigates the browser to
// `attributes.href`. The story-level `href` values use fragments
// (`#sign-in-google`) so reviewers can poke the button without leaving
// the Storybook iframe.
//
// The component reads `attributes.title.text` for the label and
// `attributes.id` for the data-testid — the `node` prop itself is
// accepted but unused by the current implementation.
const meta = {
  title: "Auth/Nodes/NodeAnchor",
  component: NodeAnchor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MUI Button wrapper around an Ory anchor node. On click, navigates `window.location.href` to `attributes.href` — stories use fragment URLs so reviewers can click without leaving the iframe.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 4 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeAnchor>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeAnchorAttributes.node_type` is the wider `UiNodeAnchorAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"a"` automatically when
// the attrs are pre-built into a `UiNodeAnchorAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeAnchorNode = (
  attributes: Partial<UiNodeAnchorAttributes> & Pick<UiNodeAnchorAttributes, "id" | "href" | "title">,
): UiNode => ({
  type: "a",
  group: "default",
  attributes: { ...attributes, node_type: "a" } as unknown as UiNode["attributes"],
  meta: { label: { id: attributes.title.id, text: attributes.title.text, type: "info" } },
  messages: [],
});

const signInWithGoogleAttrs: UiNodeAnchorAttributes = {
  id: "sign-in-google",
  href: "#sign-in-google",
  title: { id: 1040002, text: "Sign in with Google", type: "info" },
  node_type: "a",
};

const longLabelAttrs: UiNodeAnchorAttributes = {
  id: "long-label-anchor",
  href: "#return-to-previous-step-with-a-very-long-label",
  title: {
    id: 1040003,
    text: "Return to the previous step with a really long, ellipsis-friendly label",
    type: "info",
  },
  node_type: "a",
};

export const Default: Story = {
  args: {
    node: makeAnchorNode(signInWithGoogleAttrs),
    attributes: signInWithGoogleAttrs,
  },
};

// Verifies wrapping behaviour for unusually long anchor titles — Ory's
// social-login flows occasionally surface verbose provider names.
export const LongLabel: Story = {
  args: {
    node: makeAnchorNode(longLabelAttrs),
    attributes: longLabelAttrs,
  },
};

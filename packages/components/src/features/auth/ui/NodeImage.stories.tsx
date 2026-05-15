import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiNode, UiNodeImageAttributes } from "@ory/client";
import Box from "@mui/material/Box";
import { NodeImage } from "./NodeImage";

// `NodeImage` renders an Ory `img`-type UI node — most commonly the QR
// code Ory returns inside the TOTP-enrollment branch of a settings
// flow. The component is a thin `<img>` whose `src` comes from
// `attributes.src` and whose `alt` comes from `node.meta.label.text`.
const meta = {
  title: "Auth/Nodes/NodeImage",
  component: NodeImage,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Thin `<img>` wrapper for an Ory image node — typically a TOTP enrollment QR code. `src` comes from `attributes.src`; the accessible name reads from `node.meta.label?.text`.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 4, display: "inline-block", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 1 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof NodeImage>;

export default meta;
type Story = StoryObj<typeof meta>;

// `UiNodeImageAttributes.node_type` is the wider `UiNodeImageAttributesNodeTypeEnum`,
// which TS cannot narrow to the discriminator's literal `"img"` automatically when
// the attrs are pre-built into a `UiNodeImageAttributes`-annotated const. Cast the
// attributes slot through `UiNode["attributes"]` to thread the discriminated union.
const makeImageNode = (attributes: UiNodeImageAttributes, labelText: string): UiNode => ({
  type: "img",
  group: "totp",
  attributes: attributes as UiNode["attributes"],
  meta: { label: { id: 1050009, text: labelText, type: "info" } },
  messages: [],
});

// Static asset the consumer apps ship — copied into
// `packages/components/public/` so Storybook can serve it directly.
const oryIconAttrs: UiNodeImageAttributes = {
  id: "ory-icon",
  src: "/oryIcon.svg",
  width: 96,
  height: 96,
  node_type: "img",
};

// Inline SVG placeholder shaped like a real QR code so the story isn't
// dependent on any network or static asset. The proportions roughly
// match what Ory's TOTP flow returns.
const qrPlaceholderSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <g fill="#000000">
      <rect x="10" y="10" width="40" height="40"/>
      <rect x="130" y="10" width="40" height="40"/>
      <rect x="10" y="130" width="40" height="40"/>
      <rect x="20" y="20" width="20" height="20" fill="#ffffff"/>
      <rect x="140" y="20" width="20" height="20" fill="#ffffff"/>
      <rect x="20" y="140" width="20" height="20" fill="#ffffff"/>
      <rect x="70" y="70" width="40" height="40"/>
      <rect x="80" y="20" width="10" height="10"/>
      <rect x="100" y="40" width="10" height="10"/>
      <rect x="60" y="100" width="10" height="10"/>
      <rect x="120" y="120" width="10" height="10"/>
      <rect x="140" y="80" width="10" height="10"/>
      <rect x="100" y="140" width="10" height="10"/>
    </g>
  </svg>`,
);
const qrPlaceholderUri = `data:image/svg+xml;utf8,${qrPlaceholderSvg}`;

const totpQrAttrs: UiNodeImageAttributes = {
  id: "totp-qr",
  src: qrPlaceholderUri,
  width: 180,
  height: 180,
  node_type: "img",
};

export const Default: Story = {
  args: {
    node: makeImageNode(oryIconAttrs, "Ory branding"),
    attributes: oryIconAttrs,
  },
};

// Mirrors the TOTP-enrollment node shape — large square QR with an
// accessible name describing the action.
export const TotpQrCode: Story = {
  args: {
    node: makeImageNode(totpQrAttrs, "Scan this QR code with your authenticator app"),
    attributes: totpQrAttrs,
  },
};

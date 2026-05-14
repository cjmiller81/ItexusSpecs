import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { ProtectedByOryLabel } from "./protectedByOryLabel";

// `ProtectedByOryLabel` is the footer the auth pages render at the
// bottom of `AuthContainer`. It always shows the "Protected by Ory"
// branding (with the `/oryIcon.svg` static asset) and conditionally
// renders a right-aligned Terms link when `env.termsUrl` or
// `env.appTermsUrl` is non-empty. The hostname app is expected to
// provide `oryIcon.svg` under its public dir — Storybook ships a copy
// in `packages/components/public/` so the icon renders here too.
const meta = {
  title: "Auth/ProtectedByOryLabel",
  component: ProtectedByOryLabel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Auth-page footer with Ory branding and an optional Terms link. The Terms column collapses entirely when both `termsUrl` and `appTermsUrl` are empty.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ProtectedByOryLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTermsLink: Story = {
  args: {
    env: { termsUrl: "https://example.test/terms", appTermsUrl: "" },
  },
};

// Falls back to `appTermsUrl` when the primary `termsUrl` is empty.
export const TermsFallback: Story = {
  args: {
    env: { termsUrl: "", appTermsUrl: "https://example.test/app-terms" },
  },
};

// Neither URL provided — the right-side grid column stays empty so the
// "Protected by Ory" cluster remains visually centered.
export const WithoutTerms: Story = {
  args: {
    env: { termsUrl: "", appTermsUrl: "" },
  },
};

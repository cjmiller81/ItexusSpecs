import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Verification from "./verification";
import { oryHandlers } from "../../../storybookMocks/oryHandlers";

// Pages-Router Ory verification page. `createBrowserVerificationFlow`
// (or `getVerificationFlow` when `?flow=<id>` is present), then the
// generic `Flow` component rendered inside a `MarginCard`. The fixture
// in `oryHandlers.ts` is the initial `choose_method` stage, so stories
// render the email-input form; the `sent_email` stage transition is
// covered by `CustomRecoveryForm.stories.tsx` (same UX, different
// host).
//
// Like `Settings`, this page sits inside the host app's own page
// chrome and has no auth-themed wrapper of its own — the decorator
// adds a small gutter so the card has somewhere to sit on the canvas.
const meta = {
  title: "Auth/Pages/Verification",
  component: Verification,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Verification page composition — `createBrowserVerificationFlow` / `getVerificationFlow` on mount, then `Flow` inside a `MarginCard`. Forwards every visible state (`choose_method`, validation 400, expired 410) through `Flow`'s internal value tracking; the page-level catch handles the create-flow 400 (`already signed in` → `router.push('/')`) and the get-flow 410 (`router.push('/verification')`).",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 4, minHeight: "100vh" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Verification>;

export default meta;
type Story = StoryObj<typeof meta>;

// No `?flow=` — `createBrowserVerificationFlow` returns the
// `choose_method` fixture, the page lifts it into state, and `Flow`
// mounts the email input + send-code submit button.
export const Default: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.verificationBrowser] },
    nextjs: { router: { query: {} } },
  },
};

// `?flow=<id>` — `getVerificationFlow` returns the same fixture.
// As with `Settings.WithFlowId`, the rendered output is identical
// but the network trace shows the rehydrate path instead of the
// create-browser-flow path.
export const WithFlowId: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.verificationFlowFetch] },
    nextjs: { router: { query: { flow: "storybook-verification-flow" } } },
  },
};

// `createBrowserVerificationFlow` hangs — `flow` stays undefined,
// so `Flow` short-circuits to `null` and the page renders just the
// "Verify your account" headline (inside the otherwise-empty
// `MarginCard`) and the "Go back" link.
export const LoadingFlow: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.verificationBrowserDelay] },
    nextjs: { router: { query: {} } },
  },
};

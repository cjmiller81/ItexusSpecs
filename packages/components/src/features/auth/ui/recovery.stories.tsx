import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Recovery } from "./recovery";
import { oryHandlers } from "../../../storybookMocks/oryHandlers";

// Pages-Router recovery page composition — `getRecoveryFlow` or
// `createBrowserRecoveryFlow` on mount (keyed off `router.query.flow`),
// then `CustomRecoveryForm` inside `StyledAuthContainer`.
//
// Unlike `Login`, this component reads its flow id from
// `router.query.flow` (not `window.location.search`), so MSW + the
// router mock are enough to drive every visible state.
const meta = {
  title: "Auth/Pages/Recovery",
  component: Recovery,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Recovery page composition — covers the initial create-flow path (no `?flow=` query) and the rehydrate path (`?flow=<id>` returns the `sent_email` stage). On submit success, the production handler swaps `state` to `passed_challenge` and `window.location.replace(changePasswordRoute)` — Storybook records the redirect attempt without leaving the iframe.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    changePasswordRoute: "/profile",
    env: { termsUrl: "https://example.test/terms", appTermsUrl: "" },
  },
} satisfies Meta<typeof Recovery>;

export default meta;
type Story = StoryObj<typeof meta>;

// No `?flow=` — `createBrowserRecoveryFlow` returns the
// `choose_method` shape, so `CustomRecoveryForm` mounts in the
// email-input stage.
export const Default: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.recoveryBrowser] },
    nextjs: { router: { query: {} } },
  },
};

// `?flow=<id>` → `getRecoveryFlow` returns the `sent_email` shape
// (email captured, code input mounted, info-level message
// surfaced). `CustomRecoveryForm` swaps in the code-entry stage and
// renders the `Resend code` button bound to the page's
// `handleResend` callback.
export const SentEmailStage: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.recoveryFlowFetchSentEmail] },
    nextjs: { router: { query: { flow: "storybook-recovery-flow-sent" } } },
  },
};

// `createBrowserRecoveryFlow` hangs — the page never sets `flow`,
// so the `<Loader />` early-return branch holds.
export const LoadingFlow: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.recoveryBrowserDelay] },
    nextjs: { router: { query: {} } },
  },
};

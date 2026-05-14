import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Login } from "./login";
import { oryDefaultStacks, oryHandlers } from "../../../storybookMocks/oryHandlers";

// Page-level Pages-Router component that brokers Ory's
// `createBrowserLoginFlow` / `getLoginFlow` / `toSession` /
// `updateLoginFlow` calls, then renders `CustomLoginForm` inside
// `StyledAuthContainer`. After `createBrowserLoginFlow` resolves, the
// page sets local `flow` state (same pattern as `Recovery`) so the form
// mounts even when the iframe URL is not updated by `router.replace`.
const meta = {
  title: "Auth/Pages/Login",
  component: Login,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Login page composition — handles the `toSession` short-circuit, the `createBrowserLoginFlow` initialization, the `getLoginFlow` re-hydration, and the `updateLoginFlow` submission, then defers the actual UI to `CustomLoginForm` wrapped in `StyledAuthContainer`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    env: { termsUrl: "https://example.test/terms", appTermsUrl: "" },
  },
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

// Happy path — no `?flow=` in the URL, `toSession` is rejected
// (401), so `createFlow()` runs and `setFlow(...)` swaps the
// `Loader` for the populated `CustomLoginForm`.
export const Default: Story = {
  parameters: {
    msw: { handlers: oryDefaultStacks.login },
    nextjs: { router: { query: {} } },
  },
};

// `createBrowserLoginFlow` hangs indefinitely. `flow` stays `null`,
// so the `if (!flow) return <Loader />` branch sticks. The MSW
// `whoamiUnauthenticated` handler keeps `toSession` rejecting fast
// so the loader appears immediately.
export const LoadingFlow: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.whoamiUnauthenticated, oryHandlers.loginBrowserDelay] },
    nextjs: { router: { query: {} } },
  },
};

// `?aal2=true` triggers the AAL2 step-up branch — `createFlow`
// fires with `aal: "aal2"` and the MSW handler returns the TOTP
// variant of the flow fixture. The `CustomLoginForm` switches off
// the password block in favour of the authenticator-code input.
export const Aal2StepUp: Story = {
  parameters: {
    msw: { handlers: oryDefaultStacks.loginAal2 },
    nextjs: { router: { query: { aal2: "true" } } },
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorUi } from "./error";
import { oryHandlers } from "../../../storybookMocks/oryHandlers";

// Page-level Ory error renderer. Fires `ory.toSession()` on mount to
// decide whether the "Return to App" or "Try Login Again" button is
// shown, then keys off `router.query.id` / `router.query.error` to
// surface a specific Kratos flow error or an inline-encoded payload.
//
// Stories drive `router.query` via `parameters.nextjs.router.query`
// (the Pages-Router escape hatch — `nextjs.appDirectory` is *not* set
// because `error.tsx` reads from `next/router`, not
// `next/navigation`). MSW handlers from
// `src/storybookMocks/oryHandlers.ts` covers both the `toSession` call
// and the optional `getFlowError({ id })` lookup.
const meta = {
  title: "Auth/Pages/ErrorUi",
  component: ErrorUi,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Auth-page error renderer. Reads `?error=<encoded JSON>` for inline payloads or `?id=<flow-error-id>` for a Kratos lookup; the session check toggles the bottom CTA between `Return to App` (authenticated) and `Try Login Again` (unauthenticated).",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    env: { termsUrl: "https://example.test/terms", appTermsUrl: "" },
  },
} satisfies Meta<typeof ErrorUi>;

export default meta;
type Story = StoryObj<typeof meta>;

// No router params — both `id` and `error` are undefined, so the
// effect never fires the inline-parse or API-lookup branches. The
// card falls back to "An unknown error occurred!" and the bottom
// button is "Try Login Again" because the global MSW default plus
// our explicit `whoamiUnauthenticated` handler keep `session` null.
export const UnknownError: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.whoamiUnauthenticated] },
    nextjs: { router: { query: {} } },
  },
};

// `?error=<encoded-json>` — the effect parses the URI-decoded JSON
// and lifts `error.message` into the top headline. Mirrors what
// `HandleError`'s `fatalToError` redirect attaches on a 404 or
// non-HTTP network failure.
const inlineErrorPayload = encodeURIComponent(
  JSON.stringify({
    error: {
      code: 400,
      status: "Bad Request",
      reason: "The OIDC provider returned an invalid response.",
      message: "Invalid OIDC provider response (Storybook fixture)",
    },
  }),
);

export const WithErrorParam: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.whoamiUnauthenticated] },
    nextjs: { router: { query: { error: inlineErrorPayload } } },
  },
};

// `?id=<flow-error-id>` — the effect calls
// `ory.getFlowError({ id })`. The handler returns the
// `oryFixtures.flowError` shape; the card promotes
// `error.message` and dumps the full payload into the details
// disclosure.
export const WithIdParam: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.whoamiUnauthenticated, oryHandlers.flowError] },
    nextjs: { router: { query: { id: "storybook-error-id" } } },
  },
};

// `toSession()` resolves with an active session. The bottom button
// flips to "Return to App" and `router.push("/")` would fire on
// click (Storybook's router mock records it as an action).
export const AuthenticatedReturnToApp: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.whoamiAuthenticated, oryHandlers.flowError] },
    nextjs: { router: { query: { id: "storybook-error-id" } } },
  },
};

// `getFlowError({ id })` 404s. The catch branch lifts the axios
// error itself into the details `<pre>`; `errorMessage` falls back
// to the generic "An unknown error occurred!" headline because the
// 404 response has no `error.message` field.
export const FlowErrorNotFound: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.whoamiUnauthenticated, oryHandlers.flowErrorMissing] },
    nextjs: { router: { query: { id: "missing-error-id" } } },
  },
};

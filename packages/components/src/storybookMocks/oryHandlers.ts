/**
 * Default MSW handlers + fixtures for the Ory Kratos public API.
 *
 * The page-level auth components (`Login`, `Recovery`, `Settings`,
 * `Verification`, `ErrorUi`, `Registration`) all sit on top of the
 * `@ory/client` `FrontendApi` configured in
 * `packages/components/src/features/auth/lib/sdk.tsx`. In production
 * `process.env.ORY_SDK_URL` points the SDK at the host's Kratos public
 * endpoint; in Storybook the env var is unset, so the SDK falls back
 * to `basePath: ""` and issues requests against relative paths like
 * `/sessions/whoami`. The handlers below use wildcard path prefixes
 * (`star-slash-self-service-…`) so they match regardless of basePath.
 *
 * Lives under `src/storybookMocks/` (not `.storybook/mocks/`) so
 * imports from `*.stories.tsx` under `src/` stay inside `rootDir`.
 *
 * Unlike `billingHandlers.ts`, these are NOT registered globally —
 * they're opt-in per-story (or per-meta) via `parameters.msw.handlers`
 * because the auth pages are loud (every `toSession` rejection becomes
 * a `Loader`, every flow GET becomes a `CustomLoginForm` render) and
 * most non-auth stories shouldn't bear that footprint. The fixtures
 * are exported alongside so stories can derive variant handlers
 * cheaply (e.g. recovery's `sent_email` stage, error-page payloads).
 */

import { http, HttpResponse, delay } from "msw";
import type { LoginFlow, RecoveryFlow, RegistrationFlow, Session, SettingsFlow, VerificationFlow } from "@ory/client";

// ---- Shared constants ------------------------------------------------------

const ISO_2026_01_01 = "2026-01-01T00:00:00Z";
const ISO_2026_01_01_PLUS_1H = "2026-01-01T01:00:00Z";

// ---- Fixtures --------------------------------------------------------------

const sessionFixture: Session = {
  id: "storybook-session",
  active: true,
  authenticated_at: ISO_2026_01_01,
  authenticator_assurance_level: "aal1",
  expires_at: ISO_2026_01_01_PLUS_1H,
  issued_at: ISO_2026_01_01,
  identity: {
    id: "storybook-identity",
    schema_id: "default",
    schema_url: "https://example.test/schemas/default",
    state: "active",
    traits: {
      email: "demo@example.com",
      name: { first: "Demo", last: "User" },
      avatarUrl: "",
      newsletter: false,
    },
    verifiable_addresses: [],
    recovery_addresses: [],
    metadata_public: {},
    created_at: ISO_2026_01_01,
    updated_at: ISO_2026_01_01,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

// Login flow with email + password + recovery / sign-up anchors. The
// shape matches what Kratos returns for a fresh
// `createBrowserLoginFlow({ refresh: false })` call against the
// production identity-schema.
const loginFlowFixture: LoginFlow = {
  id: "storybook-login-flow",
  type: "browser",
  expires_at: ISO_2026_01_01_PLUS_1H,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/login/browser",
  ui: {
    action: "https://example.test/self-service/login",
    method: "POST",
    messages: [],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "identifier",
          type: "email",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070002, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070001, text: "Password", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1010001, text: "Sign in", type: "info" } },
        messages: [],
      },
      {
        type: "a",
        group: "default",
        attributes: {
          id: "recovery-link",
          href: "/ui/recovery",
          title: { id: 1060001, text: "Forgot password?", type: "info" },
          node_type: "a",
        },
        meta: { label: { id: 1060001, text: "Forgot password?", type: "info" } },
        messages: [],
      },
      {
        type: "a",
        group: "default",
        attributes: {
          id: "signup-link",
          href: "/ui/registration",
          title: { id: 1040003, text: "Sign up", type: "info" },
          node_type: "a",
        },
        meta: { label: { id: 1040003, text: "Sign up", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Variant of `loginFlowFixture` returned when Kratos issues an AAL2
// step-up challenge — the `totp_code` input replaces the password
// block, and the method value flips to `totp`.
const loginFlowAal2Fixture: LoginFlow = {
  ...loginFlowFixture,
  id: "storybook-login-flow-aal2",
  requested_aal: "aal2",
  ui: {
    ...loginFlowFixture.ui,
    nodes: [
      loginFlowFixture.ui.nodes[0], // csrf
      loginFlowFixture.ui.nodes[1], // identifier
      {
        type: "input",
        group: "totp",
        attributes: {
          name: "totp_code",
          type: "text",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070003, text: "Authenticator code", type: "info" } },
        messages: [],
      },
      {
        ...loginFlowFixture.ui.nodes[3],
        attributes: {
          ...loginFlowFixture.ui.nodes[3].attributes,
          value: "totp",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Recovery flow — initial `choose_method` stage, asking for the email
// address. The `code` group covers both the initial input and the
// post-`sent_email` code input; the second stage is built off this
// fixture by `recoverySentEmailFlowFixture` below.
const recoveryFlowFixture: RecoveryFlow = {
  id: "storybook-recovery-flow",
  type: "browser",
  expires_at: ISO_2026_01_01_PLUS_1H,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/recovery/browser",
  state: "choose_method",
  ui: {
    action: "https://example.test/self-service/recovery",
    method: "POST",
    messages: [],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "email",
          type: "email",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070007, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "method",
          type: "submit",
          value: "code",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070005, text: "Submit", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const recoverySentEmailFlowFixture: RecoveryFlow = {
  ...recoveryFlowFixture,
  id: "storybook-recovery-flow-sent",
  state: "sent_email",
  ui: {
    ...recoveryFlowFixture.ui,
    messages: [
      {
        id: 1060003,
        type: "info",
        text: "An email containing a recovery code has been sent to the email address you provided.",
        context: {},
      },
    ],
    nodes: [
      recoveryFlowFixture.ui.nodes[0], // csrf
      {
        ...recoveryFlowFixture.ui.nodes[1],
        attributes: {
          ...recoveryFlowFixture.ui.nodes[1].attributes,
          value: "demo@example.com",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "code",
          type: "text",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070008, text: "Recovery code", type: "info" } },
        messages: [],
      },
      {
        ...recoveryFlowFixture.ui.nodes[2],
        attributes: {
          ...recoveryFlowFixture.ui.nodes[2].attributes,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    ],
  },
};

// Settings flow with a `profile` section plus a `password` section.
// The Settings page renders one `SettingsCard` per non-empty group;
// matching the production schema means at least the profile + password
// sections render so reviewers see the two-section layout.
const settingsFlowFixture: SettingsFlow = {
  id: "storybook-settings-flow",
  type: "browser",
  expires_at: ISO_2026_01_01_PLUS_1H,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/settings/browser",
  state: "show_form",
  ui: {
    action: "https://example.test/self-service/settings",
    method: "POST",
    messages: [],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "profile",
        attributes: {
          name: "traits.email",
          type: "email",
          value: "demo@example.com",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070002, text: "E-Mail", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "profile",
        attributes: {
          name: "method",
          type: "submit",
          value: "profile",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070003, text: "Save", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070001, text: "New password", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070003, text: "Save", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity: sessionFixture.identity as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const verificationFlowFixture: VerificationFlow = {
  id: "storybook-verification-flow",
  type: "browser",
  expires_at: ISO_2026_01_01_PLUS_1H,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/verification/browser",
  state: "choose_method",
  ui: {
    action: "https://example.test/self-service/verification",
    method: "POST",
    messages: [],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "email",
          type: "email",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070007, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "code",
        attributes: {
          name: "method",
          type: "submit",
          value: "code",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070005, text: "Send verification code", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const registrationFlowFixture: RegistrationFlow = {
  id: "storybook-registration-flow",
  type: "browser",
  expires_at: ISO_2026_01_01_PLUS_1H,
  issued_at: ISO_2026_01_01,
  request_url: "https://example.test/self-service/registration/browser",
  ui: {
    action: "https://example.test/self-service/registration",
    method: "POST",
    messages: [],
    nodes: [
      {
        type: "input",
        group: "default",
        attributes: {
          name: "csrf_token",
          type: "hidden",
          value: "storybook-csrf",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: {},
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "traits.email",
          type: "email",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070002, text: "Email", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "password",
          type: "password",
          value: "",
          required: true,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1070001, text: "Password", type: "info" } },
        messages: [],
      },
      {
        type: "input",
        group: "password",
        attributes: {
          name: "method",
          type: "submit",
          value: "password",
          required: false,
          node_type: "input",
          disabled: false,
        },
        meta: { label: { id: 1040001, text: "Create account", type: "info" } },
        messages: [],
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Flow-error payload returned by `getFlowError({ id })`. The
// `ErrorUi` page stringifies the response wholesale into a `<pre>` and
// surfaces the top-level `error.message` above the details disclosure.
const flowErrorFixture = {
  id: "storybook-error-id",
  created_at: ISO_2026_01_01,
  updated_at: ISO_2026_01_01,
  error: {
    code: 500,
    status: "Internal Server Error",
    reason: "The authentication flow could not be completed.",
    message: "The authentication flow could not be completed.",
  },
};

export const oryFixtures = {
  session: sessionFixture,
  loginFlow: loginFlowFixture,
  loginFlowAal2: loginFlowAal2Fixture,
  recoveryFlow: recoveryFlowFixture,
  recoverySentEmailFlow: recoverySentEmailFlowFixture,
  settingsFlow: settingsFlowFixture,
  verificationFlow: verificationFlowFixture,
  registrationFlow: registrationFlowFixture,
  flowError: flowErrorFixture,
};

// ---- Handlers --------------------------------------------------------------

// Kratos returns 401 with `{ error: ... }` when called without a
// session cookie; the page-level components rely on this catch branch
// to drop into the unauthenticated render path.
const unauthenticatedResponse = () =>
  HttpResponse.json(
    {
      error: {
        id: "session_inactive",
        code: 401,
        status: "Unauthorized",
        message: "No active session was found in the request.",
      },
    },
    { status: 401 },
  );

export const oryHandlers = {
  whoamiUnauthenticated: http.get("*/sessions/whoami", () => unauthenticatedResponse()),
  whoamiAuthenticated: http.get("*/sessions/whoami", () => HttpResponse.json(sessionFixture)),
  whoamiDelay: http.get("*/sessions/whoami", async () => {
    await delay("infinite");
    return unauthenticatedResponse();
  }),

  // Login
  loginBrowser: http.get("*/self-service/login/browser", () => HttpResponse.json(loginFlowFixture)),
  loginBrowserAal2: http.get("*/self-service/login/browser", () => HttpResponse.json(loginFlowAal2Fixture)),
  loginBrowserDelay: http.get("*/self-service/login/browser", async () => {
    await delay("infinite");
    return HttpResponse.json(loginFlowFixture);
  }),
  loginFlowFetch: http.get("*/self-service/login/flows", () => HttpResponse.json(loginFlowFixture)),
  loginUpdate: http.post("*/self-service/login", () => HttpResponse.json(loginFlowFixture)),

  // Recovery
  recoveryBrowser: http.get("*/self-service/recovery/browser", () => HttpResponse.json(recoveryFlowFixture)),
  recoveryBrowserDelay: http.get("*/self-service/recovery/browser", async () => {
    await delay("infinite");
    return HttpResponse.json(recoveryFlowFixture);
  }),
  recoveryFlowFetch: http.get("*/self-service/recovery/flows", () => HttpResponse.json(recoveryFlowFixture)),
  recoveryFlowFetchSentEmail: http.get("*/self-service/recovery/flows", () =>
    HttpResponse.json(recoverySentEmailFlowFixture),
  ),
  recoveryUpdate: http.post("*/self-service/recovery", () => HttpResponse.json(recoverySentEmailFlowFixture)),

  // Settings
  settingsBrowser: http.get("*/self-service/settings/browser", () => HttpResponse.json(settingsFlowFixture)),
  settingsBrowserDelay: http.get("*/self-service/settings/browser", async () => {
    await delay("infinite");
    return HttpResponse.json(settingsFlowFixture);
  }),
  settingsFlowFetch: http.get("*/self-service/settings/flows", () => HttpResponse.json(settingsFlowFixture)),
  settingsUpdate: http.post("*/self-service/settings", () => HttpResponse.json(settingsFlowFixture)),

  // Verification
  verificationBrowser: http.get("*/self-service/verification/browser", () =>
    HttpResponse.json(verificationFlowFixture),
  ),
  verificationBrowserDelay: http.get("*/self-service/verification/browser", async () => {
    await delay("infinite");
    return HttpResponse.json(verificationFlowFixture);
  }),
  verificationFlowFetch: http.get("*/self-service/verification/flows", () =>
    HttpResponse.json(verificationFlowFixture),
  ),
  verificationUpdate: http.post("*/self-service/verification", () => HttpResponse.json(verificationFlowFixture)),

  // Registration
  registrationBrowser: http.get("*/self-service/registration/browser", () =>
    HttpResponse.json(registrationFlowFixture),
  ),
  registrationFlowFetch: http.get("*/self-service/registration/flows", () =>
    HttpResponse.json(registrationFlowFixture),
  ),
  registrationUpdate: http.post("*/self-service/registration", () => HttpResponse.json(registrationFlowFixture)),

  // Errors
  flowError: http.get("*/self-service/errors", () => HttpResponse.json(flowErrorFixture)),
  flowErrorMissing: http.get("*/self-service/errors", () =>
    HttpResponse.json({ error: { code: 404, status: "Not Found", message: "error not found" } }, { status: 404 }),
  ),
};

// Convenience bundles for the most common per-page handler stacks.
// Stories that want a different shape compose `oryHandlers.*` directly.
export const oryDefaultStacks = {
  login: [oryHandlers.whoamiUnauthenticated, oryHandlers.loginBrowser, oryHandlers.loginFlowFetch],
  loginAal2: [oryHandlers.whoamiUnauthenticated, oryHandlers.loginBrowserAal2, oryHandlers.loginFlowFetch],
  recovery: [oryHandlers.recoveryBrowser, oryHandlers.recoveryFlowFetch],
  recoverySentEmail: [oryHandlers.recoveryBrowser, oryHandlers.recoveryFlowFetchSentEmail],
  settings: [oryHandlers.settingsBrowser, oryHandlers.settingsFlowFetch],
  verification: [oryHandlers.verificationBrowser, oryHandlers.verificationFlowFetch],
  registration: [oryHandlers.registrationBrowser, oryHandlers.registrationFlowFetch],
  errorWithId: [oryHandlers.whoamiUnauthenticated, oryHandlers.flowError],
  errorAuthenticated: [oryHandlers.whoamiAuthenticated, oryHandlers.flowError],
};

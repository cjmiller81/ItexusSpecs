import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay, http, HttpResponse } from "msw";
import Registration from "./registration";

// Pages-Router Ory registration page. The component is shaped like
// `Login` (Ory `createBrowserRegistrationFlow` / `getRegistrationFlow`,
// `<Loader />` fallback, then render) but the actual form is rendered
// by `<Registration>` from `@ory/elements-react/theme` rather than a
// bespoke `CustomLoginForm`-style component.
//
// The two prop-clean variants — `Disabled` (Kratos rejects the
// create-flow with `self_service_flow_disabled`) and `LoadingFlow`
// (create-flow hangs, the `<Loader />` branch holds) — are storied
// here. The happy-path branch isn't exercised because
// `@ory/elements-react`'s `<Registration>` brings its own session
// check + flow refresh logic on top of Ory's SDK; covering that
// inside this Storybook setup would mean either pinning a private
// API or shipping a much larger MSW stack than the rest of the auth
// stories use.
const meta = {
  title: "Auth/Pages/Registration",
  component: Registration,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Registration page composition — `createBrowserRegistrationFlow` on mount, `<Loader />` while loading, and either the disabled-registration error pane (if Kratos returns `self_service_flow_disabled`) or `<Registration>` from `@ory/elements-react/theme` (not storied; third-party component with its own internal session/flow plumbing).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Registration>;

export default meta;
type Story = StoryObj<typeof meta>;

// `createBrowserRegistrationFlow` 400s with the
// `self_service_flow_disabled` payload — the page lifts the error
// into state and renders the centred "registration disabled"
// fallback with a Home button.
const disabledRegistrationHandler = http.get("*/self-service/registration/browser", () =>
  HttpResponse.json(
    {
      error: {
        id: "self_service_flow_disabled",
        code: 400,
        status: "Bad Request",
        message: "Self-service registration is disabled.",
      },
    },
    { status: 400 },
  ),
);

export const Disabled: Story = {
  parameters: {
    msw: { handlers: [disabledRegistrationHandler] },
    nextjs: { router: { query: {} } },
  },
};

// `createBrowserRegistrationFlow` hangs — `flow` and `error` both
// stay undefined, so the `<Loader />` early-return holds. The delay
// has to live on the create-flow handler specifically (not the
// `getRegistrationFlow` rehydrate handler) because no `?flow=` query
// is present.
const loadingRegistrationHandler = http.get("*/self-service/registration/browser", async () => {
  await delay("infinite");
  return HttpResponse.json({});
});

export const LoadingFlow: Story = {
  parameters: {
    msw: { handlers: [loadingRegistrationHandler] },
    nextjs: { router: { query: {} } },
  },
};

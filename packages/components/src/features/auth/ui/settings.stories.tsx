import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Settings from "./settings";
import { oryHandlers } from "../../../storybookMocks/oryHandlers";

// Pages-Router Ory settings page. Mounts seven optional
// `SettingsCard` sections — profile, password, oidc, lookup_secret,
// totp, webauthn, passkey — each conditioned on the matching `group`
// having nodes in the loaded `SettingsFlow`. The fixture in
// `oryHandlers.ts` ships `profile` + `password` populated, so two
// cards render by default; reviewers can extend the fixture per
// story to see the other branches.
//
// Settings doesn't wrap itself in the dark `StyledAuthContainer` —
// it expects to be mounted inside the host app's own page chrome,
// so the story decorator adds a small light-grey gutter for
// readability.
const meta = {
  title: "Auth/Pages/Settings",
  component: Settings,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Settings page composition — `createBrowserSettingsFlow` / `getSettingsFlow` on mount, then one `SettingsCard` per non-empty `flow.ui.nodes` group. `Flow` is rendered per section with the matching `only` filter so each card only owns its half of the form submissions.",
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
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

// No `?flow=` — `createBrowserSettingsFlow` returns the fixture
// with `profile` + `password` groups, so two cards render below
// the "Go back" link. The other group cards short-circuit to
// `null` because their group has no nodes.
export const Default: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.settingsBrowser] },
    nextjs: { router: { query: {} } },
  },
};

// `?flow=<id>` — `getSettingsFlow` returns the same fixture; the
// page sets `flow` and skips the create-browser-flow call. The
// rendered output is identical to `Default`, but the network
// trace in the Storybook MSW addon panel shows the
// `/self-service/settings/flows?id=…` GET instead of the browser
// init.
export const WithFlowId: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.settingsFlowFetch] },
    nextjs: { router: { query: { flow: "storybook-settings-flow" } } },
  },
};

// `createBrowserSettingsFlow` hangs — `flow` stays undefined, so
// every `SettingsCard` returns `null` and only the trailing
// "Go back" link renders. Mirrors the brief blank-page interval
// before Kratos responds.
export const LoadingFlow: Story = {
  parameters: {
    msw: { handlers: [oryHandlers.settingsBrowserDelay] },
    nextjs: { router: { query: {} } },
  },
};

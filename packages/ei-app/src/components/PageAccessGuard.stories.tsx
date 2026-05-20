import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { PageAccessGuard } from "./PageAccessGuard";
import { unentitledBillingState } from "components/src/storybookMocks/subscriptionStoryStates";
import type { BillingState } from "components/src/slices/billingSlice";

// `PageAccessGuard` blocks an entire page until the active subscription
// grants access to the requested route. Three branches:
//
//   1. `isLoading` → centered MUI CircularProgress.
//   2. `hasPageAccess(requiredPage) === false` → either the supplied
//      `fallbackComponent`, or the built-in "Access Restricted" panel with
//      Go Back / Upgrade Plan CTAs.
//   3. Page is allowed → render `children` as-is.
//
// All three branches are driven from `state.billing` via `useSubscription`,
// so each story preloads the slice via `parameters.reduxState.billing`. The
// default for every story in the preview is the fully-entitled state — only
// the gated variants override it.

const ProtectedPanel = () => (
  <Paper
    elevation={3}
    sx={{ p: 4, maxWidth: 480, textAlign: "center" }}>
    <Typography
      variant="h5"
      gutterBottom>
      Protected page
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary">
      This panel only renders when the active subscription grants access to <code>/charts</code>.
    </Typography>
  </Paper>
);

// `useSubscription` treats `billing === null` as still-loading, so we
// pre-load the slice with an explicitly empty shape to drive the spinner.
const loadingBillingState: BillingState = {
  plans: [],
  billing: null,
  loading: false,
  error: null,
  subscription: null,
  subscriptions: null,
  defaultSourceId: null,
  paymentIntentClientSecret: null,
  paymentMethods: [],
  customerId: null,
  product: null,
  products: null,
};

const meta = {
  title: "EI App/Components/PageAccessGuard",
  component: PageAccessGuard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page-level subscription guard. Reads `state.billing` via `useSubscription` and either renders the children, the built-in upgrade panel, or a caller-supplied `fallbackComponent`. The HOC `withPageAccess(Component, requiredPage)` wraps a whole page in one line.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    requiredPage: "/charts",
    children: <ProtectedPanel />,
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, minHeight: "70vh" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof PageAccessGuard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default: entitled subscription (set in preview.tsx) → children render.
export const Default: Story = {};

// Loading: `useSubscription` is still waiting on billing data → spinner.
export const Loading: Story = {
  parameters: {
    reduxState: { billing: loadingBillingState },
  },
};

// Restricted: no active subscription → built-in upgrade panel.
export const Restricted: Story = {
  parameters: {
    reduxState: { billing: unentitledBillingState },
  },
};

// Restricted with custom fallback: same gate, but the page supplies its own
// "you don't have access" UI instead of the built-in panel.
export const RestrictedWithFallback: Story = {
  name: "Restricted with custom fallback",
  args: {
    fallbackComponent: (
      <Box sx={{ p: 6, textAlign: "center", color: "warning.main" }}>
        <Typography variant="h6">Custom fallback UI</Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          The page passes its own component instead of the default upgrade panel.
        </Typography>
      </Box>
    ),
  },
  parameters: {
    reduxState: { billing: unentitledBillingState },
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay, http, HttpResponse } from "msw";
import Box from "@mui/material/Box";
import { BillingApiUsageCard } from "./BillingApiUsageCard";

// BillingApiUsageCard fetches `/api/request-tracking/status` on mount and
// renders the user's API usage for the current billing period (total
// requests, allowed, percentage, remaining, average daily). Each story
// supplies its own MSW handler under `parameters.msw.handlers` to drive
// the loading / loaded / error states.
//
// `currentPeriodEnd` is a Stripe-style Unix timestamp (seconds since
// epoch) used for the "Renews on" line — the stories pin a deterministic
// future date so the rendered copy doesn't drift on each reload.
const FIXED_RENEWAL_TIMESTAMP = Math.floor(new Date("2026-12-15T00:00:00Z").getTime() / 1000);

const sampleUsage = {
  userId: "storybook-user",
  startDate: new Date("2026-11-01T00:00:00Z").toISOString(),
  endDate: new Date("2026-11-30T23:59:59Z").toISOString(),
  totalRequests: 1234,
  allowedRequests: 5000,
};

const meta = {
  title: "Profile/Billing/BillingApiUsageCard",
  component: BillingApiUsageCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "API usage card for the current billing period. Fetches `/api/request-tracking/status` via `appAxios` on mount; the stories below provide per-state MSW handlers under `parameters.msw.handlers`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    currentPeriodEnd: FIXED_RENEWAL_TIMESTAMP,
  },
  argTypes: {
    currentPeriodEnd: {
      control: { type: "number" },
      description: "Unix timestamp (seconds) for the billing period renewal date",
    },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof BillingApiUsageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/request-tracking/status", async () => {
          await delay("infinite");
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// Happy path — reasonable usage well under the limit.
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [http.get("*/api/request-tracking/status", () => HttpResponse.json(sampleUsage))],
    },
  },
};

// User has consumed almost their full allowance — exercises the high
// percentage branch on the LinearProgress and the green-typography
// "remaining calls" tile.
export const NearLimit: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/request-tracking/status", () => HttpResponse.json({ ...sampleUsage, totalRequests: 4900 })),
      ],
    },
  },
};

// Network failure — totals fall back to "--".
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/request-tracking/status", () =>
          HttpResponse.json({ message: "Request tracking unavailable" }, { status: 500 }),
        ),
      ],
    },
  },
};

// No `currentPeriodEnd` prop — "Renews on" reads "--".
export const MissingRenewalDate: Story = {
  args: { currentPeriodEnd: undefined },
  parameters: {
    msw: {
      handlers: [http.get("*/api/request-tracking/status", () => HttpResponse.json(sampleUsage))],
    },
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";

import CalendarEventTile from "./CalendarEventTile";
import type { CalendarEvent } from "./eventsResponseModel";

const baseEvent: CalendarEvent = {
  id: 1,
  title: { en: "Mainnet launch on Layer 2 networks" },
  coins: [{ id: "bitcoin", name: "Bitcoin", rank: 1, symbol: "BTC", fullname: "Bitcoin (BTC)" }],
  date_event: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
  can_occur_before: false,
  created_date: new Date().toISOString(),
  displayed_date: "in 3 days",
  categories: [{ id: 10, name: "Release" }],
  proof: "https://example.com/proof",
  source: "https://example.com/event",
};

const meta: Meta<typeof CalendarEventTile> = {
  title: "EI App/Dashboard/CalendarEventTile",
  component: CalendarEventTile,
  parameters: {
    layout: "centered",
    // `CalendarEventTile`'s props extend MUI's `StackProps`, which exposes
    // `color`, `bgcolor`, `borderColor`, etc. typed as the polymorphic
    // `ResponsiveStyleValue<…>` — react-docgen-typescript flags those as the
    // catch-all `"other"` kind. Combined with the preview-level matcher
    // ``color: /(background|color)$/i`` in `.storybook/preview.tsx`, autodocs
    // tries to render them with a color picker and logs:
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead"
    // None of these inherited Stack props are meaningful for this story —
    // every variation just swaps `event`. Restrict the controls panel
    // accordingly so the matcher never has a chance to fire.
    controls: { include: ["event"] },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 420, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    event: baseEvent,
  },
};

export default meta;

type Story = StoryObj<typeof CalendarEventTile>;

export const ReleaseUpdate: Story = {};

export const ExchangeListing: Story = {
  args: {
    event: {
      ...baseEvent,
      id: 2,
      title: { en: "USDC listing on a major exchange" },
      coins: [
        {
          id: "usd-coin",
          name: "USD Coin",
          rank: 7,
          symbol: "USDC",
          fullname: "USD Coin (USDC)",
        },
      ],
      categories: [{ id: 4, name: "Exchange Listing" }],
    },
  },
};

export const TokenUnlock: Story = {
  args: {
    event: {
      ...baseEvent,
      id: 3,
      title: { en: "Scheduled token unlock and vesting cliff" },
      coins: [
        { id: "aptos", name: "Aptos", rank: 30, symbol: "APT", fullname: "Aptos (APT)" },
        {
          id: "arbitrum",
          name: "Arbitrum",
          rank: 45,
          symbol: "ARB",
          fullname: "Arbitrum (ARB)",
        },
        {
          id: "optimism",
          name: "Optimism",
          rank: 60,
          symbol: "OP",
          fullname: "Optimism (OP)",
        },
      ],
      categories: [{ id: 5, name: "Token Unlock" }],
    },
  },
};

export const ConferenceEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      id: 4,
      title: { en: "Devcon developer conference keynote" },
      categories: [{ id: 1, name: "Conference" }],
    },
  },
};

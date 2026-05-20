import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import CryptoCalendar from "./CryptoCalendar";
import type { CalendarEvent } from "./eventsResponseModel";

const dayOffset = (n: number): string => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
};

const sampleEvents: CalendarEvent[] = [
  {
    id: 201,
    title: { en: "Mainnet upgrade — performance release" },
    coins: [{ id: "ethereum", name: "Ethereum", rank: 2, symbol: "ETH", fullname: "Ethereum (ETH)" }],
    date_event: dayOffset(0),
    can_occur_before: false,
    created_date: dayOffset(-3),
    displayed_date: "Today",
    categories: [{ id: 1, name: "Release" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/201",
  },
  {
    id: 202,
    title: { en: "Exchange listing on a tier-1 venue" },
    coins: [{ id: "arbitrum", name: "Arbitrum", rank: 45, symbol: "ARB", fullname: "Arbitrum (ARB)" }],
    date_event: dayOffset(2),
    can_occur_before: false,
    created_date: dayOffset(-2),
    displayed_date: "in 2 days",
    categories: [{ id: 4, name: "Exchange Listing" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/202",
  },
  {
    id: 203,
    title: { en: "Token unlock — vesting cliff" },
    coins: [
      { id: "aptos", name: "Aptos", rank: 30, symbol: "APT", fullname: "Aptos (APT)" },
      { id: "optimism", name: "Optimism", rank: 60, symbol: "OP", fullname: "Optimism (OP)" },
    ],
    date_event: dayOffset(4),
    can_occur_before: false,
    created_date: dayOffset(-1),
    displayed_date: "in 4 days",
    categories: [{ id: 5, name: "Token Unlock" }],
    proof: "https://example.com/proof",
    source: "https://example.com/event/203",
  },
];

const today = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();
const sevenDaysFromNow = (() => {
  const d = new Date(today);
  d.setDate(d.getDate() + 7);
  return d;
})();

// `onFetchPage` is the CoinsLookupVirtualized callback; storybook stubs it
// with an empty page so the dropdown opens cleanly without a live coins API.
const noopFetchPage = async () => ({
  items: [],
  pageNumber: 1,
  totalCount: 0,
});

const meta: Meta<typeof CryptoCalendar> = {
  title: "EI App/Dashboard/CryptoCalendar",
  component: CryptoCalendar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <Box sx={{ width: "100%", maxWidth: 540, mx: "auto", p: 2, height: 760 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Calendar",
    icon: <CalendarMonthIcon fontSize="small" />,
    loading: false,
    calendarData: sampleEvents,
    selectedDate: [today, sevenDaysFromNow],
    setSelectedDate: () => {},
    onFetchPage: noopFetchPage,
  },
};

export default meta;

type Story = StoryObj<typeof CryptoCalendar>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
    calendarData: [],
  },
};

export const Empty: Story = {
  args: {
    calendarData: [],
  },
};

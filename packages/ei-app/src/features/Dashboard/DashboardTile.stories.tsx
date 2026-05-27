import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Button, Typography } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import { DashboardTile } from "./DashboardTile";

const PlaceholderContent = () => (
  <Box sx={{ p: 2, color: "text.secondary" }}>
    <Typography variant="body2">
      Children go here. This is where a chart, list, or table would render inside the tile.
    </Typography>
  </Box>
);

const meta: Meta<typeof DashboardTile> = {
  title: "EI App/Dashboard/DashboardTile",
  component: DashboardTile,
  parameters: {
    layout: "centered",
    // `DashboardTileProps` is `Omit<StackProps, 'title'> & {...}`, so it
    // inherits MUI Stack's `color` / `bgcolor` / `borderColor`, typed as
    // `ResponsiveStyleValue<…>` (react-docgen "other"). Combined with the
    // preview-level matcher ``color: /(background|color)$/i``
    // (see `.storybook/preview.tsx`), autodocs would log
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead".
    // Restrict the controls panel to the explicit `DashboardTileProps`
    // members (no inherited Stack styling props).
    // (Same root cause and fix as `CryptoNewsTile.stories.tsx`.)
    controls: {
      include: [
        "title",
        "icon",
        "loading",
        "datePicker",
        "afterTitleComponent",
        "rightHeaderContent",
        "sectionLink",
        "children",
      ],
    },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 480, height: 280 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Market overview",
    icon: <LeaderboardIcon fontSize="small" />,
    children: <PlaceholderContent />,
  },
};

export default meta;

type Story = StoryObj<typeof DashboardTile>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithSectionLink: Story = {
  args: {
    sectionLink: {
      href: "/dashboard/overview",
      text: "Go to full page",
      alwaysVisible: true,
    },
  },
};

export const WithRightHeaderContent: Story = {
  args: {
    rightHeaderContent: (
      <Button
        size="small"
        variant="outlined">
        Refresh
      </Button>
    ),
  },
};

export const WithAfterTitleAndDatePicker: Story = {
  args: {
    afterTitleComponent: (
      <Box
        sx={{
          ml: 1,
          px: 0.75,
          py: 0.25,
          borderRadius: 1,
          backgroundColor: "rgba(33, 154, 131, 0.15)",
          color: "#219a83",
          fontSize: "0.7rem",
          fontWeight: 600,
        }}>
        BETA
      </Box>
    ),
    datePicker: (
      <Button
        size="small"
        variant="text">
        Today
      </Button>
    ),
  },
};

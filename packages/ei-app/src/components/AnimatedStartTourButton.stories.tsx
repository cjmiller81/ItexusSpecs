import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TourProvider } from "@reactour/tour";
import { http, HttpResponse } from "msw";

import { AnimatedStartTourButton } from "./AnimatedStartTourButton";

// `AnimatedStartTourButton` is the gradient pulse/shimmer Start-tour button
// that boots a `@reactour/tour` walkthrough on click. On click it:
//   1. Dispatches `fetchReactourSettingsAsync` (Redux Toolkit thunk),
//      which calls `/api/user-preferences/reactour` (mocked here).
//   2. Resumes the tour at the step recorded for the given `tourId`.
//
// So this story needs:
//   - A `TourProvider` (the `useTour` hook lives in its context).
//   - An MSW handler for `/api/user-preferences/reactour` returning some
//     saved tour-step settings.
//
// The default Redux store in `preview.tsx` already includes the `reactour`
// slice with `settings: null`, so the click flow exercises the thunk's
// happy path end-to-end.

const tourSettingsHandler = http.get("*/api/user-preferences/reactour", () =>
  HttpResponse.json({
    tours: {
      EI_TOUR_dashboard_STEP: 0,
      EI_TOUR_dashboard_VIEWED: 0,
      EI_TOUR_charts_STEP: 2,
      EI_TOUR_charts_VIEWED: 1,
    },
  }),
);

const placeholderSteps = [
  {
    selector: "[data-tour='start']",
    content: "This is the first step in the tour.",
  },
];

const meta = {
  title: "EI App/Components/AnimatedStartTourButton",
  component: AnimatedStartTourButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pulsing gradient Start-tour button. On click it pulls the user's saved tour step from the backend and re-opens the `@reactour/tour` overlay at that step. Stories mount inside a `TourProvider` and mock the tour-preferences endpoint via MSW.",
      },
    },
    msw: { handlers: [tourSettingsHandler] },
  },
  tags: ["autodocs"],
  args: {
    tourId: "dashboard",
    children: "Start tour",
    size: "small",
    variant: "contained",
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    variant: { control: "select", options: ["contained", "outlined", "text"] },
  },
  decorators: [
    Story => (
      <TourProvider steps={placeholderSteps}>
        <Box
          sx={{ p: 6 }}
          data-tour="start">
          <Story />
        </Box>
      </TourProvider>
    ),
  ],
} satisfies Meta<typeof AnimatedStartTourButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LargeOutlined: Story = {
  name: "Large outlined",
  args: {
    size: "large",
    variant: "outlined",
    children: "Show me around",
  },
};

export const WithCustomOnClick: Story = {
  name: "With custom onClick",
  args: {
    onClick: () => {
      console.info("Custom tour-start handler invoked.");
    },
  },
};

export const SizeGallery: Story = {
  name: "Size gallery",
  render: args => (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center">
      {(["small", "medium", "large"] as const).map(size => (
        <Stack
          key={size}
          spacing={0.5}
          alignItems="center">
          <Typography
            variant="caption"
            color="text.secondary">
            {size}
          </Typography>
          <AnimatedStartTourButton
            {...args}
            size={size}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { UiText } from "@ory/client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Messages } from "./Messages";

// `Messages` renders the `messages` array Ory attaches at the top of
// every flow (`SettingsFlow.ui.messages`, `LoginFlow.ui.messages`, …).
// Each entry becomes a single MUI `<Alert>` whose severity flips
// between `error` and `info` based on `message.type` — `success` falls
// through to `info`. When the array is undefined the component returns
// `null` (no wrapper, no spacer).
const meta = {
  title: "Auth/Messages",
  component: Messages,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders the array of `UiText` messages Ory attaches to every flow's `ui.messages`. Each text becomes a single MUI `<Alert>`; `message.type === 'error'` flips the severity, everything else renders as `info`.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ p: 3, maxWidth: 560 }}>
        <Stack spacing={1}>
          <Story />
        </Stack>
      </Box>
    ),
  ],
} satisfies Meta<typeof Messages>;

export default meta;
type Story = StoryObj<typeof meta>;

const infoMessage: UiText = {
  id: 1010001,
  type: "info",
  text: "Please confirm this action by verifying that it is you.",
  context: {},
};

const errorMessage: UiText = {
  id: 4000006,
  type: "error",
  text: "The provided credentials are invalid, check for spelling mistakes.",
  context: {},
};

const successMessage: UiText = {
  id: 1050001,
  type: "success",
  text: "Your changes have been saved!",
  context: {},
};

// Undefined `messages` short-circuits to `null` — the story still
// renders the decorator wrapper, so the docs page shows a clean empty
// slot rather than crashing.
export const None: Story = {
  args: { messages: undefined },
};

export const Info: Story = {
  args: { messages: [infoMessage] },
};

export const Error: Story = {
  args: { messages: [errorMessage] },
};

// Multiple messages of different types — verifies the per-message
// severity routing and the iterator key (`message.id`).
export const Mixed: Story = {
  args: { messages: [errorMessage, infoMessage, successMessage] },
};

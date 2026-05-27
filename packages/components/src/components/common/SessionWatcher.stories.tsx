import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { dialogContainerDecorator } from "../../storybookMocks/dialogDocsDecorator";
import { SessionWatcher } from "./SessionWatcher";

// SessionWatcher is invisible until the current Ory session is within 3
// minutes of expiry — at which point it opens a centered Dialog and starts
// a 1s countdown. It reads `session.expires_at` from the Ory context, so
// stories override `parameters.oryContext` to bring the dialog on screen.
//
// Stories that open the warning Dialog apply `dialogContainerDecorator`
// per-story so the portal-rendered Dialog stays inside a bounded card on
// the Docs page. The `Idle` story doesn't open the Dialog, so it renders
// inline without the decorator. See `dialogDocsDecorator.tsx` for why this
// is preferred over `docs.story.inline = false`.
const meta = {
  title: "Common/SessionWatcher",
  component: SessionWatcher,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Watches the active Ory session and pops a warning Dialog when fewer than 3 minutes remain. Calls `logOut` when the timer reaches zero. Override `parameters.oryContext.session.expires_at` to drive the visible states.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    logOut: fn(),
  },
} satisfies Meta<typeof SessionWatcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Ory context has a 1-hour expiry, so the dialog stays hidden.
// Render a small label so the story doesn't look broken on Docs.
export const Idle: Story = {
  render: args => (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography
        variant="body2"
        color="text.secondary">
        Session expires in 1 hour — warning dialog hidden.
      </Typography>
      <SessionWatcher {...args} />
    </Box>
  ),
};

// Force the warning open by setting expires_at to 2 minutes from now.
// The Dialog portal is contained inside a bounded card on the Docs page
// by `dialogContainerDecorator` so it doesn't stack on top of the rest
// of the autodocs blocks.
export const WarningVisible: Story = {
  decorators: [dialogContainerDecorator(360)],
  parameters: {
    oryContext: {
      session: {
        id: "storybook-session",
        active: true,
        expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        identity: {
          id: "storybook-identity",
          traits: {
            email: "demo@example.com",
            name: { first: "Demo", last: "User" },
            avatarUrl: "",
            newsletter: false,
          },
        },
      },
    },
  },
};

// One minute left exercises the "1 minute" (singular) copy branch.
export const OneMinuteLeft: Story = {
  decorators: [dialogContainerDecorator(360)],
  parameters: {
    oryContext: {
      session: {
        id: "storybook-session",
        active: true,
        expires_at: new Date(Date.now() + 60 * 1000).toISOString(),
        identity: {
          id: "storybook-identity",
          traits: {
            email: "demo@example.com",
            name: { first: "Demo", last: "User" },
            avatarUrl: "",
            newsletter: false,
          },
        },
      },
    },
  },
};

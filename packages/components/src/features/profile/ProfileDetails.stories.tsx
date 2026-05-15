import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import { ProfileDetails } from "./ProfileDetails";

// ProfileDetails is a Formik-validated form (firstName / lastName / email)
// pre-filled from `useOry().session.identity.traits`. The default Ory mock
// in preview.tsx already provides a session with name + email so the form
// renders populated; stories can override `parameters.oryContext.session`
// to drive the empty / different-user variants.
//
// Labels come from the `ProfileContainer` i18n namespace; validation
// errors use `ErrorMessages.mandatoryField` and `MaxFieldLengthError`.
const meta = {
  title: "Profile/ProfileDetails",
  component: ProfileDetails,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Formik-validated profile form pre-filled from the active Ory session. Submitting fires `onUpdateProfile(firstName, lastName)`; the loading state is driven externally via `loadingCnangeDetails`. The email field is disabled because Ory owns identity primary email changes.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onUpdateProfile: fn(),
  },
  argTypes: {
    loadingCnangeDetails: { control: "boolean" },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ProfileDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

// Pulls "Demo / User / demo@example.com" from the default Ory mock.
export const Default: Story = {};

// Submission spinner active.
export const Saving: Story = {
  args: { loadingCnangeDetails: true },
};

// Override the Ory session so the form renders empty — exercises the
// "first time login" state where Ory hasn't seeded the identity traits.
export const EmptyTraits: Story = {
  parameters: {
    oryContext: {
      session: {
        id: "storybook-session",
        active: true,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        identity: {
          id: "storybook-identity",
          traits: {
            email: "",
            name: { first: "", last: "" },
            avatarUrl: "",
            newsletter: false,
          },
        },
      },
    },
  },
};

// Different identity — useful for visually checking the bound values.
export const DifferentUser: Story = {
  parameters: {
    oryContext: {
      session: {
        id: "storybook-session",
        active: true,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        identity: {
          id: "storybook-identity",
          traits: {
            email: "ada@example.com",
            name: { first: "Ada", last: "Lovelace" },
            avatarUrl: "",
            newsletter: false,
          },
        },
      },
    },
  },
};

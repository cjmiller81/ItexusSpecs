import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AuthContainer } from "./AuthContainer";

// `AuthContainer` is the bare styled `<main>` element every auth page
// mounts. It centers its children both horizontally and vertically and
// fills the viewport. Storied here as a positive-control alongside its
// dark-themed sibling `StyledAuthContainer` so reviewers can compare
// the two side by side.
//
// Source type is annotated `:any` (because `@mui/material/styles`'s
// `styled` factory returns a wide callable type) — `Meta<typeof
// AuthContainer>` therefore has wide arg types; the stories pass
// children only.
const meta: Meta<typeof AuthContainer> = {
  title: "Auth/AuthContainer",
  component: AuthContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Bare styled `<main>` for the auth pages. Centers children with flex (`justify-content: center; align-items: center`) and stretches to `100vh`. Used directly by the login, registration, recovery, settings, verification, and error pages via `StyledAuthContainer`.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderCard = () => (
  <Box
    sx={{
      width: 360,
      p: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.05)",
      border: "1px dashed rgba(255,255,255,0.25)",
      textAlign: "center",
    }}>
    <Typography variant="h6">AuthContainer child</Typography>
    <Typography
      variant="body2"
      sx={{ opacity: 0.7, mt: 1 }}>
      Centered horizontally and vertically by the parent.
    </Typography>
  </Box>
);

export const Default: Story = {
  render: () => (
    <AuthContainer>
      <PlaceholderCard />
    </AuthContainer>
  ),
};

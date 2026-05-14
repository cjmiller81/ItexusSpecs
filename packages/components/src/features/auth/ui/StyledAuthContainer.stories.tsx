import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StyledAuthContainer } from "./StyledAuthContainer";
import ProtectedByOryLabel from "./protectedByOryLabel";

// `StyledAuthContainer` is the dark-themed auth-page chrome — same
// centring behaviour as `AuthContainer`, but with a `#3E3E3E` desktop
// background that collapses to `#2B2B2B` below the 640px breakpoint so
// it blends seamlessly into the `CustomLoginForm` card on mobile.
const meta: Meta<typeof StyledAuthContainer> = {
  title: "Auth/StyledAuthContainer",
  component: StyledAuthContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dark-themed auth-page wrapper. `#3E3E3E` background above 640px, `#2B2B2B` below so the auth card visually merges into the page on mobile.",
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
      backgroundColor: "#2B2B2B",
      borderRadius: "1rem",
      padding: "48px",
      minWidth: 360,
      borderWidth: "2px",
      borderColor: "white",
      borderStyle: "solid",
      color: "#ffffff",
      textAlign: "center",
    }}>
    <Typography variant="h6">Auth card</Typography>
    <Typography
      variant="body2"
      sx={{ mt: 1, opacity: 0.8 }}>
      `StyledAuthContainer` provides the chrome around `CustomLoginForm`, `CustomRecoveryForm`, and the error page card.
    </Typography>
  </Box>
);

export const Default: Story = {
  render: () => (
    <StyledAuthContainer>
      <PlaceholderCard />
    </StyledAuthContainer>
  ),
};

// Mirrors the production layout — `Stack` with the card and the
// `ProtectedByOryLabel` footer, exactly the way `login.tsx` and
// `recovery.tsx` compose them.
export const WithFooter: Story = {
  render: () => (
    <StyledAuthContainer>
      <Stack
        alignItems="center"
        gap={1}
        sx={{ width: "100%" }}>
        <PlaceholderCard />
        <ProtectedByOryLabel env={{ termsUrl: "https://example.test/terms", appTermsUrl: "" }} />
      </Stack>
    </StyledAuthContainer>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GooglePaySvg } from "./GooglePaySvg";

// GooglePaySvg renders the Google Pay wordmark and reads `theme.palette`
// for the primary text colour. The `isSelected` flag swaps the colour to
// `primary.dark` to indicate the active payment method.
const meta = {
  title: "Profile/Billing/GooglePaySvg",
  component: GooglePaySvg,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Google Pay wordmark SVG. Renders in `text.primary` by default and swaps to `primary.dark` when `isSelected` is true. Used inside the payment-method selector to mark the active option.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isSelected: { control: "boolean" },
    height: { control: "text" },
    width: { control: "text" },
  },
} satisfies Meta<typeof GooglePaySvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

// Side-by-side comparison so reviewers can eyeball the colour swap.
export const SelectionComparison: Story = {
  render: () => (
    <Stack
      direction="row"
      spacing={4}
      alignItems="center">
      <Box sx={{ textAlign: "center" }}>
        <GooglePaySvg />
        <Typography
          variant="caption"
          display="block"
          color="text.secondary">
          Default
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <GooglePaySvg isSelected />
        <Typography
          variant="caption"
          display="block"
          color="text.secondary">
          Selected
        </Typography>
      </Box>
    </Stack>
  ),
};

// Demonstrates the height / width SVG props passing through.
export const Larger: Story = {
  args: { height: 36, width: 100 },
};

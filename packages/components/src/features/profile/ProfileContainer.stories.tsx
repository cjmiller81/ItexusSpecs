import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { ProfileContainer } from "./ProfileContainer";

// ProfileContainer composes AppContainer (border + radius), an optional
// title row with an end-adornment slot, and a TopBordered content surface.
// It's the standard frame for every section on the profile and billing
// pages.
const meta = {
  title: "Profile/ProfileContainer",
  component: ProfileContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Section frame used across the Profile and Billing pages. Composes `AppContainer` + `TopBordered` + an optional title row with an `endAdortment` slot for buttons or chips.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    title: "Profile details",
  },
  argTypes: {
    title: { control: "text" },
    contentBgColor: { control: "color" },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ProfileContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <ProfileContainer {...args}>
      <Stack spacing={1}>
        <Typography variant="body1">Section content goes here.</Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          Replace with form fields, lists, or other settings widgets.
        </Typography>
      </Stack>
    </ProfileContainer>
  ),
};

// `endAdortment` slot — typically an Edit button or status chip.
export const WithEndAdornment: Story = {
  args: {
    title: "Personal information",
  },
  render: args => (
    <ProfileContainer
      {...args}
      endAdortment={<Button startIcon={<EditIcon />}>Edit</Button>}>
      <Stack spacing={1}>
        <Typography variant="body2">Demo User · demo@example.com</Typography>
      </Stack>
    </ProfileContainer>
  ),
};

// `contentBgColor` is applied only in light mode (the dark theme keeps
// `transparent`). Useful when a section needs to stand out.
export const ContentBgColor: Story = {
  args: {
    title: "Highlighted section",
    contentBgColor: "#f0ece5",
  },
  render: args => (
    <ProfileContainer {...args}>
      <Typography variant="body2">
        The content background only kicks in under the light theme — the dark theme falls back to transparent so the
        surface still contrasts with the page.
      </Typography>
    </ProfileContainer>
  ),
};

// No title hides the entire HeaderContainer row.
export const TitleOmitted: Story = {
  args: { title: undefined },
  render: args => (
    <ProfileContainer {...args}>
      <Typography variant="body2">Bare content surface — no title row.</Typography>
    </ProfileContainer>
  ),
};

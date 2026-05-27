import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { CustomDeleteIcon } from "./CustomDeleteIcon";

const meta = {
  title: "EI App/Components/CustomDeleteIcon",
  component: CustomDeleteIcon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Red 24×24 SVG delete icon with a white "X" glyph. Takes no props; styling is baked into the SVG so it renders identically regardless of the surrounding MUI theme.',
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CustomDeleteIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InsideIconButton: Story = {
  name: "Inside IconButton",
  render: () => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}>
      <IconButton aria-label="delete">
        <CustomDeleteIcon />
      </IconButton>
      <Typography
        variant="body2"
        color="text.secondary">
        Click target for a destructive row action.
      </Typography>
    </Stack>
  ),
};

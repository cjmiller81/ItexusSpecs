import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fn } from "storybook/test";

import { ActionCard, CenterLink, DocsButton, MarginCard, TextLeftButton } from "./index";

/**
 * Named `component` for Storybook: a bare `Meta` + `render`-only story can be
 * omitted from the generated sidebar index in some CSF/doc setups.
 */
function StyledAuthPrimitivesShowcase() {
  return (
    <Box sx={{ maxWidth: 480 }}>
      <MarginCard>
        <Typography
          variant="subtitle2"
          gutterBottom>
          MarginCard
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          Adds the standard top/bottom spacing around auth cards.
        </Typography>
      </MarginCard>
      <ActionCard>
        <Typography
          variant="subtitle2"
          gutterBottom>
          ActionCard
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          Bottom margin spacing between stacked sections.
        </Typography>
      </ActionCard>
      <Stack spacing={2}>
        <CenterLink href="https://example.com/terms">CenterLink (styled anchor)</CenterLink>
        <TextLeftButton
          variant="outlined"
          fullWidth>
          TextLeftButton
        </TextLeftButton>
        <DocsButton
          title="Documentation link"
          href="https://example.com/docs"
          testid="story-docs"
          onClick={fn()}
        />
      </Stack>
    </Box>
  );
}

const meta = {
  title: "Auth/StyledPrimitives",
  component: StyledAuthPrimitivesShowcase,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bootstrap-grid-aligned auth helpers (`MarginCard`, `ActionCard`, `DocsButton`) plus MUI-styled links/buttons used across Ory pages.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StyledAuthPrimitivesShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

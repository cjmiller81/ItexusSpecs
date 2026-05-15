import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { UiState } from "../../slices/uiSlice";
import { AppAccordionSection } from "./AppAccordionSection";

const baseUi: UiState = {
  errors: [],
  messages: [],
  warnings: [],
  sidebarOpened: true,
  mode: "dark",
  accordions: {},
};

const meta = {
  title: "Containers/AppAccordionSection",
  component: AppAccordionSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Composed accordion section with a styled title, tooltip on the expand icon, optional header children, and Redux-persisted expansion state via the wrapped StatePersistedAccordion.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    tooltip: { control: "text" },
    persistKey: { control: "text" },
  },
  // `children` is required by MUI Accordion's type, but every story supplies
  // its own JSX children via `meta.render` (those win over a spread prop).
  // We provide a placeholder here purely to satisfy the strict story types.
  args: {
    persistKey: "demo-section",
    title: "Demo section",
    tooltip: "Click to expand/collapse",
    children: <></>,
  },
  render: args => (
    <Box sx={{ maxWidth: 640 }}>
      <AppAccordionSection {...args}>
        <Typography variant="body2">
          Section content goes here. Anything you pass as children renders inside the styled{" "}
          <code>AccordionDetails</code>.
        </Typography>
      </AppAccordionSection>
    </Box>
  ),
} satisfies Meta<typeof AppAccordionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHeaderChildren: Story = {
  args: {
    headerChildren: (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 2 }}>
        <Chip
          label="Beta"
          color="primary"
          size="small"
        />
        <Button
          size="small"
          variant="outlined"
          onClick={e => e.stopPropagation()}>
          Header action
        </Button>
      </Box>
    ),
  },
};

export const PreloadedCollapsed: Story = {
  parameters: {
    reduxState: {
      ui: { ...baseUi, accordions: { "demo-section": false } },
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: "A particularly long section title that exercises the header layout when text wraps",
    tooltip: "Even the wrapping case keeps the expand icon aligned.",
  },
};

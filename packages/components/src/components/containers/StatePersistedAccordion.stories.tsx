import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { UiState } from "../../slices/uiSlice";
import { StatePersistedAccordion } from "./StatePersistedAccordion";

// Default ui-slice shape that stories can spread and selectively override.
// preloadedState replaces an entire slice (rather than deep-merging) so
// stories must provide the full UiState. Reusing this base avoids repeating
// the unrelated fields (errors, messages, etc.) in every story.
const baseUi: UiState = {
  errors: [],
  messages: [],
  warnings: [],
  sidebarOpened: true,
  mode: "dark",
  accordions: {},
};

const meta = {
  title: "Containers/StatePersistedAccordion",
  component: StatePersistedAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "MUI Accordion whose expanded state is persisted in the `ui.accordions` Redux slice, keyed by `persistKey`. Stories preload that slice via `parameters.reduxState` to control the initial expansion state.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    persistKey: { control: "text" },
  },
  // `children` is required by MUI Accordion's type, but every story supplies
  // its own JSX children via `meta.render` (those win over a spread prop).
  // We provide a placeholder here purely to satisfy the strict story types.
  args: {
    persistKey: "demo-accordion",
    children: <></>,
  },
  render: args => (
    <Box sx={{ maxWidth: 480 }}>
      <StatePersistedAccordion {...args}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Persisted accordion ({args.persistKey})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            The open/closed state is stored under <code>state.ui.accordions[&quot;{args.persistKey}&quot;]</code>.
            Toggle the panel and it will persist across re-mounts (within this story&apos;s Redux store).
          </Typography>
        </AccordionDetails>
      </StatePersistedAccordion>
    </Box>
  ),
} satisfies Meta<typeof StatePersistedAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// No preloaded state — the component dispatches setAccordionState on first
// render to seed the slice from defaultExpanded.
export const DefaultExpanded: Story = {
  args: { defaultExpanded: true },
};

export const PreloadedExpanded: Story = {
  parameters: {
    reduxState: {
      ui: { ...baseUi, accordions: { "demo-accordion": true } },
    },
  },
};

export const PreloadedCollapsed: Story = {
  parameters: {
    reduxState: {
      ui: { ...baseUi, accordions: { "demo-accordion": false } },
    },
  },
};

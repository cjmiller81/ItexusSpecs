import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AutoSidebarLayout } from "./AutoSidebarLayout";
import { toggleSideBar, useAppDispatch, useAppSelector } from "../slices/index";

function AutoSidebarDemo() {
  const { sidebarOpened } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 520 }}>
      <Typography
        variant="body2"
        color="text.secondary">
        Resize listeners only fire when the sidebar is open and the viewport drops below the MUI <code>md</code>{" "}
        breakpoint — the play test simulates a narrow <code>innerWidth</code> getter.
      </Typography>
      <Typography variant="body1">
        Sidebar open: <strong data-testid="sidebar-open-state">{String(sidebarOpened)}</strong>
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          onClick={() => dispatch(toggleSideBar({ open: true }))}>
          Ensure sidebar open
        </Button>
        <Button
          variant="outlined"
          onClick={() => dispatch(toggleSideBar({ open: false }))}>
          Close sidebar
        </Button>
      </Box>
      <AutoSidebarLayout>
        <Typography
          variant="caption"
          color="text.secondary">
          Layout child (content passthrough)
        </Typography>
      </AutoSidebarLayout>
    </Box>
  );
}

const meta = {
  title: "Layouts/AutoSidebarLayout",
  component: AutoSidebarLayout,
  args: {
    // Custom `render` ignores this — satisfies Storybook's inferred `{ children: ReactNode }` story args.
    children: null,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Subscribes to `window` resize events and collapses the global sidebar when the viewport is narrower than `theme.breakpoints.values.md` while `sidebarOpened` is still true.",
      },
    },
  },
  tags: ["autodocs"],
  render: () => <AutoSidebarDemo />,
} satisfies Meta<typeof AutoSidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ClosesWhenViewportNarrows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /ensure sidebar open/i }));
    await waitFor(() => expect(canvas.getByTestId("sidebar-open-state")).toHaveTextContent("true"));

    let width = 1200;
    const original = Object.getOwnPropertyDescriptor(window, "innerWidth");
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      get: () => width,
    });
    try {
      width = 500;
      window.dispatchEvent(new Event("resize"));
      await waitFor(() => expect(canvas.getByTestId("sidebar-open-state")).toHaveTextContent("false"));
    } finally {
      if (original) Object.defineProperty(window, "innerWidth", original);
      else Reflect.deleteProperty(window, "innerWidth");
      window.dispatchEvent(new Event("resize"));
    }
  },
};

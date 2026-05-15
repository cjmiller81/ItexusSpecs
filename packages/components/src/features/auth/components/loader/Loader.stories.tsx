import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Loader } from "./index";

// `Loader` is the full-viewport SVG spinner shown while an Ory flow is
// being fetched (e.g. the brief gap between mounting the login page and
// having a `settingsFlow` to render). It has no props and no
// collaborators — the SVG `<animate>` element does all the work.
const meta = {
  title: "Auth/Loader",
  component: Loader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-viewport loading spinner used between mounting an Ory flow page and resolving the flow itself. Pure SVG animation, no props.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

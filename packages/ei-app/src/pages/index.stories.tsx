import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { oryHandlers } from "components/src/storybookMocks/oryHandlers";

import HomePage from "./index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "./storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/Home",
  component: HomePage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/" }),
    msw: {
      handlers: [...pageStoryHandlers(), oryHandlers.whoamiAuthenticated],
    },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

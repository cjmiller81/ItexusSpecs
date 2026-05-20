import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SupportPage from "./index";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "../storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/Support",
  component: SupportPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/support" }),
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof SupportPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

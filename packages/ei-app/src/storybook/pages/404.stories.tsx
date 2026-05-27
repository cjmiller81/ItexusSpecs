import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import NotFoundPage from "@/pages/404";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/404",
  component: NotFoundPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/404" }),
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

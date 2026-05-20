import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import VaultsPage from "./index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "../storybook/pageStoryDecorators";
const meta = {
  title: "EI App/Pages/Vaults",
  component: VaultsPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/vaults" }),
    msw: { handlers: pageStoryHandlers() },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof VaultsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DerivativesPage from "@/pages/derivatives/index";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/Derivatives",
  component: DerivativesPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/derivatives" }),
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof DerivativesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

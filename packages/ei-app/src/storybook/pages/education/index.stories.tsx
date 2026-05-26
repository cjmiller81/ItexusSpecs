import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import EducationPage from "@/pages/education/index";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/Education",
  component: EducationPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/education" }),
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof EducationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

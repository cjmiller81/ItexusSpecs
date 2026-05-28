import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within, waitFor, expect } from "storybook/test";

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

export const PageCententsToRender404: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.queryByText("404", { exact: true })).toHaveTextContent("404"));
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "Page Not Found" })).toHaveTextContent("Page Not Found"),
    );
    await waitFor(() =>
      expect(canvas.queryByRole("link", { name: "← Back to Home" })).toHaveTextContent("← Back to Home"),
    );
  },
};

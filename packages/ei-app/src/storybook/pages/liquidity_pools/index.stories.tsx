import { userEvent, within, waitFor, expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LiquidityPoolsPage from "@/pages/liquidity_pools/index";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const meta = {
  title: "EI App/Pages/LiquidityPools",
  component: LiquidityPoolsPage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({ asPath: "/liquidity_pools" }),
    msw: { handlers: pageStoryHandlers() },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof LiquidityPoolsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TourContentsAndSteps: Story = {
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "Income Strategy Platform" })).toHaveTextContent(
        "Income Strategy Platform",
      ),
    );
    await waitFor(() =>
      expect(canvas.queryByText("You are in the Income strategy section", { exact: true })).toHaveTextContent(
        "You are in the Income strategy section",
      ),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeEnabled());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toHaveTextContent("Next"));
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "Data Management" })).toHaveTextContent("Data Management"),
    );
    await waitFor(() =>
      expect(
        canvas.queryByText("Quickly sort and filter the table in the first two rows", { exact: true }),
      ).toHaveTextContent("Quickly sort and filter the table in the first two rows"),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeEnabled());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeEnabled());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toHaveTextContent("Next"));
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toHaveTextContent("Prior"));
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());

    await waitFor(() =>
      expect(canvas.queryByText("Your pre-built filters appear here")).toHaveTextContent(
        "Your pre-built filters appear here",
      ),
    );

    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeEnabled());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeEnabled());
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "Filter Builder" })).toHaveTextContent("Filter Builder"),
    );
    await waitFor(() =>
      expect(
        canvas.queryByText("View the filter-builder videos and build your own custom filters", { exact: true }),
      ).toHaveTextContent("View the filter-builder videos and build your own custom filters"),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());

    await waitFor(() =>
      expect(canvas.queryByText("Clear all filters to reset your view")).toHaveTextContent(
        "Clear all filters to reset your view",
      ),
    );

    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());

    await waitFor(() =>
      expect(canvas.queryByText("Your current filter appears here. Click the text to edit it.")).toHaveTextContent(
        "Your current filter appears here. Click the text to edit it.",
      ),
    );

    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(5)")).toBeVisible());

    await waitFor(() =>
      expect(canvas.queryByText("Export table to a spreadsheet (subscription only)")).toHaveTextContent(
        "Export table to a spreadsheet (subscription only)",
      ),
    );

    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Finish" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toHaveTextContent("Prior"));
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Finish" })).toHaveTextContent("Finish"));
    await userEvent.click(await canvas.findByRole("button", { name: "Finish" }));
  },
};

import { userEvent, within, waitFor, expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { oryHandlers } from "components/src/storybookMocks/oryHandlers";

import ProfilePage from "@/pages/profile/[[...tab]]";
import { pageStoryHandlers } from "@/mocks/pageStoryHandlers";
import { defaultPageParameters, pageRouterParams, withAppPageShell } from "@/storybook/pageStoryDecorators";

const profilePathname = "/profile/[[...tab]]";

const meta = {
  title: "EI App/Pages/Profile",
  component: ProfilePage,
  parameters: {
    ...defaultPageParameters,
    ...pageRouterParams({
      asPath: "/profile/details",
      pathname: profilePathname,
      query: { tab: ["details"] },
    }),
    msw: {
      handlers: [...pageStoryHandlers(), oryHandlers.whoamiAuthenticated],
    },
  },
  tags: ["autodocs"],
  decorators: [withAppPageShell],
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Details: Story = {};

export const Wallets: Story = {
  parameters: {
    ...pageRouterParams({
      asPath: "/profile/wallets",
      pathname: profilePathname,
      query: { tab: ["wallets"] },
    }),
  },
};

export const Billing: Story = {
  parameters: {
    ...pageRouterParams({
      asPath: "/profile/billing",
      pathname: profilePathname,
      query: { tab: ["billing"] },
    }),
  },
};

export const TourContentsAndSteps: Story = {
  parameters: {
    ...pageRouterParams({
      asPath: "/profile/billing",
      pathname: profilePathname,

      query: {
        tab: ["billing"],
      },
    }),
  },

  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);
    await waitFor(() => expect(body.querySelector("main > div:nth-of-type(4)")).toBeVisible());
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "YourProfileSection" })).toHaveTextContent("YourProfileSection"),
    );
    await waitFor(() =>
      expect(canvas.queryByText("ManageYourAccountSettings", { exact: true })).toHaveTextContent(
        "ManageYourAccountSettings",
      ),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toHaveTextContent("Next"));
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "CustomizeYourExperience" })).toHaveTextContent(
        "CustomizeYourExperience",
      ),
    );
    await waitFor(() =>
      expect(
        canvas.queryByText("PersonalizeYourDashboardSubscribeForFullToolsAccess", { exact: true }),
      ).toHaveTextContent("PersonalizeYourDashboardSubscribeForFullToolsAccess"),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toHaveTextContent("Prior"));
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toHaveTextContent("Next"));
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "ConnectedWallets" })).toHaveTextContent("ConnectedWallets"),
    );
    await waitFor(() =>
      expect(canvas.queryByText("ViewManageYourConnectedCryptoWallets", { exact: true })).toHaveTextContent(
        "ViewManageYourConnectedCryptoWallets",
      ),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toHaveTextContent("Prior"));
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Next" })).toHaveTextContent("Next"));
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "SubscriptionStatus" })).toHaveTextContent("SubscriptionStatus"),
    );
    await waitFor(() =>
      expect(canvas.queryByText("ViewYourCurrentSubscriptionTierAvailableFeatures", { exact: true })).toHaveTextContent(
        "ViewYourCurrentSubscriptionTierAvailableFeatures",
      ),
    );
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Finish" })).toBeVisible());
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Prior" })).toHaveTextContent("Prior"));
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Finish" })).toHaveTextContent("Finish"));
    await userEvent.click(await canvas.findByRole("button", { name: "Finish" }));
  },
};

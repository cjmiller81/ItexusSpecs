import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { WalletsContainer, type WalletsContainerProps } from "./WalletsContainer";
import {
  storyBillingProDexAccess,
  storyWalletsColdStartState,
  storyWalletsStateForSection,
} from "../../storybookMocks/myWalletsSectionStoryData";
import { storyLifiChainMap, walletsContainerHandlers } from "../../storybookMocks/walletsContainerHandlers";

const msw = {
  handlers: [...walletsContainerHandlers()],
};

const meta = {
  title: "Profile/WalletsContainer",
  component: WalletsContainer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Profile wallets shell: loads wallets, exchanges, portfolio (when `lifiChainMap` is set), and total-worth growth via the wallets slice, then renders `MyWalletsSection`. MSW covers the REST calls triggered on mount.",
      },
    },
    msw,
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsStateForSection(),
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 1100, minHeight: 680 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<WalletsContainerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Preloaded slice + network polish (`fetchExchanges`, optional portfolio refresh, growth index). */
export const Default: Story = {
  render: () => <WalletsContainer lifiChainMap={storyLifiChainMap} />,
};

/** No DEX rows yet; `fetchExchanges` still runs (MSW returns `[]`). */
export const EmptyWallets: Story = {
  render: () => <WalletsContainer lifiChainMap={null} />,
  parameters: {
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsStateForSection({
        wallets: [],
        selectedWallets: [],
        portfolioWalletData: [],
        totalWalletsWorthData: { growPercentage: 0 },
      }),
    },
  },
};

/** `wallets: null` on first paint — `fetchWallets` + `fetchWalletsPortfolio` fill state via MSW. Pass `lifiChainMap` so portfolio batch runs after wallets load. */
export const ColdStartFromApi: Story = {
  render: () => <WalletsContainer lifiChainMap={storyLifiChainMap} />,
  parameters: {
    reduxState: {
      billing: storyBillingProDexAccess,
      wallets: storyWalletsColdStartState(),
    },
  },
};

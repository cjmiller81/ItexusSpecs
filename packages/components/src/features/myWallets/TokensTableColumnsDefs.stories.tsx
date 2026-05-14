import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";
import { BasicTable } from "../../components/DataDisplay";
import type { LifiChain } from "../../utils/enrichTokenPositions";
import { getTokenNamesColumns } from "./TokensTableColumnsDefs";

interface TokenRow {
  id: string;
  chainName: string;
  network: string | { name: string };
  lifiChain: LifiChain | null;
  tokenName: string;
  balance: number;
  price: number;
  usdAmount: number;
}

const ethChain: LifiChain = {
  id: 1,
  key: "eth",
  name: "Ethereum",
  logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
  coin: "ETH",
  mainnet: true,
};

const rows: TokenRow[] = [
  {
    id: "1",
    chainName: "eth",
    network: { name: "Ethereum" },
    lifiChain: ethChain,
    tokenName: "ETH",
    balance: 1.524,
    price: 3421.12,
    usdAmount: 5210.78,
  },
  {
    id: "2",
    chainName: "other",
    network: "Unsupported L2",
    lifiChain: null,
    tokenName: "ALT",
    balance: 42_000,
    price: 0.042,
    usdAmount: 1764,
  },
];

function TokenColumnsDemo() {
  const columns = useMemo(() => getTokenNamesColumns(), []);
  return (
    <div style={{ height: 360, width: "100%", maxWidth: 900 }}>
      <BasicTable
        rows={rows}
        columns={columns}
        getRowId={r => r.id}
      />
    </div>
  );
}

const meta: Meta<typeof TokenColumnsDemo> = {
  title: "MyWallets/TokensTableColumnDefs",
  component: TokenColumnsDemo,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`getTokenNamesColumns` — chain chip, token label, amount, price, and USD value for token holdings tables.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TokenColumnsDemo />,
};

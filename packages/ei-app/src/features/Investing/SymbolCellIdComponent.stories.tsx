import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ColumnCellTemplateData } from "devextreme/ui/data_grid";
import type { ICoin } from "components/src/models/token/ICoin";

import { SymbolCellIdComponent } from "./SymbolCellIdComponent";

// The DevExtreme `ColumnCellTemplateData` type is large; the cell only reads
// `data.row.data.sym` and `data.row.data.lURI`, so a thin synthetic object
// keeps the story focused.
const makeCellData = (coin: Partial<ICoin>): ColumnCellTemplateData<ICoin> =>
  ({
    row: { data: coin as ICoin },
  }) as unknown as ColumnCellTemplateData<ICoin>;

const meta = {
  title: "EI App/Investing/SymbolCellIdComponent",
  component: SymbolCellIdComponent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SymbolCellIdComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bitcoin: Story = {
  args: {
    data: makeCellData({
      sym: "btc",
      lURI: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    }),
  },
};

export const Ethereum: Story = {
  args: {
    data: makeCellData({
      sym: "eth",
      lURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    }),
  },
};

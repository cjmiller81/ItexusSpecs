import { DataType } from "devextreme/common"

export enum PrefilterTokensField {
  Id = "id",
  Name = "name",
  Symbol = "sym",
  Chains = "chains",
  Price = "price",
  MarketCap = "mCap",
  FullyDilutedValuation = "fulDilVal",
  Volume = "tVol",
  CirculatingSupply = "cirSup",
  TotalSupply = "tSup",
  MaxSupply = "mSup",
  Tokenomics = "tNom",
  IsErc20 = "erc20",
  Categories = "cats",
}
export enum PrefilterTokensLabel {
  Id = "Id",
  Name = "Name",
  Symbol = "Symbol",
  Chains = "Chains",
  Price = "Price",
  MarketCap = "Market Cap",
  FullyDilutedValuation = "Fully Diluted Valuation",
  Volume = "Volume",
  CirculatingSupply = "Circulating Supply",
  TotalSupply = "Total Supply",
  MaxSupply = "Max Supply",
  Tokenomics = "Tokenomics",
  IsErc20 = "ERC 20",
  Categories = "Categories",
}

export interface FilterBuilderItems {
  caption?: string
  width?: number
  dataField: string
  dataType: DataType
  format?: string
}

export const filterBuilderFields: FilterBuilderItems[] = [
  {
    caption: "ID",
    width: 50,
    dataField: PrefilterTokensField.Id,
    dataType: "number",
  },
  {
    caption: PrefilterTokensLabel.Symbol,
    width: 50,
    dataField: PrefilterTokensField.Symbol,
    dataType: "string",
  },
  {
    caption: PrefilterTokensLabel.Price,
    dataField: PrefilterTokensField.Price,
    dataType: "number",
    format: "currency",
  },
  {
    caption: PrefilterTokensLabel.MarketCap,
    dataField: PrefilterTokensField.MarketCap,
    dataType: "number",
    format: "currency",
  },
  {
    caption: PrefilterTokensLabel.FullyDilutedValuation,
    dataField: PrefilterTokensField.FullyDilutedValuation,
    dataType: "number",
    format: "currency",
  },
  {
    caption: PrefilterTokensLabel.Tokenomics,
    dataField: PrefilterTokensField.Tokenomics,
    dataType: "number",
    // format: 'percentage',
  },
  {
    caption: PrefilterTokensLabel.Volume,
    dataField: PrefilterTokensField.Volume,
    dataType: "number",
  },
  {
    caption: PrefilterTokensLabel.Chains,
    dataField: PrefilterTokensField.Chains,
    dataType: "string",
  },
  {
    caption: PrefilterTokensLabel.IsErc20,
    dataField: PrefilterTokensField.IsErc20,
    dataType: "boolean",
  },
  {
    caption: PrefilterTokensLabel.Categories,
    dataField: PrefilterTokensField.Categories,
    dataType: "string",
  },
]

import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";

export enum DefiField {
  Symbol = "symbol",
  Project = "project",
  Chain = "chain",
  TVL = "tvlUsd",
  APY = "apy",
  BaseAPY = "apyBase",
  ApyMean30d = "apyMean30d",
}
export enum DefiLabel {
  Symbol = "Symbol",
  Project = "Project",
  Chain = "Chain",
  TVL = "TVL",
  APY = "APY",
  BaseAPY = "BaseAPY",
  ApyMean30d = "30d Avg APY",
}

export const defiFilterBuilderFields: FilterBuilderItems[] = [
  {
    caption: DefiLabel.Symbol,
    dataField: DefiField.Symbol,
    dataType: "string",
  },
  {
    caption: DefiLabel.Project,
    dataField: DefiField.Project,
    dataType: "string",
  },
  {
    caption: DefiLabel.Chain,
    dataField: DefiField.Chain,
    dataType: "string",
  },
  {
    caption: DefiLabel.TVL,
    dataField: DefiField.TVL,
    dataType: "number",
  },
  {
    caption: DefiLabel.APY,
    dataField: DefiField.APY,
    dataType: "number",
  },
  {
    caption: DefiLabel.BaseAPY,
    dataField: DefiField.BaseAPY,
    dataType: "number",
  },
  {
    caption: DefiLabel.ApyMean30d,
    dataField: DefiField.ApyMean30d,
    dataType: "number",
  },
];

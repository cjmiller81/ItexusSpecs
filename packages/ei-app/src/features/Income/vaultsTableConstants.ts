import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";

export enum DefiField {
  Name = "name",
  Chain = "chain",
  Boost = "boost",
  PlatformId = "platformId",
  TVL = "tvl",
  APY = "apy",
  Safety = "safety",
}

export enum DefiLabel {
  Name = "Name",
  Chain = "Chain",
  Boost = "Boosts",
  PlatformId = "Platform",
  TVL = "TVL",
  APY = "APY",
  Safety = "Safety",
}

export const vaultsFilterBuilderFields: FilterBuilderItems[] = [
  {
    caption: DefiLabel.Name,
    dataField: DefiField.Name,
    dataType: "string",
  },
  {
    caption: DefiLabel.Chain,
    dataField: DefiField.Chain,
    dataType: "string",
  },
  {
    caption: DefiLabel.Boost,
    dataField: DefiField.Boost,
    dataType: "string",
  },
  {
    caption: DefiLabel.PlatformId,
    dataField: DefiField.PlatformId,
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
    caption: DefiLabel.Safety,
    dataField: DefiField.Safety,
    dataType: "string",
  },
];

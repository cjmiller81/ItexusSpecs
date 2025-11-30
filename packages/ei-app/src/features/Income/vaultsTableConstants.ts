import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";

export enum DefiField {
  Name = "name",
  Chain = "chain",
  Boost = "boost",
  PlatformId = "platformId",
  TVL = "tvl",
  APY = "apy",
  Safety = "safety",
  VaultApy = "vaultApy",
  BeefyPerformanceFee = "beefyPerformanceFee",
  LpFee = "lpFee",
  TradingApr = "tradingApr",
  StrategyTypeId = "strategyTypeId",
  EarnedToken = "earnedToken",
}

export enum DefiLabel {
  Name = "Name",
  Chain = "Chain",
  Boost = "Boosts",
  PlatformId = "Platform",
  TVL = "TVL",
  APY = "APY",
  Safety = "Safety",
  VaultApy = "Vault APY",
  BeefyPerformanceFee = "Beefy Performance Fee",
  LpFee = "LP Fee",
  TradingApr = "Trading APR",
  StrategyTypeId = "Strategy Type ID",
  EarnedToken = "Earned Token",
}

export const vaultsFilterBuilderFields: FilterBuilderItems[] = [
  {
    caption: DefiLabel.Name,
    dataField: DefiField.Name,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
  },
  {
    caption: DefiLabel.Chain,
    dataField: DefiField.Chain,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
  },
  {
    caption: DefiLabel.Boost,
    dataField: DefiField.Boost,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
  },
  {
    caption: DefiLabel.PlatformId,
    dataField: DefiField.PlatformId,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
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
  {
    caption: DefiLabel.VaultApy,
    dataField: DefiField.VaultApy,
    dataType: "number",
  },
  {
    caption: DefiLabel.BeefyPerformanceFee,
    dataField: DefiField.BeefyPerformanceFee,
    dataType: "number",
  },
  {
    caption: DefiLabel.LpFee,
    dataField: DefiField.LpFee,
    dataType: "number",
  },
  {
    caption: DefiLabel.TradingApr,
    dataField: DefiField.TradingApr,
    dataType: "number",
  },
  {
    caption: DefiLabel.StrategyTypeId,
    dataField: DefiField.StrategyTypeId,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
  },
  {
    caption: DefiLabel.EarnedToken,
    dataField: DefiField.EarnedToken,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
  },
];

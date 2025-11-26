import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";

export enum DefiField {
  Chain = "chain",
  Project = "project",
  Symbol = "symbol",
  TVL = "tvlUsd",
  Category = "category",
  ApyBase = "apyBase",
  APYReward = "apyReward",
  APY = "apy",
  RewardTokens = "rewardTokens",
  Pool = "pool",
  ApyPct1D = "apyPct1D",
  ApyPct7D = "apyPct7D",
  Stablecoin = "stablecoin",
  IlRisk = "ilRisk",
  Exposure = "exposure",
  PoolMeta = "poolMeta",
  Mu = "mu",
  Sigma = "sigma",
  Count = "count",
  Outlier = "outlier",
  UnderlyingTokens = "underlyingTokens",
  Il7d = "il7d",
  ApyBase7d = "apyBase7d",
  ApyMean30d = "apyMean30d",
  VolumeUsd1d = "volumeUsd1d",
  VolumeUsd7d = "volumeUsd7d",
  ApyBaseInception = "apyBaseInception",
  Dex = "dexFormatted"
}

export enum DefiLabel {
  Chain = "Chain",
  Dex = "DEX",
  Project = "Project",
  Symbol = "Pool",
  TVL = "TVL",
  Category = "Category",
  ApyBase = "APY Base",
  APYReward = "APY Reward",
  APY = "APY",
  RewardTokens = "Reward Tokens",
  Pool = "Pool",
  ApyPct1D = "APY Pct 1D",
  ApyPct7D = "APY Pct 7D",
  Stablecoin = "Stablecoin",
  IlRisk = "Impermanent Loss Risk",
  Exposure = "Exposure",
  PoolMeta = "Meta",
  Mu = "MU",
  Sigma = "Sigma",
  Count = "Count",
  Outlier = "Outlier",
  UnderlyingTokens = "Underlying Tokens",
  Il7d = "IL 7d",
  ApyBase7d = "APY Base 7d",
  ApyMean30d = "APY Mean 30d",
  VolumeUsd1d = "Volume Usd 1d",
  VolumeUsd7d = "Volume Usd 7d",
  ApyBaseInception = "APY Base Inception",
}

export const defiFilterBuilderFields: FilterBuilderItems[] = [
  {
    caption: DefiLabel.Symbol,
    dataField: DefiField.Symbol,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>", "anyof"]
  },
  {
    caption: DefiLabel.Project,
    dataField: DefiField.Project,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>", "anyof"]
  },
  {
    caption: DefiLabel.Chain,
    dataField: DefiField.Chain,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>", "anyof"]
  },
  {
    caption: DefiLabel.Category,
    dataField: DefiField.Category,
    dataType: "string",
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>", "anyof"]
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
    caption: DefiLabel.ApyBase,
    dataField: DefiField.ApyBase,
    dataType: "number",
  },
  {
    caption: DefiLabel.APYReward,
    dataField: DefiField.APYReward,
    dataType: "number",
  },
  {
    caption: DefiLabel.ApyMean30d,
    dataField: DefiField.ApyMean30d,
    dataType: "number",
  },
  {
    caption: DefiLabel.ApyPct1D,
    dataField: DefiField.ApyPct1D,
    dataType: "number",
  },
  {
    caption: DefiLabel.ApyPct7D,
    dataField: DefiField.ApyPct7D,
    dataType: "number",
  },
  {
    caption: DefiLabel.Stablecoin,
    dataField: DefiField.Stablecoin,
    dataType: "boolean",
  },
  {
    caption: DefiLabel.IlRisk,
    dataField: DefiField.IlRisk,
    dataType: "string",
  },
  {
    caption: DefiLabel.Exposure,
    dataField: DefiField.Exposure,
    dataType: "string",
  },
  {
    caption: DefiLabel.Mu,
    dataField: DefiField.Mu,
    dataType: "number",
  },
  {
    caption: DefiLabel.Sigma,
    dataField: DefiField.Sigma,
    dataType: "number",
  },
  {
    caption: DefiLabel.Count,
    dataField: DefiField.Count,
    dataType: "number",
  },
  {
    caption: DefiLabel.Il7d,
    dataField: DefiField.Il7d,
    dataType: "number",
  },
  {
    caption: DefiLabel.ApyBase7d,
    dataField: DefiField.ApyBase7d,
    dataType: "number",
  },
  {
    caption: DefiLabel.VolumeUsd1d,
    dataField: DefiField.VolumeUsd1d,
    dataType: "number",
  },
  {
    caption: DefiLabel.VolumeUsd7d,
    dataField: DefiField.VolumeUsd7d,
    dataType: "number",
  },
  {
    caption: DefiLabel.ApyBaseInception,
    dataField: DefiField.ApyBaseInception,
    dataType: "number",
  },
];

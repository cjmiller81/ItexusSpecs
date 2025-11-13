import DefiTokensSectionTest from "@/features/Income/DefiTokensSectionTest";
import { PoolData } from "@/features/Income/Models/PoolData";
import pocLpPools from "@/mocks/data/pocLpPools.json";
import pocLpDexs from "@/mocks/data/pocLpDexs.json";

const ACCORDION_KEY = "DefiTokensSectionPOC";

const normalizeNumber = (value: unknown, defaultValue = 0): number => {
  return typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;
};

const normalizeNullableNumber = (value: unknown): number | null => {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
};

const normalizeString = (value: unknown, defaultValue = ""): string => {
  return typeof value === "string" ? value : defaultValue;
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const normalizePredictions = (value: unknown): { predictionValue: number; predictionDate: string } => {
  if (value && typeof value === "object" && "predictionValue" in value && "predictionDate" in value) {
    const predictions = value as { predictionValue?: unknown; predictionDate?: unknown };
    return {
      predictionValue: normalizeNumber(predictions.predictionValue),
      predictionDate: normalizeString(predictions.predictionDate),
    };
  }

  return {
    predictionValue: 0,
    predictionDate: "",
  };
};

const normalizePool = (pool: unknown): PoolData => {
  const source = pool && typeof pool === "object" ? (pool as Record<string, unknown>) : {};
  const idValue = source.id;

  return {
    id: typeof idValue === "string" ? idValue : undefined,
    chain: normalizeString(source.chain),
    project: normalizeString(source.project),
    symbol: normalizeString(source.symbol),
    category: normalizeString(source.category),
    tvlUsd: normalizeNumber(source.tvlUsd),
    apyBase: normalizeNumber(source.apyBase),
    apyReward: normalizeNullableNumber(source.apyReward),
    apy: normalizeNumber(source.apy),
    rewardTokens: Array.isArray(source.rewardTokens)
      ? source.rewardTokens.filter((token): token is string => typeof token === "string")
      : null,
    pool: normalizeString(source.pool),
    apyPct1D: normalizeNumber(source.apyPct1D),
    apyPct7D: normalizeNumber(source.apyPct7D),
    apyPct30D: normalizeNumber(source.apyPct30D),
    stablecoin: Boolean(source.stablecoin),
    ilRisk: normalizeString(source.ilRisk),
    exposure: normalizeString(source.exposure),
    predictions: normalizePredictions(source.predictions),
    poolMeta: typeof source.poolMeta === "string" ? source.poolMeta : null,
    mu: normalizeNumber(source.mu),
    sigma: normalizeNumber(source.sigma),
    count: normalizeNumber(source.count),
    outlier: Boolean(source.outlier),
    underlyingTokens: normalizeStringArray(source.underlyingTokens),
    dex: normalizeStringArray(source.dex),
    dexFormatted: normalizeString(source.dexFormatted),
    il7d: normalizeNullableNumber(source.il7d),
    apyBase7d: normalizeNullableNumber(source.apyBase7d),
    apyMean30d: normalizeNumber(source.apyMean30d),
    volumeUsd1d: normalizeNullableNumber(source.volumeUsd1d),
    volumeUsd7d: normalizeNullableNumber(source.volumeUsd7d),
    apyBaseInception: normalizeNullableNumber(source.apyBaseInception),
    url: normalizeString(source.url),
  };
};

export default function PocLpPage() {
  const poolsData = Array.isArray(pocLpPools) ? pocLpPools.map(normalizePool) : [];
  const dexsData = normalizeStringArray(pocLpDexs);

  return (
    <DefiTokensSectionTest
      persisKey={ACCORDION_KEY}
      exportFileName="POC LP Mock"
      overrides={{
        pools: poolsData,
        dexs: dexsData,
        title: "POC LP"
      }}
    />
  );
}


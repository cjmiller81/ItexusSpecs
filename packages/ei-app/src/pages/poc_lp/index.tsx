import DefiTokensSectionTest from "@/features/Income/DefiTokensSectionTest";
import { PoolData } from "@/features/Income/Models/PoolData";
import pocLpPools from "@/mocks/data/pocLpPools.json";
import pocLpDexs from "@/mocks/data/pocLpDexs.json";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Fragment, useMemo, useState } from "react";

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

const MAIN_TABS = ["All DeFi", "Lending", "Staking & Yield", "Trading & Exchanges", "Stablecoins & Services"] as const;
type MainTab = (typeof MAIN_TABS)[number];

const QUICK_FILTERS: Record<MainTab, string[]> = {
  "All DeFi": [],
  Lending: [
    "All Lending",
    "Lending",
    "CDP",
    "NFT Lending",
    "RWA Lending",
    "Onchain Capital Allocation",
    "Uncollateralized Lending",
  ],
  "Staking & Yield": [
    "All Staking & Yield",
    "Farm",
    "Leveraged Farming",
    "Liquid Restaking",
    "Liquid Staking",
    "Restaking",
    "Staking Pool",
    "Yield",
    "Yield Aggregator",
  ],
  "Trading & Exchanges": [
    "All Trading & Exchange",
    "Basis Trading",
    "Derivatives",
    "DEX Aggregator",
    "Dexs",
    "Liquidity Manager",
    "Options",
    "Options Vaults",
    "Prediction Market",
    "Synthetics",
  ],
  "Stablecoins & Services": [
    "All Stablecoins & Services",
    "Algo-Stables",
    "Bridge",
    "Chain",
    "Cross Chain Bridge",
    "DOR",
    "Dual-Token Stablecoin",
    "Indexes",
    "Insurances",
    "NFT Marketplace",
    "Partially Algorithmic Stablecoin",
    "Payments",
    "Reserve Currency",
    "RWA",
    "Services",
  ],
};

const PrefilterMockSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mutedText = isDark ? "rgba(229, 231, 235, 0.72)" : "rgba(55, 65, 81, 0.75)";
  const highlightColor = "#10B981";
  const borderColor = isDark ? alpha("#ffffff", 0.12) : alpha("#0f172a", 0.24);
  const chipBorderColor = isDark ? alpha("#ffffff", 0.08) : alpha("#0f172a", 0.3);
  const [currentTab, setCurrentTab] = useState<MainTab>("All DeFi");
  const quickFilters = QUICK_FILTERS[currentTab];
  const defaultQuickFilter = useMemo(() => quickFilters?.[0] ?? "All", [quickFilters]);
  const [selectedFilters, setSelectedFilters] = useState<Record<MainTab, string>>(() => ({
    "All DeFi": "All",
    Lending: "All Lending",
    "Staking & Yield": QUICK_FILTERS["Staking & Yield"]?.[0] ?? "All",
    "Trading & Exchanges": QUICK_FILTERS["Trading & Exchanges"]?.[0] ?? "All",
    "Stablecoins & Services": QUICK_FILTERS["Stablecoins & Services"]?.[0] ?? "All",
  }));
  const activeQuickFilter = selectedFilters[currentTab] ?? defaultQuickFilter;
  const filterMessage =
    currentTab === "All DeFi"
      ? "No filter applied"
      : `Filtered by: ${currentTab}${activeQuickFilter ? ` ➜ ${activeQuickFilter}` : ""}`;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {MAIN_TABS.map(tab => (
          <Button
            key={tab}
            size="small"
            disableElevation
            sx={{
              position: "relative",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "999px",
              px: 2.5,
              py: 1,
              bgcolor: tab === currentTab ? (isDark ? alpha(highlightColor, 0.18) : alpha(highlightColor, 0.25)) : "transparent",
              color: tab === currentTab ? (isDark ? "#ffffff" : "#0f172a") : mutedText,
              border: `1px solid ${tab === currentTab ? alpha(highlightColor, 0.6) : borderColor}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: tab === currentTab ? (isDark ? alpha(highlightColor, 0.24) : alpha(highlightColor, 0.35)) : alpha(isDark ? "#ffffff" : "#0f172a", 0.08),
              },
            }}
            onClick={() => {
              setCurrentTab(tab);
              if (!selectedFilters[tab]) {
                setSelectedFilters(prev => ({ ...prev, [tab]: QUICK_FILTERS[tab]?.[0] ?? "All" }));
              }
            }}
          >
            {tab}
          </Button>
        ))}
      </Stack>

      {quickFilters.length > 0 && (
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" sx={{ rowGap: 1 }}>
          <Typography variant="body2" sx={{ color: mutedText, fontWeight: 600 }}>
            Quick Filter:
          </Typography>
          {quickFilters.map(label => (
            <Chip
              key={label}
              label={label}
              onClick={() =>
                setSelectedFilters(prev => ({
                  ...prev,
                  [currentTab]: label,
                }))
              }
              sx={{
                height: 32,
                borderRadius: "999px",
                fontWeight: label === activeQuickFilter ? 700 : 500,
                letterSpacing: 0.3,
                bgcolor: label === activeQuickFilter ? highlightColor : "transparent",
                color: label === activeQuickFilter ? "#ffffff" : mutedText,
                border: label === activeQuickFilter ? "none" : `1px solid ${chipBorderColor}`,
                cursor: "pointer",
                "& .MuiChip-label": { px: 2.5 },
              }}
            />
          ))}
        </Stack>
      )}
      
      <Box
        sx={{
          mt: 1,
          p: 2,
          borderRadius: 1.5,
          border: `1px dashed ${isDark ? alpha("#ffffff", 0.14) : alpha("#0f172a", 0.35)}`,
          color: mutedText,
          fontSize: 14,
          backgroundColor: isDark ? "transparent" : alpha("#0f172a", 0.02),
        }}
      >
        {filterMessage}
      </Box>
    </Box>
  );
};

export default function PocLpPage() {
  const poolsData = Array.isArray(pocLpPools) ? pocLpPools.map(normalizePool) : [];
  const dexsData = normalizeStringArray(pocLpDexs);

  return (
    <Fragment>
      <DefiTokensSectionTest
        persisKey={ACCORDION_KEY}
        exportFileName="POC LP Mock"
        overrides={{
          pools: poolsData,
          dexs: dexsData,
          title: "POC LP",
          prefilterControls: <PrefilterMockSection />,
        }}
      />
    </Fragment>
  );
}


import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMemo, useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const MAIN_TABS = ["All DeFi", "Lending", "Staking & Yield", "Trading & Exchanges", "Stablecoins", "Infrastructure & Services"] as const;
type MainTab = (typeof MAIN_TABS)[number];

const ALL_STABLECOINS_CATEGORIES = [
  "Algo-Stables",
  "Dual-Token Stablecoin",
  "Partially Algorithmic Stablecoin",
  "Reserve Currency",
];

const ALL_LENDING_CATEGORIES = [
  "Lending",
  "CDP",
  "NFT Lending",
  "RWA Lending",
  "Onchain Capital Allocator",
  "Uncollateralized Lending",
];

const ALL_STAKING_YIELD_CATEGORIES = [
  "Farm",
  "Leveraged Farming",
  "Liquid Restaking",
  "Liquid Staking",
  "Restaking",
  "Staking Pool",
  "Yield",
  "Yield Aggregator",
];

const ALL_TRADING_EXCHANGE_CATEGORIES = [
  "Basis Trading",
  "Derivatives",
  "DEX Aggregator",
  "Dexs",
  "Liquidity manager",
  "Options",
  "Options Vault",
  "Prediction Market",
  "Synthetics",
];

const ALL_INFRASTRUCTURE_SERVICES_CATEGORIES = [
  "Bridge",
  "Cross Chain Bridge",
  "Chain",
  "Services",
  "Indexes",
  "Insurance",
  "Payments",
  "DOR",
  "NFT Marketplace",
  "RWA",
];

const CATEGORY_NAME_MAPPING: Record<string, string> = {
  "Options Vaults": "Options Vault",
  "Onchain Capital Allocation": "Onchain Capital Allocator",
  "Insurances": "Insurance",
  "Liquidity Manager": "Liquidity manager",
};

const getCategoryName = (filterLabel: string): string => {
  return CATEGORY_NAME_MAPPING[filterLabel] || filterLabel;
};

const buildFilterFromSelection = (tab: MainTab, filterLabel: string): any[] | null => {
  if (tab === "All DeFi") {
    return null;
  }

  if (filterLabel.startsWith("All ")) {
    let categories: string[] = [];
    
    if (filterLabel === "All Stablecoins") {
      categories = ALL_STABLECOINS_CATEGORIES;
    } else if (filterLabel === "All Lending") {
      categories = ALL_LENDING_CATEGORIES;
    } else if (filterLabel === "All Staking & Yield") {
      categories = ALL_STAKING_YIELD_CATEGORIES;
    } else if (filterLabel === "All Trading & Exchange") {
      categories = ALL_TRADING_EXCHANGE_CATEGORIES;
    } else if (filterLabel === "All Infrastructure & Services") {
      categories = ALL_INFRASTRUCTURE_SERVICES_CATEGORIES;
    }
    
    if (categories.length === 0) return null;
    
    return ["category", "anyof", categories];
  }

  const actualCategoryName = getCategoryName(filterLabel);
  return ["category", "=", actualCategoryName];
};

interface CategoryFiltersSectionProps {
  onFilterChange?: (filter: any[] | null) => void;
}

export interface CategoryFiltersSectionRef {
  clearFilter: () => void;
}

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
  Stablecoins: [
    "All Stablecoins",
    "Algo-Stables",
    "Dual-Token Stablecoin",
    "Partially Algorithmic Stablecoin",
    "Reserve Currency",
  ],
  "Infrastructure & Services": [
    "All Infrastructure & Services",
    "Bridge",
    "Cross Chain Bridge",
    "Chain",
    "Services",
    "Indexes",
    "Insurances",
    "Payments",
    "DOR",
    "NFT Marketplace",
    "RWA",
  ],
};

export const CategoryFiltersSection = forwardRef<CategoryFiltersSectionRef, CategoryFiltersSectionProps>(
  ({ onFilterChange }, ref) => {
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
    Stablecoins: QUICK_FILTERS.Stablecoins?.[0] ?? "All",
    "Infrastructure & Services": QUICK_FILTERS["Infrastructure & Services"]?.[0] ?? "All",
  }));
  const activeQuickFilter = selectedFilters[currentTab] ?? defaultQuickFilter;

  useImperativeHandle(ref, () => ({
    clearFilter: () => {
      setCurrentTab("All DeFi");
      setSelectedFilters({
        "All DeFi": "All",
        Lending: "All Lending",
        "Staking & Yield": QUICK_FILTERS["Staking & Yield"]?.[0] ?? "All",
        "Trading & Exchanges": QUICK_FILTERS["Trading & Exchanges"]?.[0] ?? "All",
        Stablecoins: QUICK_FILTERS.Stablecoins?.[0] ?? "All",
        "Infrastructure & Services": QUICK_FILTERS["Infrastructure & Services"]?.[0] ?? "All",
      });
      if (onFilterChange) {
        onFilterChange(null);
      }
    },
  }), [onFilterChange]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (onFilterChange) {
        const filter = buildFilterFromSelection(currentTab, activeQuickFilter);
        onFilterChange(filter);
      }
      return;
    }
    
    if (onFilterChange) {
      const filter = buildFilterFromSelection(currentTab, activeQuickFilter);
      onFilterChange(filter);
    }
  }, [currentTab, activeQuickFilter, onFilterChange]);

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
              const defaultFilter = QUICK_FILTERS[tab]?.[0] ?? "All";
              if (!selectedFilters[tab]) {
                setSelectedFilters(prev => ({ ...prev, [tab]: defaultFilter }));
              }
              if (onFilterChange) {
                const filter = buildFilterFromSelection(tab, selectedFilters[tab] || defaultFilter);
                onFilterChange(filter);
              }
            }}
          >
            {tab}
          </Button>
        ))}
      </Stack>

       {quickFilters.length > 0 && (
         <Card
           sx={{
             p: 2,
             borderRadius: 2,
             border: "none",
             backgroundColor: "transparent",
             boxShadow: isDark 
               ? "4px 4px 8px rgba(0, 0, 0, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.2)"
               : "4px 4px 8px rgba(0, 0, 0, 0.1), 2px 2px 4px rgba(0, 0, 0, 0.05)",
           }}
         >
          <Typography
            variant="body2"
            sx={{
              color: mutedText,
              fontWeight: 600,
              mb: 1.5,
              fontSize: "0.875rem",
            }}
          >
            Category:
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="nowrap"
            sx={{
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                borderRadius: "3px",
                "&:hover": {
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                },
              },
            }}
          >
            {quickFilters.map(label => (
              <Chip
                key={label}
                label={label}
                onClick={() => {
                  const newFilters = {
                    ...selectedFilters,
                    [currentTab]: label,
                  };
                  setSelectedFilters(newFilters);
                  if (onFilterChange) {
                    const filter = buildFilterFromSelection(currentTab, label);
                    onFilterChange(filter);
                  }
                }}
                sx={{
                  height: 32,
                  borderRadius: "999px",
                  fontWeight: label === activeQuickFilter ? 700 : 500,
                  letterSpacing: 0.3,
                  bgcolor: label === activeQuickFilter ? highlightColor : "transparent",
                  color: label === activeQuickFilter ? "#ffffff" : mutedText,
                  border: label === activeQuickFilter ? "none" : `1px solid ${chipBorderColor}`,
                  cursor: "pointer",
                  flexShrink: 0,
                  "& .MuiChip-label": { px: 2.5 },
                }}
              />
            ))}
          </Stack>
        </Card>
      )}
    </Box>
  );
});


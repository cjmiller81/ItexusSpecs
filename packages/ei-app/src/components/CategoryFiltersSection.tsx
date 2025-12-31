import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import React, { useMemo, useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import ReactDOM from "react-dom";
import { keyframes } from "@mui/material/styles";
import { CategoryFilterType } from "@/types/filter";

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
  onFilterChange?: (filter: any[] | null, filterContext: CategoryFilterType) => void;
}

export interface CategoryFiltersSectionRef {
  clearFilter: () => void;
  clearTooltips: () => void;
}

const CATEGORY_TOOLTIPS: Record<string, string> = {
  "Algo-Stables": "Algorithmic stablecoins maintaining price through supply adjustments",
  "Basis Trading": "Capture funding rate spreads between spot/futures",
  "Bridge": "Transfer assets between blockchain networks",
  "CDP": "Lock collateral to mint stablecoins or borrow",
  "Chain": "Native blockchain staking for network security",
  "Cross Chain Bridge": "Multi-chain asset transfer infrastructure",
  "Derivatives": "Exposure to crypto-based financial contracts",
  "DEX Aggregator": "Optimize trades across multiple exchanges",
  "Dexs": "Peer-to-peer token swaps via automated pools",
  "DOR": "Manage and optimize options positions",
  "Dual-Token Stablecoin": "Two-token stability mechanisms",
  "Farm": "Earn rewards for providing liquidity",
  "Indexes": "Diversified crypto asset portfolios",
  "Insurances": "Smart contract and protocol failure coverage",
  "Lending": "Earn yield on deposits, borrow against collateral",
  "Leveraged Farming": "Amplified farming with borrowed capital",
  "Liquid Restaking": "Restake staked assets while maintaining liquidity",
  "Liquid Staking": "Stake assets, receive liquid tokens",
  "Liquidity Manager": "Automated concentrated liquidity optimization",
  "NFT Lending": "Borrow and lend using NFT collateral",
  "NFT Marketplace": "Trade and provide liquidity for NFTs",
  "Onchain Capital Allocation": "Programmatic capital deployment strategies",
  "Options": "Right to buy/sell at predetermined prices",
  "Options Vaults": "Generate yield selling options premium",
  "Partially Algorithmic Stablecoin": "Hybrid algorithmic and collateral-backed stability",
  "Payments": "Crypto payment processing infrastructure",
  "Prediction Market": "Bet on future event outcomes",
  "Reserve Currency": "Treasury-backed governance tokens",
  "Restaking": "Stake already-staked assets for extra rewards",
  "RWA": "Tokenized real-world asset yields",
  "RWA Lending": "Loans backed by tokenized real-world assets",
  "Services": "DeFi infrastructure and utility protocols",
  "Staking Pool": "Collective proof-of-stake participation",
  "Synthetics": "Track asset prices without direct ownership",
  "Uncollateralized Lending": "Credit-based loans without upfront collateral",
  "Yield": "Aggregated return-generating strategies",
  "Yield Aggregator": "Auto-optimize yields across protocols",
};

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.25;
  }
`;

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
  const [pinnedTooltip, setPinnedTooltip] = useState<string | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const chipRefs = useRef<Record<string, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPinnedTooltip(null);
    setHoveredTooltip(null);
  }, [currentTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setPinnedTooltip(null);
      }
    };

    if (pinnedTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [pinnedTooltip]);

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
        onFilterChange(null, { tab: undefined, category: undefined } );
      }
    },
    clearTooltips: () => {
      setPinnedTooltip(null);
      setHoveredTooltip(null);
    },
  }), [onFilterChange]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (onFilterChange) {
        const filter = buildFilterFromSelection(currentTab, activeQuickFilter);
        onFilterChange(filter, { tab: currentTab, category: activeQuickFilter } );
      }
      return;
    }
    
    if (onFilterChange) {
      const filter = buildFilterFromSelection(currentTab, activeQuickFilter);
      onFilterChange(filter, { tab: currentTab, category: activeQuickFilter });
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
                onFilterChange(filter, { tab: currentTab, category: activeQuickFilter });
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
          <Box
            ref={containerRef}
            onMouseLeave={() => {
              if (!pinnedTooltip) {
                setHoveredTooltip(null);
              }
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              flexWrap="nowrap"
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
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
              {quickFilters.map(label => {
                const tooltipText = CATEGORY_TOOLTIPS[label];
                const hasTooltip = Boolean(tooltipText && !label.startsWith("All "));
                const isPinned = pinnedTooltip === label;
                const isHovered = hoveredTooltip === label;
                const isActive = label === activeQuickFilter;
                const showTooltip = hasTooltip && (isHovered || (isPinned && (hoveredTooltip === null || hoveredTooltip === label)));

                return (
                  <Box
                    key={label}
                    ref={(el: HTMLDivElement | null) => {
                      chipRefs.current[label] = el;
                    }}
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                    }}
                    onMouseEnter={() => {
                      if (hasTooltip) {
                        setHoveredTooltip(label);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isPinned) {
                        setHoveredTooltip(null);
                      }
                    }}
                  >
                    <Chip
                      label={label}
                      onClick={() => {
                        const newFilters = {
                          ...selectedFilters,
                          [currentTab]: label,
                        };
                        setSelectedFilters(newFilters);
                        
                        if (onFilterChange) {
                          const filter = buildFilterFromSelection(currentTab, label);
                          onFilterChange(filter, { tab: currentTab, category: activeQuickFilter });
                        }
                        
                        if (hasTooltip) {
                          if (isPinned) {
                            setPinnedTooltip(null);
                          } else {
                            setPinnedTooltip(label);
                          }
                        }
                      }}
                      sx={{
                        height: 32,
                        borderRadius: "999px",
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: 0.3,
                        bgcolor: isActive ? highlightColor : "transparent",
                        color: isActive ? "#ffffff" : mutedText,
                        border: isActive ? "none" : `1px solid ${isHovered && !isActive ? highlightColor : chipBorderColor}`,
                        cursor: "pointer",
                        flexShrink: 0,
                        position: "relative",
                        "& .MuiChip-label": { px: 2.5 },
                        ...(isHovered && !isActive && {
                          boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.15)",
                        }),
                        ...(isPinned && {
                          boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(16, 185, 129, 0.3)",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: "-4px",
                            borderRadius: "28px",
                            background: "linear-gradient(135deg, #10B981 0%, transparent 50%)",
                            opacity: 0.15,
                            zIndex: -1,
                            animation: `${pulseGlow} 2s ease-in-out infinite`,
                          },
                        }),
                      }}
                    />
                    {hasTooltip && showTooltip && typeof window !== "undefined" && chipRefs.current[label] && ReactDOM.createPortal(
                      <CategoryTooltip
                        chipElement={chipRefs.current[label]}
                        text={tooltipText}
                        isPinned={isPinned}
                        theme={theme}
                      />,
                      document.body
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Card>
      )}
    </Box>
  );
});

CategoryFiltersSection.displayName = 'CategoryFiltersSection';

interface CategoryTooltipProps {
  chipElement: HTMLElement | null;
  text: string;
  isPinned: boolean;
  theme: any;
}

const CategoryTooltip: React.FC<CategoryTooltipProps> = ({ chipElement, text, isPinned, theme }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (chipElement) {
      const updatePosition = () => {
        const chip = chipElement.querySelector('.MuiChip-root') as HTMLElement;
        const targetElement = chip || chipElement;
        const rect = targetElement.getBoundingClientRect();
        
        setPosition({
          top: rect.top - 16,
          left: rect.left + rect.width / 2,
        });
      };

      updatePosition();
      
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [chipElement]);

  if (!chipElement) return null;

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translate(-50%, calc(-100% - 16px))",
        zIndex: 10000,
        pointerEvents: isPinned ? "auto" : "none",
        transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          background: isDark ? "#1a1d2e" : "#ffffff",
          color: isDark ? "#e0e0e0" : "#0f172a",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 400,
          whiteSpace: "nowrap",
          border: "2px solid #10B981",
          boxShadow: isDark
            ? "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.2)"
            : "0 8px 24px rgba(0, 0, 0, 0.15), 0 0 20px rgba(16, 185, 129, 0.15)",
          minWidth: "300px",
          textAlign: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "12px",
            background: "#10B981",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            border: "8px solid transparent",
            borderTopColor: "#10B981",
          },
        }}
      >
        {text}
      </Box>
    </Box>
  );
};


/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import React, { useMemo, useState, useImperativeHandle, forwardRef } from "react";

export const ALL_VAULTS = "All Vaults" as const;
export const PRIMARY_TABS = [
  ALL_VAULTS,
  "Concentrated Liquidity",
  "Liquidity Pools",
  "Lending Vaults",
  "Single-Asset Staking",
] as const;
export type BeefyMajorTab = (typeof PRIMARY_TABS)[number];

const SUBCATEGORIES: Record<Exclude<BeefyMajorTab, typeof ALL_VAULTS>, string[]> = {
  "Concentrated Liquidity": ["All Concentrated Liquidity", "CLM Pools", "Managed Range"],
  "Liquidity Pools": ["All Liquidity Pools", "LP", "Multi-LP", "Compounding LP"],
  "Lending Vaults": ["All Lending Vaults", "Curated Lending", "Money Market", "Leveraged Lending", "Stable Savings"],
  "Single-Asset Staking": ["All Single-Asset Staking", "Native Staking", "Maxi"],
};


interface BeefyVaultCategoryFiltersSectionProps {
  onFilterChange?: (filter: any[] | null, filterContext: { tab: string | undefined; category: string | undefined }) => void;
}

export interface BeefyVaultCategoryFiltersSectionRef {
  clearFilter: () => void;
  clearTooltips: () => void;
  setFilter: (filter: any, tab: BeefyMajorTab, category?: string) => void;
}

export const BeefyVaultCategoryFiltersSection = forwardRef<BeefyVaultCategoryFiltersSectionRef, BeefyVaultCategoryFiltersSectionProps>(
  ({ onFilterChange }, ref) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const mutedText = isDark ? "rgba(229, 231, 235, 0.72)" : "rgba(55, 65, 81, 0.75)";
    const highlightColor = "#10B981";
    const borderColor = isDark ? alpha("#ffffff", 0.12) : alpha("#0f172a", 0.24);
    const chipBorderColor = isDark ? alpha("#ffffff", 0.08) : alpha("#0f172a", 0.3);

    const [currentTab, setCurrentTab] = useState<BeefyMajorTab>(ALL_VAULTS);
    const [selectedSub, setSelectedSub] = useState<string>("");

    const subCategories = useMemo(() => {
      if (currentTab === ALL_VAULTS) return [];
      return SUBCATEGORIES[currentTab as Exclude<BeefyMajorTab, typeof ALL_VAULTS>] ?? [];
    }, [currentTab]);

    const activeSubFilter = selectedSub || (subCategories[0] ?? "");

    useImperativeHandle(ref, () => ({
      clearFilter: () => {
        setCurrentTab(ALL_VAULTS);
        setSelectedSub("");
        onFilterChange?.(null, { tab: undefined, category: undefined });
      },
      clearTooltips: () => {},
      setFilter: (filter: any, tab: BeefyMajorTab, category?: string) => {
        if (PRIMARY_TABS.includes(tab)) {
          setCurrentTab(tab);
          const allLabel = tab !== ALL_VAULTS ? `All ${tab}` : "";
          setSelectedSub(category && category !== allLabel ? category : "");
          onFilterChange?.(filter, {
            tab: tab === ALL_VAULTS ? undefined : tab,
            category: category || undefined,
          });
        }
      },
    }), [onFilterChange]);

    const handleTabClick = (tab: BeefyMajorTab) => {
      setCurrentTab(tab);
      setSelectedSub("");
      if (onFilterChange) {
        if (tab === ALL_VAULTS) {
          onFilterChange(null, { tab: undefined, category: undefined });
        } else {
          const defaultSub = SUBCATEGORIES[tab as Exclude<BeefyMajorTab, typeof ALL_VAULTS>]?.[0] ?? "";
          onFilterChange(null, { tab, category: defaultSub || undefined });
        }
      }
    };

    const handleSubClick = (sub: string) => {
      setSelectedSub(sub);
      if (onFilterChange && currentTab !== ALL_VAULTS) {
        onFilterChange(null, { tab: currentTab, category: sub || undefined });
      }
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {PRIMARY_TABS.map(tab => (
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
                  bgcolor: tab === currentTab
                    ? (isDark ? alpha(highlightColor, 0.24) : alpha(highlightColor, 0.35))
                    : alpha(isDark ? "#ffffff" : "#0f172a", 0.08),
                },
              }}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </Button>
          ))}
        </Stack>

        {subCategories.length > 0 && (
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              border: "none",
              backgroundColor: "transparent",
              boxShadow: isDark
                ? "4px 4px 8px rgba(0,0,0,0.3), 2px 2px 4px rgba(0,0,0,0.2)"
                : "4px 4px 8px rgba(0,0,0,0.1), 2px 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: mutedText, fontWeight: 600, mb: 1.5, fontSize: "0.875rem" }}
            >
              Category:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="nowrap"
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                  borderRadius: "3px",
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                  },
                },
              }}
            >
              {subCategories.map(label => {
                const isActive = label === (activeSubFilter || subCategories[0]);
                return (
                  <Chip
                    key={label}
                    label={label}
                    onClick={() => handleSubClick(label)}
                    sx={{
                      height: 32,
                      borderRadius: "999px",
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: 0.3,
                      bgcolor: isActive ? highlightColor : "transparent",
                      color: isActive ? "#ffffff" : mutedText,
                      border: isActive ? "none" : `1px solid ${chipBorderColor}`,
                      cursor: "pointer",
                      flexShrink: 0,
                      "& .MuiChip-label": { px: 2.5 },
                    }}
                  />
                );
              })}
            </Stack>
          </Card>
        )}
      </Box>
    );
  }
);

BeefyVaultCategoryFiltersSection.displayName = "BeefyVaultCategoryFiltersSection";

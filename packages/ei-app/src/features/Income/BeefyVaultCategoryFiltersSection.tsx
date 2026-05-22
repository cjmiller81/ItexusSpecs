import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { BEEFY_MAJOR_CATEGORIES } from "./beefyVaultCategoryConfig";

const ALL_VAULTS = "All Vaults";

const PRIMARY_TABS = [ALL_VAULTS, ...BEEFY_MAJOR_CATEGORIES.map(c => c.label)] as const;
export type BeefyMajorTab = (typeof PRIMARY_TABS)[number];

export interface BeefyVaultCategoryFiltersSectionRef {
  clearFilter: () => void;
  clearTooltips: () => void;
  setFilter: (filter: any, tab: BeefyMajorTab, category?: string) => void;
}

interface BeefyVaultCategoryFiltersSectionProps {
  onFilterChange?: (filter: any[] | null, filterContext: { tab: string | undefined; category: string | undefined }) => void;
}

const buildBeefyFilter = (majorLabel: string, subLabel: string): any[] | null => {
  if (majorLabel === ALL_VAULTS) return null;

  const major = BEEFY_MAJOR_CATEGORIES.find(c => c.label === majorLabel);
  if (!major) return null;

  if (subLabel === `All ${majorLabel}`) return major.filter;

  const sub = major.subCategories.find(s => s.label === subLabel);
  return sub ? sub.filter : major.filter;
};

export const BeefyVaultCategoryFiltersSection = forwardRef<
  BeefyVaultCategoryFiltersSectionRef,
  BeefyVaultCategoryFiltersSectionProps
>(({ onFilterChange }, ref) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mutedText = isDark ? "rgba(229, 231, 235, 0.72)" : "rgba(55, 65, 81, 0.75)";
  const highlightColor = "#10B981";
  const borderColor = isDark ? alpha("#ffffff", 0.12) : alpha("#0f172a", 0.24);
  const chipBorderColor = isDark ? alpha("#ffffff", 0.08) : alpha("#0f172a", 0.3);

  type TabState = { tab: BeefyMajorTab; sub: string; filterOverride?: any };
  const [tabState, setTabState] = useState<TabState>({ tab: ALL_VAULTS, sub: "" });
  const currentTab = tabState.tab;
  const selectedSub = tabState.sub;

  const major = BEEFY_MAJOR_CATEGORIES.find(c => c.label === currentTab);
  const allSubLabel = major ? `All ${major.label}` : "";

  useImperativeHandle(ref, () => ({
    clearFilter: () => {
      setTabState({ tab: ALL_VAULTS, sub: "" });
      onFilterChange?.(null, { tab: undefined, category: undefined });
    },
    clearTooltips: () => {},
    setFilter: (filter, tab, category) => {
      if (PRIMARY_TABS.includes(tab)) {
        setTabState({
          tab,
          sub: category && category !== `All ${tab}` ? category : "",
          filterOverride: filter,
        });
      }
    },
  }), [onFilterChange]);

  const isInitialMount = useRef(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      onFilterChange?.(null, { tab: undefined, category: undefined });
      return;
    }
    if (tabState.filterOverride !== undefined) {
      onFilterChange?.(tabState.filterOverride, {
        tab: tabState.tab === ALL_VAULTS ? undefined : tabState.tab,
        category: tabState.sub || undefined,
      });
      return;
    }
    const filter = buildBeefyFilter(currentTab, selectedSub || allSubLabel);
    onFilterChange?.(filter, { tab: currentTab === ALL_VAULTS ? undefined : currentTab, category: selectedSub || allSubLabel || undefined });
  }, [tabState, onFilterChange]);

  const handleMajorClick = (tab: BeefyMajorTab) => {
    setTabState({ tab, sub: "" });
  };

  const handleSubClick = (subLabel: string) => {
    setTabState(prev => ({ ...prev, sub: subLabel, filterOverride: undefined }));
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
              bgcolor: tab === currentTab
                ? (isDark ? alpha(highlightColor, 0.18) : alpha(highlightColor, 0.25))
                : "transparent",
              color: tab === currentTab ? (isDark ? "#ffffff" : "#0f172a") : mutedText,
              border: `1px solid ${tab === currentTab ? alpha(highlightColor, 0.6) : borderColor}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: tab === currentTab
                  ? (isDark ? alpha(highlightColor, 0.24) : alpha(highlightColor, 0.35))
                  : alpha(isDark ? "#ffffff" : "#0f172a", 0.08),
              },
            }}
            onClick={() => handleMajorClick(tab)}
          >
            {tab}
          </Button>
        ))}
      </Stack>

      {major && (
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
            {[{ label: allSubLabel }, ...major.subCategories].map(({ label }) => {
              const isActive = (selectedSub || allSubLabel) === label;
              return (
                <Chip
                  key={label}
                  label={label}
                  onClick={() => handleSubClick(label === allSubLabel ? "" : label)}
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
                    position: "relative",
                    "& .MuiChip-label": { px: 2.5 },
                    "&:hover": isActive ? {} : {
                      border: `1px solid ${highlightColor}`,
                      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.15)",
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Card>
      )}
    </Box>
  );
});

BeefyVaultCategoryFiltersSection.displayName = "BeefyVaultCategoryFiltersSection";

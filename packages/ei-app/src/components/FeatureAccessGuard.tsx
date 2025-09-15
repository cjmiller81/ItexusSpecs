import React, { ReactNode } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Tooltip, Button, Box, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import BlockIcon from "@mui/icons-material/Block";

interface FeatureAccessGuardProps {
  feature: "saveStrategy" | "tableExport" | "tradeAggregatorQuoteDEX" | "walletConnectionCEX" | "walletConnectionDEX";
  children: ReactNode;
  currentCount?: number; // For features with limits like saved strategies or wallet connections
  filterType?: string; // For saveStrategy feature - the type of filter being saved
  savedFilters?: any[]; // Array of saved filters for checking limits by type
  showTooltip?: boolean;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean; // Allow external disabling
}

export const FeatureAccessGuard: React.FC<FeatureAccessGuardProps> = ({
  feature,
  children,
  currentCount = 0,
  filterType,
  savedFilters = [],
  showTooltip = false,
  tooltipPlacement = "top",
  disabled: externalDisabled = false,
}) => {
  const { subscription, canSaveStrategy, canSaveStrategyByType, canExportTable, canConnectWallet, getTradeAggregatorQuoteLimit } = useSubscription();
  const router = useRouter();
  const { t } = useTranslation("AccessControl");

  let isFeatureAvailable = true;
  let tooltipMessage = "";
  let limit = 0;

  if (!subscription.plan || !subscription.isActive) {
    isFeatureAvailable = false;
    tooltipMessage = t("Loading subscription details...");
  } else {
    switch (feature) {
      case "saveStrategy":
        // If filterType is provided, check limits by type
        if (filterType && savedFilters.length > 0) {
          isFeatureAvailable = canSaveStrategyByType(filterType, savedFilters);
        } else {
          // Fallback to general count check
          isFeatureAvailable = canSaveStrategy(currentCount);
        }
        limit = subscription.plan.featureLimits.savedStrategyCount;
        if (!isFeatureAvailable) {
          if (filterType) {
            tooltipMessage = t("You have reached the limit of {{limit}} saved {{filterType}} strategies for {{plan}} plan", { 
              limit, 
              filterType, 
              plan: subscription.plan.name 
            });
          } else {
            tooltipMessage = t("You have reached the limit of {{limit}} saved strategies for {{plan}} plan", { 
              limit, 
              plan: subscription.plan.name 
            });
          }
        }
        break;
      case "tableExport":
        isFeatureAvailable = canExportTable();
        if (!isFeatureAvailable) {
          tooltipMessage = t("Table export is not available in {{plan}} plan", { plan: subscription.plan.name });
        }
        break;
      case "tradeAggregatorQuoteDEX":
        isFeatureAvailable = getTradeAggregatorQuoteLimit() > 0; // Check if limit is greater than 0
        limit = subscription.plan.featureLimits.tradeAggregatorQuoteCountDEX;
        if (!isFeatureAvailable) {
          tooltipMessage = t("DEX quote requests are not available in {{plan}} plan", { plan: subscription.plan.name });
        }
        break;
      case "walletConnectionCEX":
        isFeatureAvailable = canConnectWallet('CEX', currentCount);
        limit = subscription.plan.featureLimits.walletConncectionCountCEX;
        if (!isFeatureAvailable) {
          tooltipMessage = t("You have reached the limit of {{limit}} {{type}} wallet connections for {{plan}} plan", { limit, type: 'CEX', plan: subscription.plan.name });
        }
        break;
      case "walletConnectionDEX":
        isFeatureAvailable = canConnectWallet('DEX', currentCount);
        limit = subscription.plan.featureLimits.walletConncectionCountDEX;
        if (!isFeatureAvailable) {
          tooltipMessage = t("You have reached the limit of {{limit}} {{type}} wallet connections for {{plan}} plan", { limit, type: 'DEX', plan: subscription.plan.name });
        }
        break;
      default:
        isFeatureAvailable = false;
        tooltipMessage = t("This feature is not available in your current plan");
    }
  }

  const renderContent = (
    <Box sx={{ display: 'inline-block', cursor: isFeatureAvailable && !externalDisabled ? 'pointer' : 'not-allowed' }}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            disabled: !isFeatureAvailable || externalDisabled,
          });
        }
        return child;
      })}
    </Box>
  );

  if (showTooltip && !isFeatureAvailable) {
    return (
      <Tooltip
        title={
          <Stack spacing={1} sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BlockIcon sx={{ color: 'error.main', fontSize: 20 }} />
              <Typography variant="body2">{tooltipMessage}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => router.push("/profile/billing")}
            >
              {t("Upgrade Plan")}
            </Button>
          </Stack>
        }
        placement={tooltipPlacement}
        arrow
      >
        {renderContent}
      </Tooltip>
    );
  }

  return renderContent;
};


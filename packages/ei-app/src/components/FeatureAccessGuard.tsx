import React, { ReactNode } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Tooltip, Button, Box, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface FeatureAccessGuardProps {
  feature: "saveStrategy" | "tableExport" | "tradeAggregatorQuoteDEX" | "walletConnectionCEX" | "walletConnectionDEX";
  children: ReactNode;
  currentCount?: number; // For features with limits like saved strategies or wallet connections
  showTooltip?: boolean;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean; // Allow external disabling
}

export const FeatureAccessGuard: React.FC<FeatureAccessGuardProps> = ({
  feature,
  children,
  currentCount = 0,
  showTooltip = false,
  tooltipPlacement = "top",
  disabled: externalDisabled = false,
}) => {
  const { subscription, canSaveStrategy, canExportTable, canConnectWallet, getTradeAggregatorQuoteLimit } = useSubscription();
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
        isFeatureAvailable = canSaveStrategy(currentCount);
        limit = subscription.plan.featureLimits.savedStrategyCount;
        if (!isFeatureAvailable) {
          tooltipMessage = t("You have reached the limit of {{limit}} saved strategies for {{plan}} plan", { limit, plan: subscription.plan.name });
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
            <Typography variant="body2">{tooltipMessage}</Typography>
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


import React from "react";
import { Box, Button, SxProps, Theme, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@mui/system";
import { useRouter } from "next/router";
import { useSubscription } from "../../hooks/useSubscription";
import { Wallet } from "../../models";

// MUI DataGrid defaults — no overrides in DexWalletsTable
const COLUMN_HEADER_HEIGHT = 56;
const ROW_HEIGHT = 52;

interface WalletLimitOverlayProps {
  wallets: Wallet[] | null;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const WalletLimitOverlay = ({ wallets, children, sx }: WalletLimitOverlayProps) => {
  const { isFreePlan, getWalletConnectionLimit, isLoading } = useSubscription();
  const theme = useTheme();
  const router = useRouter();

  // Free plan is handled by WalletPlanGate at the card level
  if (isLoading || isFreePlan) return <>{children}</>;

  const limit = getWalletConnectionLimit("DEX");
  const excessCount = (wallets?.length ?? 0) - limit;

  if (excessCount <= 0) return <>{children}</>;

  // Overlay starts right after the column header + accessible rows, extends to the
  // bottom of the wrapper (covers excess rows + TablePagination from BasicTable).
  const overlayTop = COLUMN_HEADER_HEIGHT + limit * ROW_HEIGHT;

  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ position: "relative", overflow: "hidden", ...sx }}>
      {children}
      <Box
        sx={{
          position: "absolute",
          top: `${overlayTop}px`,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          backgroundColor: isDark ? "rgba(31, 41, 55, 0.88)" : "rgba(247, 245, 242, 0.88)",
        }}>
        {/* Constrained content row so button never drifts to the table edge */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            width: "100%",
            maxWidth: 680,
            px: 3,
          }}>
          {/* Lock icon + text */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: "rgba(33, 154, 131, 0.15)",
                flexShrink: 0,
              }}>
              <LockOutlinedIcon sx={{ fontSize: "1.5rem", color: "#219a83" }} />
            </Box>

            <Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: isDark ? "#fff" : "#1a1a1a", lineHeight: 1.3 }}>
                {excessCount} wallet{excessCount > 1 ? "s" : ""} exceed your plan limit
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: isDark ? "#9ca3af" : "#6b7280", mt: 0.25 }}>
                Your current plan allows {limit} saved wallet connection{limit !== 1 ? "s" : ""}.
              </Typography>
            </Box>
          </Box>

          {/* CTA */}
          <Button
            variant="contained"
            onClick={() => router.push("/profile/billing")}
            sx={{
              backgroundColor: "#219a83",
              color: "#fff",
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": { backgroundColor: "#1a7d6a" },
            }}>
            Upgrade plan →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

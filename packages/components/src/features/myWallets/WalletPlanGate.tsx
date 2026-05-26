import React from "react";
import { Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/router";
import { useSubscription } from "../../hooks/useSubscription";

interface WalletPlanGateProps {
  children: React.ReactNode;
}

export const WalletPlanGate = ({ children }: WalletPlanGateProps) => {
  const { isFreePlan, isLoading } = useSubscription();
  const router = useRouter();

  if (isLoading || !isFreePlan) return <>{children}</>;

  return (
    <Box sx={{ position: "relative" }}>
      {children}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          backdropFilter: "blur(4px)",
          backgroundColor: theme =>
            theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.55)" : "rgba(247, 245, 242, 0.82)",
          borderRadius: 3,
        }}>
        <LockOutlinedIcon sx={{ fontSize: "2.5rem", color: "text.secondary" }} />
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: 600 }}>
          Wallets aren&apos;t accessible on the free plan
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/profile/billing")}>
          Upgrade Plan
        </Button>
      </Box>
    </Box>
  );
};

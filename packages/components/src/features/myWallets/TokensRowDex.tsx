import { Box, useTheme } from "@mui/system";
import { GridRow } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { toTableTokensModels } from "../../utils";
import { useTranslation } from "react-i18next";
import WalletTokensOverview from "./DEX/WalletTokensOverview";
import MovingIcon from "@mui/icons-material/Moving";
import { Typography } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import { useAppSelector } from "../../slices";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useMemo, useState } from "react";
import { filterDustTokens } from "../../helpers/filterDustTokens";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WalletDeFiOverview from "./DEX/WalletDeFiOverview";

export const ExpandableRowDex = (props: any) => {
  const rows = toTableTokensModels(props.row.chainAssets);
  const { t } = useTranslation("MyWalletsPage");
  const { portfolioWalletData } = useAppSelector( state => state.wallets);
  const [showDust, setShowDust] = useState(false);
  const theme = useTheme();

  if (!Array.isArray(portfolioWalletData)) return null;
    const wallet = portfolioWalletData.find(
    (w) => w.walletAddress === props.row.address
  );
  const filteredTokens = showDust 
    ? wallet?.tokenHoldings || []
    : filterDustTokens(wallet?.tokenHoldings || []);

  const filteredTokensValue = filteredTokens.reduce(
    (sum, token) => sum + (token.balanceUSD || 0), 
    0
  );

  const defiPositions = wallet?.deFiPositions || [];

  const totalDeFiValue = useMemo(() => {
    return defiPositions.reduce((sum: number, pos) => sum + (pos.valueUSD || 0), 0);
  }, [defiPositions]);

  return (
    <Box sx={{ width:"100%" }}>
      <GridRow {...props} />
      {props.isExpanded(props.rowId) && (
        <Box px={3} py={1}>
          <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{paddingRight:"25px"}}>
            <Box sx={{ width: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Box display="flex" alignItems="center">
                  <MovingIcon sx={{ color: theme.palette.mode === "dark" ? "#72dd5f" : "#106201ff", pr: 1, fontSize: "40px" }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 450, mb: 0 }}>
                    {t("WalletTokens")}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.mode === "dark" ? "#72dd5f" : "#106201ff", fontWeight: 500, mr: 3 }}
                  >
                    ${filteredTokensValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>

                  <Box 
                    display="flex" 
                    alignItems="center" 
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowDust(!showDust)}
                  >
                    {showDust ? (
                      <VisibilityOffIcon sx={{ color: "#aaa", fontSize: 22, mr: 0.5 }} />
                    ) : (
                      <RemoveRedEyeIcon sx={{ color: "#aaa", fontSize: 22, mr: 0.5 }} />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {showDust ? t("HideDust") : t("ShowDust")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{width:"100%"}}> 
                <WalletTokensOverview 
                  walletAddress={props.row.address}
                  tokens={filteredTokens}
                />
              </Box>
            </Box>
          </Box>
          
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
            mb={1}
          >
            <Box display="flex" alignItems="center">
              <LayersIcon sx={{ color: "#e49a41", pr: 1, fontSize: "40px" }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 450, mb: 0 }}>
                {t("DeFiPositions")}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{ color: "#e49a41", fontWeight: 500, mr: 3 }}
            >
              ${totalDeFiValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          <WalletDeFiOverview walletAddress={props.row.address} />
        </Box>
      )}
    </Box>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};
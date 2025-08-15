import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  useTheme,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { useAppSelector } from "../../../slices";
import { useTranslation } from "react-i18next";
import CustomTooltip from "../../../components/common/CustomTooltip";
import { DeFiPosition, UnderlyingToken } from "../../../models/wallet/walletPortfolio";

interface WalletDeFiOverviewProps {
  walletAddress: string;
}

const formatCurrency = (value: number | undefined) =>
  typeof value === "number"
    ? `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "-";

const networkMap: Record<string, string> = {
  "binance-smart-chain": "BNB Chain",
  ethereum: "Ethereum",
  arbitrum: "Arbitrum",
  polygon: "Polygon",
  optimism: "Optimism",
  base: "Base",
  gnosis: "Gnosis",
  blast: "Blast",
  fantom: "Fantom",
  zksync: "Zksync",
  avalanche: "Avalanche",
};

const positionTypeMap: Record<string, string> = {
  CLAIMABLE: "Staking",
  Pools: "Liquidity Pool",
  Vaults: "Vault",
  "Fluid Tokens": "Fluid Token",
  SUPPLIED: "Supplied",
  Sets: "Set",
};

const WalletDeFiOverview: React.FC<WalletDeFiOverviewProps> = ({ walletAddress }) => {
  const { t } = useTranslation("ColumnsDefs");
  const { portfolioWalletData } = useAppSelector((state) => state.wallets);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const theme = useTheme();

  if (!Array.isArray(portfolioWalletData)) return null;

  const wallet = portfolioWalletData.find((w) => w.walletAddress === walletAddress);
  if (!wallet?.deFiPositions) return null;

  const grouped = wallet.deFiPositions.reduce((acc, pos) => {
    if (!acc[pos.protocol]) acc[pos.protocol] = [];
    acc[pos.protocol].push(pos);
    return acc;
  }, {} as Record<string, DeFiPosition[]>);

  const toggleGroup = (protocol: string) => {
    setOpenGroups((prev) => ({ ...prev, [protocol]: !prev[protocol] }));
  };

  const isLPToken = (token: UnderlyingToken): boolean => {
  return token.nestedTokens?.length > 0 || /(LP|-)/i.test(token.symbol || "");
};

const collectAllTokenSymbols = (tokens: UnderlyingToken[]): string[] => {
  return tokens.flatMap((token) => {
    if (token.nestedTokens?.length > 0) {
      return collectAllTokenSymbols(token.nestedTokens);
    }
    return token.symbol ? [token.symbol] : [];
  });
};

const getPositionName = (position: DeFiPosition): { name: string; tokens: string } => {
  const allSymbols = Array.from(new Set(collectAllTokenSymbols(position.underlyingTokens)));
  const sortedSymbols = [...allSymbols].sort();

  if (position.metadata?.label || position.metadata?.groupLabel) {
    return {
      name: position.metadata.label || position.metadata.groupLabel,
      tokens: allSymbols.join(" / "),
    };
  }

  const lpToken = position.underlyingTokens.find(isLPToken);
  if (lpToken && sortedSymbols.length >= 2) {
    const lpPrefixMatch = lpToken.symbol?.match(/^([A-Z0-9]+LP)/);
    const lpPrefix = lpPrefixMatch ? lpPrefixMatch[1] : null;

    return {
      name: lpPrefix
        ? `${lpPrefix}-${sortedSymbols.join('+')}`
        : sortedSymbols.join('+'),
      tokens: sortedSymbols.join(" / "),
    };
  }

  if (allSymbols.length === 1) {
    return {
      name: allSymbols[0],
      tokens: allSymbols[0],
    };
  }

  return {
    name: position.protocol,
    tokens: sortedSymbols.join(" / "),
  };
};


  const calculateValues = (position: DeFiPosition) => {
    let supplied = 0;
    let claimable = 0;

    position.underlyingTokens.forEach((token, index) => {
      const tokenValue = token.balanceUSD || 0;
      
      if (isLPToken(token)) {
        supplied += tokenValue;
      } 
      else if (position.positionType === 'CLAIMABLE') {
        if (index === 0 && tokenValue > 1000) {
          supplied += tokenValue;
        } else {
          claimable += tokenValue;
        }
      } 
      else {
        const isSmallToken = tokenValue < 100;
        if (isSmallToken && position.underlyingTokens.length > 1) {
          claimable += tokenValue;
        } else {
          supplied += tokenValue;
        }
      }
    });

    return {
      supplied: supplied || position.valueUSD || 0,
      claimable
    };
  };

  return (
    <Box width="100%" maxWidth="100%" display="flex" flexDirection="column" gap={2} sx={{ overflow: "hidden" }}>

      {Object.entries(grouped).map(([protocol, positions]) => {
        const totalValue = positions.reduce((sum, p) => sum + (p.valueUSD || 0), 0);
        const readableNetwork = networkMap[positions[0]?.network] || positions[0]?.network || "-";
        const isOpen = openGroups[protocol] ?? true;

        return (
          <Paper
            key={protocol}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#363f4cff" : "transparent",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight={600}>{protocol}</Typography>
                <Chip
                  label={readableNetwork}
                  size="small"
                  sx={{
                    fontSize: 11,
                    mt: 0.5,
                    px: 0.5,
                    py: 0,
                    height: 20,
                    color: theme.palette.mode === "dark" ? "#CBD5E1" : "#64748B",
                    border: "1px solid #64748B",
                    backgroundColor: "transparent",
                    borderRadius: 1,
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" fontWeight={600} color="#e49a41">
                  {formatCurrency(totalValue)}
                </Typography>
                <CustomTooltip title={t("ToggleView", { ns: "Common" })} arrow>
                  <IconButton size="small" onClick={() => toggleGroup(protocol)} sx={{ color: "#fff" }}>
                    {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </CustomTooltip>
              </Box>
            </Box>

            <Collapse in={isOpen}>
              <Box
                px={2}
                py={2}
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? "#363f4cff" : "white",
                }}
              >
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "31%", fontWeight: 500 }}>
                          {t("Position", { ns: "Common" })}
                        </TableCell>
                        <TableCell sx={{ width: "15%", fontWeight: 500 }}>
                          {t("Type", { ns: "Common" })}
                        </TableCell>
                        <TableCell align="right" sx={{ width: "15%", fontWeight: 500 }}>
                          {t("Supplied", { ns: "WalletDeFiOverview" })}
                        </TableCell>
                        <TableCell align="right" sx={{ width: "15%", fontWeight: 500 }}>
                          {t("Claimable", { ns: "WalletDeFiOverview" })}
                        </TableCell>
                        <TableCell align="right" sx={{ width: "21%", fontWeight: 500 }}>
                          {t("TotalValue", { ns: "MyWalletsPage" })}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {positions.map((pos) => {
                        const { name, tokens } = getPositionName(pos);
                        const { supplied, claimable } = calculateValues(pos);

                        return (
                          <TableRow 
                            key={`${protocol}-${pos.positionType}-${name}`}
                            sx={{ borderBottom: "1px solid rgba(75,85,99,0.5)" }}
                          >
                            <TableCell sx={{ width: "33%" }}>
                              <Typography fontWeight={500}>{name}</Typography>
                              {tokens && (
                                <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ? "#CBD5E1" : "#616161" }}>
                                  {tokens}
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell sx={{ width: "15%" }}>
                              <Chip
                                label={positionTypeMap[pos.positionType] || pos.positionType}
                                size="small"
                                sx={{
                                  fontSize: 12,
                                  px: 1,
                                  height: 30,
                                  color: theme.palette.mode === "dark" ? "#CBD5E1" : "#2f19baff",
                                  border: "1px solid #64748B",
                                  backgroundColor: "rgba(79,70,229,0.2)",
                                  borderRadius: 1,
                                }}
                              />
                            </TableCell>

                            <TableCell align="right" sx={{ width: "15%" }}>
                              {formatCurrency(supplied)}
                            </TableCell>

                            <TableCell
                              align="right"
                              sx={{
                                width: "15%",
                                color: claimable > 0
                                  ? theme.palette.mode === "dark" ? "#72dd5f" : "#106201ff"
                                  : "inherit",
                              }}
                            >
                              {claimable > 0 ? formatCurrency(claimable) : "-"}
                            </TableCell>

                            <TableCell align="right" sx={{ width: "22%", fontWeight: 600 }}>
                              {formatCurrency(pos.valueUSD)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};

export default WalletDeFiOverview;
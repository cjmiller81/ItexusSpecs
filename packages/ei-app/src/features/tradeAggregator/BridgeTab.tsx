import React, { useEffect, useState } from "react";
import { fetchLifiChains, LifiChain } from "./lifiChains";
import { getLifiToken } from "./lifiApi";
import { Grid, Box, Button, Stack, Typography, useTheme } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { BridgeFromCard } from "./BridgeFromCard";
import { BridgeToCard } from "./BridgeToCard";
import { BridgeRoutesPanel } from "./BridgeRoutesPanel";
import { iconsApi } from "@/services/iconsService";

interface BridgeTabProps {
  t: any;
  symbolOptionSwap: any;
  tokenIcons: any;
  handleCurrentPositionDropdownChange: any;
  inputSearchSwap: string;
  setInputSearchSwap: (v: string) => void;
  formatNumberWithCommas: (v: string) => string;
  newBalance: string;
  setNewBalance: (v: string) => void;
  selectedChain: string;
  selectedTokenRow: any;
  setSelectedTokenRow: (v: any) => void;
  balanceRaw: number | undefined;
  setShowNoQuotesMessage: (v: React.SetStateAction<boolean>) => void;
  onOptionChangeSwap: (v: any) => void;
  tokenIconsSwapFor: any;
  symbolOptionSwapFor: any;
  onOptionChangeSwapFor: (v: any) => void;
  inputSearchSwapFor: string;
  setInputSearchSwapFor: (v: string) => void;
  handleFetchQuotes: () => void;
  quoteLoading: boolean;
  lastUpdated: string | null;
  setTokenIconsSwapFor: (v: any) => void;
  selectedBridgeToChainId: number | null;
  setSelectedBridgeToChainId: (v: number | null) => void;
  inputSearchBridgeToChain: string;
  setInputSearchBridgeToChain: (v: string) => void;
  onClearBridgeToTokenAddress: () => void;
  quoteData?: any[];
  errorMessage?: string | null;
  chains?: any[];
  bridgeFromTokenDecimals: number | null;
}

export const BridgeTab = ({
  t,
  symbolOptionSwap,
  tokenIcons,
  handleCurrentPositionDropdownChange,
  inputSearchSwap,
  setInputSearchSwap,
  formatNumberWithCommas,
  newBalance,
  setNewBalance,
  selectedChain,
  selectedTokenRow,
  setSelectedTokenRow,
  balanceRaw,
  setShowNoQuotesMessage,
  onOptionChangeSwap,
  tokenIconsSwapFor,
  symbolOptionSwapFor,
  onOptionChangeSwapFor,
  inputSearchSwapFor,
  setInputSearchSwapFor,
  handleFetchQuotes,
  quoteLoading,
  lastUpdated,
  setTokenIconsSwapFor,
  selectedBridgeToChainId,
  setSelectedBridgeToChainId,
  inputSearchBridgeToChain,
  setInputSearchBridgeToChain,
  onClearBridgeToTokenAddress,
  quoteData = [],
  errorMessage = null,
  chains = [],
}: BridgeTabProps) => {
    useEffect(() => {
      if (!symbolOptionSwapFor && typeof onClearBridgeToTokenAddress === 'function') {
        setBridgeToTokenAddress(null);
        onClearBridgeToTokenAddress();
      }
    }, [symbolOptionSwapFor, onClearBridgeToTokenAddress]);
  const [lifiChains, setLifiChains] = useState<LifiChain[]>([]);
  const [lifiChainsLoading, setLifiChainsLoading] = useState(false);
  const [lifiChainsError, setLifiChainsError] = useState(false);
  const [bridgeFromTokenAddress, setBridgeFromTokenAddress] = useState<string | null>(null);
  const [bridgeFromTokenDecimals, setBridgeFromTokenDecimals] = useState<number | null>(null);
  const [bridgeFromTokenPriceUSD, setBridgeFromTokenPriceUSD] = useState<string | null>(null);
  const [bridgeToTokenAddress, setBridgeToTokenAddress] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    let ignore = false;
    setLifiChainsLoading(true);
    fetchLifiChains()
      .then((chains) => {
        if (!ignore) {
          setLifiChains(chains);
          setLifiChainsError(false);
        }
      })
      .catch(() => {
        if (!ignore) setLifiChainsError(true);
      })
      .finally(() => {
        if (!ignore) setLifiChainsLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    const fetchLifiTokenInfo = async () => {
      // Only for Bridge tab, with selected position
      if (!selectedTokenRow) {
        setBridgeFromTokenAddress(null);
        setBridgeFromTokenDecimals(null);
        setBridgeFromTokenPriceUSD(null);
        return;
      }
      // Find chainId for LiFi (from lifiChains)
      const chainName = selectedTokenRow.chain?.toUpperCase();
      const lifiChain = lifiChains.find(
        (c: LifiChain) => c.name.toUpperCase() === chainName
      );
      if (!lifiChain) {
        setBridgeFromTokenAddress(null);
        setBridgeFromTokenDecimals(null);
        setBridgeFromTokenPriceUSD(null);
        return;
      }
      const chainId = lifiChain.id;
      const tokenAddress = selectedTokenRow.tokenAddress;
      if (!tokenAddress) {
        setBridgeFromTokenAddress(null);
        setBridgeFromTokenDecimals(null);
        setBridgeFromTokenPriceUSD(null);
        return;
      }
      try {
        const token = await getLifiToken(chainId, tokenAddress);
        setBridgeFromTokenAddress(token.address);
        setBridgeFromTokenDecimals(token.decimals);
        setBridgeFromTokenPriceUSD(token.priceUSD || null);
      } catch (e) {
        setBridgeFromTokenAddress(null);
        setBridgeFromTokenDecimals(null);
        setBridgeFromTokenPriceUSD(null);
      }
    };
    fetchLifiTokenInfo();
  }, [selectedTokenRow, lifiChains]);

  useEffect(() => {
    if (!symbolOptionSwapFor || !selectedBridgeToChainId) {
      return;
    }
    let ignore = false;
    const fetchLifiTokenInfo = async () => {
      try {
        const token = await getLifiToken(selectedBridgeToChainId, symbolOptionSwapFor.address?.[0] || symbolOptionSwapFor.id);
        if (!ignore) {
          setBridgeToTokenAddress(token.address);
        }
      } catch (e) {
        // Do not clear here, only clear on chain/token clear
      }
    };
    fetchLifiTokenInfo();
    return () => { ignore = true; };
  }, [symbolOptionSwapFor, selectedBridgeToChainId]);

  useEffect(() => {
    if (!selectedBridgeToChainId) return;

    const timeoutId = setTimeout(() => {
      const fetchIconsForBridgeFor = async () => {
        const chainId = selectedBridgeToChainId;
        if (!chainId) return;
        try {
          const result = await iconsApi.getIcons(
            inputSearchSwapFor,
            0,
            chainId,
            500
          );
          if (typeof setTokenIconsSwapFor === 'function') setTokenIconsSwapFor(result);
        } catch (error) {
          console.error('Error loading icons for bridge for:', error);
        }
      };
      fetchIconsForBridgeFor();
    }, 450);
    return () => clearTimeout(timeoutId);
  }, [selectedBridgeToChainId, inputSearchSwapFor]);

  // Handler to clear all bridge trade fields
  const handleClearBridgeTrade = () => {
    // Clear all relevant fields to default state
    if (typeof setSelectedTokenRow === 'function') setSelectedTokenRow(null);
    if (typeof setNewBalance === 'function') setNewBalance("");
    if (typeof setInputSearchSwap === 'function') setInputSearchSwap("");
    if (typeof onOptionChangeSwap === 'function') onOptionChangeSwap(null);
    if (typeof onOptionChangeSwapFor === 'function') onOptionChangeSwapFor(null);
    if (typeof setInputSearchSwapFor === 'function') setInputSearchSwapFor("");
    if (typeof setSelectedBridgeToChainId === 'function') setSelectedBridgeToChainId(null);
    if (typeof setInputSearchBridgeToChain === 'function') setInputSearchBridgeToChain("");
    if (typeof setShowNoQuotesMessage === 'function') setShowNoQuotesMessage(false);
    // Optionally clear other bridge-related state if needed
  };

  return (
    <Grid container spacing={2}>
      {/* Top row: From | Arrow | To */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ flex: 5 }}>
            <BridgeFromCard
              symbolOptionSwap={symbolOptionSwap}
              tokenIcons={tokenIcons}
              handleCurrentPositionDropdownChange={handleCurrentPositionDropdownChange}
              inputSearchSwap={inputSearchSwap}
              setInputSearchSwap={setInputSearchSwap}
              bridgeFromTokenAddress={bridgeFromTokenAddress}
              formatNumberWithCommas={formatNumberWithCommas}
              newBalance={newBalance}
              setNewBalance={setNewBalance}
              selectedChain={selectedChain}
              selectedTokenRow={selectedTokenRow}
              lifiChains={lifiChains}
              balanceRaw={balanceRaw}
              setShowNoQuotesMessage={setShowNoQuotesMessage}
              onOptionChangeSwap={onOptionChangeSwap}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
            <EastIcon sx={{ fontSize: 38, color: '#219a83', background: '#fff', borderRadius: '50%', boxShadow: 2, p: 1 }} />
          </Box>
          <Box sx={{ flex: 5 }}>
            <BridgeToCard
              t={t}
              theme={theme}
              symbolOptionSwap={symbolOptionSwap}
              tokenIconsSwapFor={tokenIconsSwapFor}
              symbolOptionSwapFor={symbolOptionSwapFor}
              onOptionChangeSwapFor={onOptionChangeSwapFor}
              inputSearchSwapFor={inputSearchSwapFor}
              setInputSearchSwapFor={setInputSearchSwapFor}
              selectedBridgeToChainId={selectedBridgeToChainId}
              setSelectedBridgeToChainId={setSelectedBridgeToChainId}
              inputSearchBridgeToChain={inputSearchBridgeToChain}
              setInputSearchBridgeToChain={setInputSearchBridgeToChain}
              lifiChains={lifiChains}
              lifiChainsLoading={lifiChainsLoading}
              lifiChainsError={lifiChainsError}
              bridgeToTokenAddress={bridgeToTokenAddress}
              bridgeFromChainId={(() => {
                // Try to get the chain id of the selected Bridge From chain
                if (selectedTokenRow && selectedTokenRow.chain) {
                  const chainName = selectedTokenRow.chain.toUpperCase();
                  const lifiChain = lifiChains.find((c) => c.name.toUpperCase() === chainName);
                  return lifiChain ? lifiChain.id : null;
                }
                return null;
              })()}
            />
          </Box>
        </Box>
      </Grid>
      {/* New card: Get Quotes, Clear Bridge, timestamp, disclaimers */}
      <Grid item xs={12}>
        <Box sx={{
          borderRadius: '12px',
          border: '1.5px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : '#e4e8f5',
          background: theme.palette.mode === 'dark' ? 'rgba(36,36,40,0.95)' : '#fff',
          boxShadow: 3,
          p: 3,
          mt: 0,
          mb: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          {/* Top row: buttons + last updated */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, mb: 1 }}>
            <Button
              id="get_quotes_btn"
              variant="contained"
              onClick={handleFetchQuotes}
              disabled={!selectedTokenRow || !symbolOptionSwapFor || !newBalance || !selectedChain || !symbolOptionSwap}
              sx={{
                backgroundColor: "#219a83",
                color: "#fff",
                textTransform: "none",
                ml: 2,
                fontWeight: 500,
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#219a83",
                },
              }}
              startIcon={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    animation: quoteLoading ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  <RefreshIcon />
                </Box>
              }
            >
              {t("GetQuotes")}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearBridgeTrade}
              sx={(theme) => ({
                ml: 2,
                height: 34,
                fontWeight: 500,
                fontSize: "0.875rem",
                letterSpacing: 1,
                color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                borderColor: '#e0e0e0,0.4',
                '&:hover': {
                  borderColor: theme.palette.mode === 'dark' ? '#fff' : '#222',
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(34,34,34,0.08)',
                },
                // Disabled state
                '&.Mui-disabled': {
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(34,34,34,0.5)',
                  borderColor: '#e0e0e0',
                },
              })}
            >
                Clear Bridge
            </Button>
            {/* Last updated block */}
            {lastUpdated && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flex: 1, minWidth: 0 }}>
                <AccessTimeIcon sx={{ color: '#00e5a0', fontSize: '1rem', mr: 0.5 }} />
                <Typography sx={{ color: '#00e5a0', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t('LastUpdated')}: {lastUpdated}
                </Typography>
              </Box>
            )}
          </Box>
          {/* Disclaimers row */}
          {lastUpdated && (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', gap: 3, background: 'none', p: 0, mt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoOutlinedIcon sx={{ color: '#fbc02d', fontSize: '1rem', mt: '2px' }} />
                <Typography sx={{ color: '#fbc02d', fontSize: '0.75rem' }}>
                  Prices are estimates and fluctuate based on network conditions.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberRoundedIcon sx={{ color: '#fbc02d', fontSize: '1rem', mt: '2px' }} />
                <Typography sx={{ color: '#fbc02d', fontSize: '0.75rem' }}>
                  Gas fees are estimates only. Final costs determined at execution time.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionOutlinedIcon sx={{ color: '#fbc02d', fontSize: '1rem', mt: '2px' }} />
                <Typography sx={{ color: '#fbc02d', fontSize: '0.75rem' }}>
                  Bridge protocols may apply additional fees. Review all parameters before proceeding.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
      {/* BRIDGE ROUTES CARD */}
      <Grid item xs={12}>
        <Box sx={{ borderRadius: '10px', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : '#e4e8f5', p: 2 }}>
          <BridgeRoutesPanel
            routes={quoteData}
            chains={chains.length ? chains : lifiChains}
            loading={quoteLoading}
            error={quoteData && quoteData.length === 0 ? null : errorMessage}
            lastUpdated={lastUpdated}
            hasRequested={!!lastUpdated || !!quoteLoading}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
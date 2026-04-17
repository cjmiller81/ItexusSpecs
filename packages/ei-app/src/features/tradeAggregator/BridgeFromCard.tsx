import React, { useState } from "react";
import { Box, Typography, Autocomplete, TextField, InputAdornment, Avatar, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { TokenSearchItem } from "@/models/Wallet/TokenSearchItem";
import { useTheme } from "@mui/material/styles";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { useTranslation } from "react-i18next";
import { CHAIN_COLORS, CHAIN_MAP } from "./bridgeChains";
import { LifiChain } from "@/common/lifiChainContext";
import SearchIcon from '@mui/icons-material/Search';

interface BridgeFromCardProps {
  symbolOptionSwap: TokenSearchItem | null;
  tokenIcons: { items: TokenSearchItem[] } | null;
  handleCurrentPositionDropdownChange: (event: any, value: TokenSearchItem | null) => void;
  inputSearchSwap: string;
  setInputSearchSwap: (val: string) => void;
  formatNumberWithCommas: (val: string) => string;
  newBalance: string;
  setNewBalance: (val: string) => void;
  selectedTokenRow: any; // enriched token object
  setSelectedTokenRow?: (row: any) => void;
  balanceRaw: number | undefined;
  setShowNoQuotesMessage: (value: React.SetStateAction<boolean>) => void;
  onOptionChangeSwap: (value: TokenSearchItem  | null) => void;
}

export const BridgeFromCard: React.FC<BridgeFromCardProps> = ({
  symbolOptionSwap,
  tokenIcons,
  handleCurrentPositionDropdownChange,
  inputSearchSwap,
  setInputSearchSwap,
  formatNumberWithCommas,
  newBalance,
  setNewBalance,
  selectedTokenRow,
  setSelectedTokenRow,
  balanceRaw,
  setShowNoQuotesMessage,
  onOptionChangeSwap
}) => {
  const theme = useTheme();
  const { t } = useTranslation("NewPositionSection");
  const maxBalance = balanceRaw !== undefined && balanceRaw !== null
    ? balanceRaw.toFixed(5)
    : "0.0000";

  // --- NEW: Bridge From State (enriched token) ---
  const bridgeFromState = selectedTokenRow && typeof selectedTokenRow === 'object' ? {
    fromChainId: selectedTokenRow.chainId,
    fromTokenAddress: selectedTokenRow.tokenAddress,
    fromAmount: selectedTokenRow.balanceRaw ?? selectedTokenRow.balanceRawString ?? selectedTokenRow.balanceRaw,
    fromTokenSymbol: selectedTokenRow.tokenName,
    fromTokenUrl: selectedTokenRow.logoUrl,
    fromTokenDecimals: selectedTokenRow.decimals,
    fromChainLogoURI: selectedTokenRow.lifiChain?.logoURI ?? null,
    fromChainName: selectedTokenRow.lifiChain?.name ?? (selectedTokenRow.network?.name || selectedTokenRow.chain || ""),
    fromChainKey: selectedTokenRow.lifiChain?.coin
  } : null;

    return (
    <Box sx={{ borderRadius: '10px', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : '#e4e8f5', p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: symbolOptionSwap ? '#219a83' : 'transparent',
              border: symbolOptionSwap ? 'none' : '2px solid #219a83',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
            }}
          >
            {symbolOptionSwap ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="9" fill="#219a83" />
                <path d="M5.5 9.5L8 12L12.5 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <Typography sx={{ color: '#219a83', fontWeight: 700, fontSize: '1rem' }}>1</Typography>
            )}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", letterSpacing: '0.06em', textTransform: 'none' }}>{t('Bridge From')}</Typography>
        </Box>
        {/* Chain badge above Current Position, right aligned */}
        {bridgeFromState && (() => {
          const colorMeta = CHAIN_COLORS[bridgeFromState.fromChainKey?.toUpperCase?.()] ? CHAIN_COLORS[bridgeFromState.fromChainKey?.toUpperCase?.()] : CHAIN_COLORS['ARB'];
          return (
          <Box className="chain-badge" sx={{ background: colorMeta.bg, border: colorMeta.border, color: colorMeta.color, borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '7px', mb: 0.5 }}>
            {bridgeFromState.fromChainLogoURI && (
              <Avatar src={bridgeFromState.fromChainLogoURI} alt={bridgeFromState.fromChainName} sx={{ width: 18, height: 18, mr: 0.5 }} />
            )}
            {bridgeFromState.fromChainName}
          </Box>
        );
        })()}
      </Box>
      {/* Current Position and Qty in one row */}
      <Box display="flex" gap={2} mb={1.5} alignItems="flex-end">
        <Box flex={7}>
          <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Current Position')}</Typography>
          <Autocomplete
            options={tokenIcons?.items ?? []}
            getOptionLabel={(option) => option.sym}
            value={symbolOptionSwap}
            onChange={(event, value) => {
              handleCurrentPositionDropdownChange(event, value);
              if (setSelectedTokenRow && value && 'walletBalance' in value) {
                setSelectedTokenRow(value.walletBalance as WalletBalance);
              } else if (setSelectedTokenRow && value == null) {
                setSelectedTokenRow(null);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            disableClearable={false}
            inputValue={symbolOptionSwap ? symbolOptionSwap.name ? `${symbolOptionSwap.sym.toUpperCase()} - ${symbolOptionSwap.name}` : symbolOptionSwap.sym.toUpperCase() : inputSearchSwap}
            onInputChange={(_event, newInputValue, reason) => {
              if (reason === 'clear') {
                onOptionChangeSwap(null);
              }
              setInputSearchSwap(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('Search')}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {symbolOptionSwap ? (
                        <InputAdornment position="start">
                          <Avatar
                            src={bridgeFromState?.fromTokenUrl || symbolOptionSwap.lURI}
                            alt={symbolOptionSwap.sym}
                            sx={{ width: 20, height: 20, mr: 0 }}
                          />
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )}
                    </>
                  ),
                  sx: {
                    input: {
                      textTransform: symbolOptionSwap ? 'uppercase' : 'none',
                    },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={option.lURI ?? undefined}
                  alt={option.sym}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography variant="body1">
                  {option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
                </Typography>
              </Box>
            )}
          />
        </Box>
        <Box flex={5} display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Qty')}</Typography>
          <TextField
            id="bridge_quantity_input"
            variant="outlined"
            size="small"
            value={formatNumberWithCommas(newBalance)}
            onChange={(e) => {
              const input = e.target.value.replace(/,/g, "");
              const validInput = /^(\d+)?(\.\d*)?$/.test(input);
              const numericValue = parseFloat(input);
              const max = Number(maxBalance);
              if (validInput) {
                const [, decimalPart = ""] = input.split(".");
                if (decimalPart.length <= 5) {
                  if (!isNaN(numericValue)) {
                    setShowNoQuotesMessage(false);
                    setNewBalance(input);
                  }
                  if (input === "" || input === "." || input.endsWith(".")) {
                    setShowNoQuotesMessage(false);
                    setNewBalance(input);
                  }
                }
              }
            }}
            type="text"
            fullWidth
            inputProps={{
              inputMode: 'decimal',
              min: 0,
              style: { MozAppearance: 'textfield' },
            }}
            sx={{
              marginBottom: 0,
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]': { MozAppearance: 'textfield' },
              '& .MuiInputBase-root': { height: '52.7px' },
              '& .MuiInputLabel-root': { marginTop: '8px' },
            }}
          />
        </Box>
      </Box>
                  {/* BRIDGE FROM: Token Address + Copy */}
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7680a0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      {bridgeFromState?.fromTokenAddress ? `${bridgeFromState.fromTokenAddress.slice(0, 25)}...` : t('TokensAddress')}
                    </Typography>
                    {bridgeFromState?.fromTokenAddress && (
                      <Tooltip title={t('Copy')}>
                        <IconButton size="small" onClick={() => { navigator.clipboard.writeText(bridgeFromState.fromTokenAddress); }}>
                          <ContentCopyIcon fontSize="small" sx={{ color: '#7680a0' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
  );
};

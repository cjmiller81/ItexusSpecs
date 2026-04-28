
import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Autocomplete, TextField, InputAdornment, Tooltip, IconButton, CircularProgress } from "@mui/material";
import { VirtualizedListbox } from "../VirtualizedListbox";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import { CHAIN_COLORS } from "./../bridgeChains";
// import { getLifiToken } from "../lifiApi";

interface NewSwapToCardProps {
  t: any;
  theme: any;
  symbolOptionSwap: any;
  tokenIconsSwapFor: any;
  symbolOptionSwapFor: any;
  onOptionChangeSwapFor: (value: any) => void;
  inputSearchSwapFor: string;
  setInputSearchSwapFor: (v: string) => void;
  swapToTokenAddress: string | null;
  // New: always use the chain from Swap From
  selectedChain: string;
  lifiChains: any[];
  displayChainName?: string;
}

export const NewSwapToCard: React.FC<NewSwapToCardProps> = ({
  t,
  theme,
  symbolOptionSwap,
  tokenIconsSwapFor,
  symbolOptionSwapFor,
  onOptionChangeSwapFor,
  inputSearchSwapFor,
  setInputSearchSwapFor,
  swapToTokenAddress: swapToTokenAddressProp,
  selectedChain,
  displayChainName,
  lifiChains,
}) => {

  const tokenAddress = symbolOptionSwapFor
    ? Array.isArray(symbolOptionSwapFor.address)
      ? symbolOptionSwapFor.address[0]
      : symbolOptionSwapFor.address
    : null;

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      {/* Info Banner absolutely positioned above the card, always visible and not dimmed */}
      {!symbolOptionSwap && (
        <Box
          sx={{
            position: 'absolute',
            top: 146,
            left: 18,
            width: '92%',
            zIndex: 2,
            background: '#219a83',
            color: '#fff',
            borderRadius: '4px',
            py: 1.2,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 300,
            textAlign: 'center',
            boxShadow: 3,
          }}
        >
          Select <span style={{ fontWeight: 700, margin: '0 4px' }}>Current Position</span> in Step 1 to unlock
        </Box>
      )}
      <Box sx={{ position: 'relative', borderRadius: '10px', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : 'rgba(48,54,74,0.5)', p: 2, mb: 2, opacity: !symbolOptionSwap ? 0.6 : 1, pointerEvents: !symbolOptionSwap ? 'none' : 'auto', background: !symbolOptionSwap ? 'rgba(54,54,64,0.15)' : undefined }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: symbolOptionSwap ? '#219a83' : 'transparent',
                border: symbolOptionSwap ? 'none' : '2px solid',
                borderColor: !symbolOptionSwap ? 'rgba(81,81,81,1)' : '#219a83',
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
                <Typography sx={{ color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : '#219a83', fontWeight: 700, fontSize: '1rem' }}>2</Typography>
              )}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : (theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray"), letterSpacing: '0.06em', textTransform: 'none' }}>Swap To</Typography>
          </Box>
          {/* Chain badge for Swap To: always use the same chain as Swap From */}
          {symbolOptionSwap && selectedChain && (() => {
            const lifiChain = lifiChains.find(
              (c) => c.name?.toUpperCase() === displayChainName?.toUpperCase() || c.key?.toUpperCase() === selectedChain.toUpperCase()
            );
            const colorMeta = lifiChain && CHAIN_COLORS[lifiChain.key?.toUpperCase?.()] ? CHAIN_COLORS[lifiChain.key?.toUpperCase?.()] : CHAIN_COLORS['ARB'];
            return (
              <Box className="chain-badge" sx={{ background: colorMeta.bg, border: colorMeta.border, color: colorMeta.color, borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '7px', mb: 0.5 }}>
                {lifiChain?.logoURI && (
                  <Avatar src={lifiChain.logoURI} alt={displayChainName || selectedChain} sx={{ width: 18, height: 18, mr: 0.5 }} />
                )}
                {displayChainName || selectedChain}
              </Box>
            );
          })()}
        </Box>
        {/* Only Swap For in one row */}
        <Box mb={1.5} display="flex" gap={2} alignItems="flex-end">
          <Box flex={12}>
            <Typography variant="caption" sx={{ color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : (theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray"), fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>Swap For</Typography>
            <Autocomplete
              id="swap_to_token_dropdown"
              options={tokenIconsSwapFor?.items ?? []}
              getOptionLabel={(option) => option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
              value={symbolOptionSwapFor}
              onChange={(_e, newValue) => {
                if (!symbolOptionSwap) return; // locked
                onOptionChangeSwapFor(newValue);
                if (newValue) {
                  setInputSearchSwapFor(newValue.name ? `${newValue.sym.toUpperCase()} - ${newValue.name}` : newValue.sym.toUpperCase());
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              disableClearable={false}
              inputValue={symbolOptionSwapFor ? symbolOptionSwapFor.name ? `${symbolOptionSwapFor.sym.toUpperCase()} - ${symbolOptionSwapFor.name}` : symbolOptionSwapFor.sym.toUpperCase() : inputSearchSwapFor}
              onInputChange={(_event, newInputValue, reason) => {
                if (!symbolOptionSwap) return; // locked
                if (reason === 'input') {
                  onOptionChangeSwapFor(null);
                  setInputSearchSwapFor(newInputValue);
                } else if (reason === 'clear') {
                  onOptionChangeSwapFor(null);
                  setInputSearchSwapFor('');
                }
              }}
              loading={!tokenIconsSwapFor}
              loadingText={<CircularProgress size={18} />}
              noOptionsText={tokenIconsSwapFor ? 'No options on this chain' : ''}
              disabled={!symbolOptionSwap}
              renderInput={(params) => {
                // If locked, override adornments and placeholder
                if (!symbolOptionSwap) {
                  return (
                    <TextField
                      {...params}
                      placeholder={'Locked'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <LockIcon sx={{ color: 'rgba(81,81,81,1)' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          input: {
                            color: 'rgba(81,81,81,1)',
                          },
                        },
                      }}
                    />
                  );
                }
                let startAdornment = params.InputProps.startAdornment;
                if (symbolOptionSwapFor?.lURI) {
                  startAdornment = (
                    <InputAdornment position="start">
                      <Avatar
                        src={symbolOptionSwapFor.lURI}
                        alt={symbolOptionSwapFor.sym}
                        sx={{ width: 20, height: 20, mr: 0 }}
                      />
                    </InputAdornment>
                  );
                }
                return (
                  <TextField
                    {...params}
                    placeholder={'Search'}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment,
                    }}
                  />
                );
              }}
              ListboxComponent={VirtualizedListbox}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={option.lURI ?? undefined}
                    alt={option.sym}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body1">
                    {option.name
                      ? `${option.sym.toUpperCase()} - ${option.name}`
                      : option.sym.toUpperCase()}
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Box>
        {/* SWAP TO: Token Address + Copy */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          {!symbolOptionSwap ? (
            <Box sx={{ height: '60px' }}></Box>
          ) : (
            <>
              <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7680a0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                {tokenAddress ? `${tokenAddress.slice(0, 25)}...` : 'Token Address'}
              </Typography>
              {tokenAddress && (
                <Tooltip title={'Copy'}>
                  <IconButton size="small" onClick={() => { navigator.clipboard.writeText(tokenAddress); }}>
                    <ContentCopyIcon fontSize="small" sx={{ color: '#7680a0' }} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

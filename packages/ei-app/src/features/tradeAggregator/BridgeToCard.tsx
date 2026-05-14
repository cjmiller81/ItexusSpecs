import React from "react";
import { Box, Typography, Avatar, Grid, Autocomplete, TextField, InputAdornment, Tooltip, IconButton, CircularProgress } from "@mui/material";
import { VirtualizedListbox } from "./VirtualizedListbox";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import { CHAIN_COLORS } from "./bridgeChains";

interface BridgeToCardProps {
  t: any;
  theme: any;
  symbolOptionSwap: any;
  tokenIconsSwapFor: any;
  symbolOptionSwapFor: any;
  onOptionChangeSwapFor: (value: any) => void;
  inputSearchSwapFor: string;
  setInputSearchSwapFor: (v: string) => void;
  selectedBridgeToChainId: number | null;
  setSelectedBridgeToChainId: (v: number | null) => void;
  inputSearchBridgeToChain: string;
  setInputSearchBridgeToChain: (v: string) => void;
  lifiChains: any[];
  lifiChainsLoading: boolean;
  lifiChainsError: boolean;
  bridgeToTokenAddress: string | null;
  bridgeFromChainId?: number | null; // new prop
  displayChainName?: string;
}

export const BridgeToCard: React.FC<BridgeToCardProps> = ({
  t,
  theme,
  symbolOptionSwap,
  tokenIconsSwapFor,
  symbolOptionSwapFor,
  onOptionChangeSwapFor,
  inputSearchSwapFor,
  setInputSearchSwapFor,
  selectedBridgeToChainId,
  setSelectedBridgeToChainId,
  inputSearchBridgeToChain,
  setInputSearchBridgeToChain,
  lifiChains,
  lifiChainsLoading,
  lifiChainsError,
  bridgeToTokenAddress,
  bridgeFromChainId,
  displayChainName
}) => {

  const filteredChains = lifiChains.filter(chain => {
    // Exclude the Bridge From chain by id if provided
    if (bridgeFromChainId != null) {
      if (chain.id === bridgeFromChainId) return false;
    }

    if (!symbolOptionSwap || !symbolOptionSwap.chain) return true;

    return chain.name.toLowerCase() !== symbolOptionSwap.chain.toLowerCase();
  });

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
                backgroundColor: symbolOptionSwap && selectedBridgeToChainId ? '#219a83' : 'transparent',
                border: symbolOptionSwap && selectedBridgeToChainId ? 'none' : '2px solid',
                borderColor: !symbolOptionSwap ? 'rgba(81,81,81,1)' : '#219a83',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              {symbolOptionSwap && selectedBridgeToChainId ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="9" fill="#219a83" />
                  <path d="M5.5 9.5L8 12L12.5 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <Typography sx={{ color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : '#219a83', fontWeight: 700, fontSize: '1rem' }}>2</Typography>
              )}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : (theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray"), letterSpacing: '0.06em', textTransform: 'none' }}>{t('Bridge To')}</Typography>
          </Box>
          {/* Dynamic chain badge for Bridge To (with icon) - only show if selectedBridgeToChainId is set */}
          {selectedBridgeToChainId != null && (() => {
            const chain = lifiChains.find((c: any) => c.id === selectedBridgeToChainId);
            if (!chain) return null;
            const colorMeta = CHAIN_COLORS[chain.key?.toUpperCase?.()] || CHAIN_COLORS['ARB'];
            return (
              <Box className={`chain-${chain.key}`}
                sx={{
                  borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '7px',
                  background: colorMeta.bg,
                  border: colorMeta.border,
                  color: colorMeta.color,
                  mb: 0.5,
                }}>
                {chain.logoURI && (
                  <Avatar src={chain.logoURI} alt={chain.name} sx={{ width: 18, height: 18, mr: 0.5 }} />
                )}
                {chain.name}
              </Box>
            );
          })()}
        </Box>
        {/* Chain and Bridge For in one row */}
        <Box mb={1.5} display="flex" gap={2} alignItems="flex-end">
          <Box flex={6} display="flex" flexDirection="column">
            <Typography variant="caption" sx={{ color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : (theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray"), fontWeight: 600, textTransform: 'none', fontSize: '0.85rem'}}>{t('Chain')}</Typography>
            <Autocomplete
              id="bridge_to_chain_dropdown"
              options={filteredChains}
              getOptionLabel={(option) => option.name}
              value={filteredChains.find((chain: any) => chain.id === selectedBridgeToChainId) || null}
              onChange={(_e, newValue) => {
                setSelectedBridgeToChainId(newValue ? newValue.id : null);
                setInputSearchBridgeToChain(newValue ? newValue.name : "");
              }}
              isOptionEqualToValue={(option, value) => 
                option.id === value?.id || 
                (!!option.address?.[0] && !!value?.address?.[0] && option.address[0].toLowerCase() === value.address[0].toLowerCase())
              }
              disableClearable={false}
              inputValue={inputSearchBridgeToChain}
              onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                  setInputSearchBridgeToChain(newInputValue);
                } else if (reason === 'clear') {
                  setInputSearchBridgeToChain("");
                }
              }}
              loading={lifiChainsLoading}
              loadingText={<CircularProgress size={18} />}
              noOptionsText={lifiChainsError ? t('NoOptionsOnThisChain') : t('Search Chain')}
              disabled={!symbolOptionSwap}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('Search Chain')}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: selectedBridgeToChainId ? (
                      (() => {
                        const chain = filteredChains.find((c: any) => c.id === selectedBridgeToChainId);
                        return chain && chain.logoURI ? (
                          <InputAdornment position="start">
                            <Avatar src={chain.logoURI} alt={chain.name} sx={{ width: 20, height: 20, mr: 0 }} />
                          </InputAdornment>
                        ) : null;
                      })()
                    ) : (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props as any;
                return (
                  <Box key={key} component="li" {...optionProps} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.logoURI && (
                      <Avatar src={option.logoURI} alt={option.name} sx={{ width: 20, height: 20, mr: 1 }} />
                    )}
                    <Typography variant="body1">{option.name}</Typography>
                  </Box>
                );
              }}
              filterOptions={(options, state) => {
                const selectedChainObj = filteredChains.find((chain: any) => chain.id === selectedBridgeToChainId);
                if (state.inputValue === (selectedChainObj ? selectedChainObj.name : "")) {
                  return options;
                }
                return options.filter(o => 
                  o.name.toLowerCase().includes(state.inputValue.toLowerCase())
                );
              }}
              onFocus={(e) => {
                 const input = e.target as HTMLInputElement;
                 if (input.select) input.select();
              }}
            />
          </Box>
          <Box flex={6}>
            <Typography variant="caption" sx={{ color: !symbolOptionSwap ? 'rgba(81,81,81,1)' : (theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray"), fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Bridge For')}</Typography>
            <Autocomplete
              id="bridge_to_token_dropdown"
              options={tokenIconsSwapFor?.items ?? []}
              getOptionLabel={(option) => option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
              value={symbolOptionSwapFor}
              onChange={(_e, newValue) => {
                if (!symbolOptionSwap || !selectedBridgeToChainId) return; // locked
                onOptionChangeSwapFor(newValue);
                if (newValue) {
                  setInputSearchSwapFor(newValue.name ? `${newValue.sym.toUpperCase()} - ${newValue.name}` : newValue.sym.toUpperCase());
                }
              }}
              isOptionEqualToValue={(option, value) => 
                option.id === value?.id || 
                (!!option.address?.[0] && !!value?.address?.[0] && option.address[0].toLowerCase() === value.address[0].toLowerCase())
              }
              disableClearable={false}
              onInputChange={(_event, newInputValue, reason) => {
                if (!symbolOptionSwap || !selectedBridgeToChainId) return; // locked
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
              noOptionsText={tokenIconsSwapFor ? t('NoOptionsOnThisChain') : ''}
              disabled={!symbolOptionSwap || !selectedBridgeToChainId}
              renderInput={(params) => {
                // If locked, override adornments and placeholder
                if (!symbolOptionSwap || !selectedBridgeToChainId) {
                  return (
                    <TextField
                      {...params}
                      placeholder={t('Locked')}
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
                    placeholder={t('Search')}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment,
                    }}
                  />
                );
              }}
              ListboxComponent={VirtualizedListbox}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props as any;
                return (
                  <Box key={key} component="li" {...optionProps} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                );
              }}
              filterOptions={(options, state) => {
                const search = state.inputValue.toLowerCase().trim();
                const currentLabel = symbolOptionSwapFor 
                  ? (symbolOptionSwapFor.name 
                      ? `${symbolOptionSwapFor.sym.toUpperCase()} - ${symbolOptionSwapFor.name}` 
                      : symbolOptionSwapFor.sym.toUpperCase()).toLowerCase().trim()
                  : "";

                if (!search || search === currentLabel) {
                  return options;
                }

                return options.filter(o => 
                  o.sym.toLowerCase().includes(search) || 
                  (o.name && o.name.toLowerCase().includes(search))
                );
              }}
              onFocus={(e) => {
                 const input = e.target as HTMLInputElement;
                 if (input.select) input.select();
              }}
            />
          </Box>
        </Box>
        {/* BRIDGE TO: Token Address + Copy */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          {!symbolOptionSwap ? (<Box sx={{ height: '60px' }}></Box>
            ) : symbolOptionSwap && !selectedBridgeToChainId ? (
              <Box
                sx={{
                  width: '100%',
                  background: '#219a83',
                  color: '#fff',
                  borderRadius: '4px',
                  px: 2,
                  py: 1.2,
                  mb: 2,
                  fontWeight: 300,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 6px 0 rgba(33,154,131,0.08)',
                }}
              >
                <span>
                  Select <b>Chain</b> to unlock <b>Bridge For</b> token selection
                </span>
              </Box>
            ) : (
            <>
              <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7680a0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                {bridgeToTokenAddress ? `${bridgeToTokenAddress.slice(0, 25)}...` : t('SwapForPositionAddress')}
              </Typography>
              {bridgeToTokenAddress && (
                <Tooltip title={t('Copy')}>
                  <IconButton size="small" onClick={() => { navigator.clipboard.writeText(bridgeToTokenAddress); }}>
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
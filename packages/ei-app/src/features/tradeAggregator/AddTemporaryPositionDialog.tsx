import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Autocomplete,
  TextField,
  InputAdornment,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SearchIcon from "@mui/icons-material/Search";
import { LifiChain } from "@/common/lifiChainContext";
import { TokenSearchItem } from "@/models/Wallet/TokenSearchItem";
import { getLifiTokens } from "./lifiApi";
import { VirtualizedListbox } from "./VirtualizedListbox";

interface AddTemporaryPositionDialogProps {
  open: boolean;
  onClose: () => void;
  lifiChains: LifiChain[];
  lifiChainsLoading: boolean;
  lifiChainsError: boolean;
  onAdd: (chain: LifiChain, token: TokenSearchItem, qty: string) => void;
  addPositionError: string;
  setAddPositionError: (err: string) => void;
  t: (key: string) => string;
}

export const AddTemporaryPositionDialog: React.FC<AddTemporaryPositionDialogProps> = ({
  open,
  onClose,
  lifiChains,
  lifiChainsLoading,
  lifiChainsError,
  onAdd,
  addPositionError,
  setAddPositionError,
  t,
}) => {
  const [selectedChain, setSelectedChain] = useState<LifiChain | null>(null);
  const [symbolOptionSwapFor, setSymbolOptionSwapFor] = useState<TokenSearchItem | null>(null);
  const [inputSearchBridgeToChain, setInputSearchBridgeToChain] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [tokenIcons, setTokenIcons] = useState<{ items: TokenSearchItem[] } | null>(null);
  const tokensCache = useRef<{ [chainId: number]: any[] }>({});

  useEffect(() => {
    if (selectedChain) {
      setInputSearchBridgeToChain(selectedChain.name);
    } else {
      setInputSearchBridgeToChain("");
    }
  }, [selectedChain]);

  useEffect(() => {
    if (!selectedChain) {
      setTokenIcons(null);
      return;
    }
    let chainId: number | undefined = selectedChain.id;
    if (!chainId) return;
    const fetchAndCacheTokens = async () => {
      if (!tokensCache.current[chainId!]) {
        try {
          const tokens = await getLifiTokens(chainId!);
          tokensCache.current[chainId!] = tokens;
        } catch (err) {
          tokensCache.current[chainId!] = [];
        }
      }
      const tokens = tokensCache.current[chainId!] || [];
      const search = inputSearch.trim().toLowerCase();
      const filtered = tokens.filter(token => {
        if (!search) return true;
        return (
          token.symbol?.toLowerCase().includes(search) ||
          token.name?.toLowerCase().includes(search)
        );
      });
      const mapped = filtered.map(token => ({
        address: [token.address],
        id: token.address,
        lURI: token.logoURI || null,
        mCap: token.marketCapUSD || 0,
        mSup: null,
        name: token.name || null,
        sym: token.symbol,
      }));
      setTokenIcons({ items: mapped });
    };
    const timeoutId = setTimeout(fetchAndCacheTokens, 450);
    return () => clearTimeout(timeoutId);
  }, [selectedChain, inputSearch]);

  useEffect(() => {
    if (!open) {
      setSelectedChain(null);
      setSymbolOptionSwapFor(null);
      setInputSearchBridgeToChain("");
      setInputSearch("");
      setNewBalance("");
      setAddPositionError("");
    }
  }, [open, setAddPositionError]);

  const onOptionChange = (value: TokenSearchItem | null) => {
    setSymbolOptionSwapFor(value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 450 }}>
        <FormControl fullWidth size="medium" error={!!addPositionError}>
          <Autocomplete
            id="manual_position_chain_dropdown"
            options={lifiChains}
            getOptionLabel={(option) => option.name}
            value={selectedChain}
            onChange={(_e, newValue) => {
              setSelectedChain(newValue || null);
              setInputSearchBridgeToChain(newValue ? newValue.name : "");
              setSymbolOptionSwapFor(null); // Clear Token field
              setInputSearch(""); // Always clear token search input
              setNewBalance(""); // Always clear Qty field
              setAddPositionError("");
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            disableClearable={false}
            inputValue={inputSearchBridgeToChain}
            onInputChange={(_event, newInputValue, reason) => {
              if (reason === 'input') {
                setInputSearchBridgeToChain(newInputValue);
              } else if (reason === 'clear') {
                setInputSearchBridgeToChain("");
                setSymbolOptionSwapFor(null);
                setInputSearch("");
                setNewBalance("");
              }
            }}
            loading={lifiChainsLoading}
            loadingText={<CircularProgress size={18} />}
            noOptionsText={lifiChainsError ? t('NoOptionsOnThisChain') : t('Select a Chain first')}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('Select a Chain first')}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
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
              const search = state.inputValue.toLowerCase().trim();
              const currentLabel = selectedChain ? selectedChain.name.toLowerCase().trim() : "";
              if (!search || search === currentLabel) {
                return options;
              }
              return options.filter(o => 
                o.name.toLowerCase().includes(search)
              );
            }}
            onFocus={(e) => {
               const input = e.target as HTMLInputElement;
               if (input.select) input.select();
            }}
          />
          {addPositionError && (
            <Box sx={(theme) => ({
              color: theme.palette.error.main,
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '4px',
            })}>
              {addPositionError}
            </Box>
          )}
        </FormControl>
        <Autocomplete
          options={tokenIcons?.items ?? []}
          getOptionLabel={(option) =>
            option.name
              ? `${option.sym.toUpperCase()} - ${option.name}`
              : option.sym.toUpperCase()
          }
          value={symbolOptionSwapFor}
          onChange={(_e, newValue) => {
            onOptionChange(newValue);
            if (newValue) {
              setInputSearch(
                newValue.name
                  ? `${newValue.sym.toUpperCase()} - ${newValue.name}`
                  : newValue.sym.toUpperCase()
              );
            } else {
              setNewBalance("");
            }
          }}
          isOptionEqualToValue={(option, value) => (option.id === value?.id) || (option.address?.[0] === value?.address?.[0])}
          disableClearable={false}
          inputValue={
            symbolOptionSwapFor
              ? symbolOptionSwapFor.name
                ? `${symbolOptionSwapFor.sym.toUpperCase()} - ${symbolOptionSwapFor.name}`
                : symbolOptionSwapFor.sym.toUpperCase()
              : inputSearch
          }
          onInputChange={(_event, newInputValue, reason) => {
            if (reason === 'input') {
              onOptionChange(null);
              setInputSearch(newInputValue);
              setNewBalance("");
            } else if (reason === 'clear') {
              onOptionChange(null);
              setInputSearch('');
              setNewBalance("");
            }
          }}
          disabled={!selectedChain}
          ListboxComponent={VirtualizedListbox}
          renderInput={(params) => {
            if (!selectedChain) {
              return (
                <TextField
                  {...params}
                  placeholder={t('Locked until Chain is selected')}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(129, 129, 129, 1)' }} />
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
            return (
              <TextField
                {...params}
                placeholder={t('Search')}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    symbolOptionSwapFor?.lURI ? (
                      <InputAdornment position="start">
                        <Avatar
                          src={symbolOptionSwapFor.lURI}
                          alt={symbolOptionSwapFor.sym}
                          sx={{ width: 22, height: 22, mr: 1 }}
                        />
                      </InputAdornment>
                    ) : (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  ),
                  sx: {
                    input: {
                      textTransform: symbolOptionSwapFor ? 'uppercase' : 'none',
                    },
                  },
                }}
              />
            );
          }}
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
        <TextField
          label={t('Qty')}
          variant="outlined"
          size="medium"
          value={newBalance}
          onChange={e => setNewBalance(e.target.value)}
          type="number"
          fullWidth
          disabled={!selectedChain || !symbolOptionSwapFor}
          placeholder={(!selectedChain || !symbolOptionSwapFor) ? t('Locked until Token is selected') : ''}
          InputProps={(!selectedChain || !symbolOptionSwapFor) ? {
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: 'rgba(129, 129, 129, 1)', ml: -0.5 }} />
              </InputAdornment>
            ),
            sx: {
              input: {
                color: 'rgba(81,81,81,1)',
                ml: 0.5
              },
            },
          } : {}}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            if (selectedChain && symbolOptionSwapFor && newBalance) {
              onAdd(selectedChain, symbolOptionSwapFor, newBalance);
            }
          }}
          disabled={Boolean(addPositionError) || !symbolOptionSwapFor || !newBalance || !selectedChain}
        >
          {t("Add")}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t("Cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

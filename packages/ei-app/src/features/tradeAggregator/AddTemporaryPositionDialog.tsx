import React, { useEffect, useState } from "react";
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
import { LifiChain } from "./lifiChains";
import { TokenSearchItem } from "@/models/Wallet/TokenSearchItem";

interface AddTemporaryPositionDialogProps {
  open: boolean;
  onClose: () => void;
  lifiChains: LifiChain[];
  lifiChainsLoading: boolean;
  lifiChainsError: boolean;
  tokenIcons: { items: TokenSearchItem[] } | null;
  fetchTokenIcons: (chainName: string, search: string) => void;
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
  tokenIcons,
  fetchTokenIcons,
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

  useEffect(() => {
    if (selectedChain) {
      setInputSearchBridgeToChain(selectedChain.name);
    } else {
      setInputSearchBridgeToChain("");
    }
  }, [selectedChain]);

  useEffect(() => {
    if (!selectedChain) return;
    const delayDebounce = setTimeout(() => {
      fetchTokenIcons(selectedChain.name, inputSearch);
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [selectedChain, inputSearch, fetchTokenIcons]);

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
              setSymbolOptionSwapFor(null);
              setAddPositionError("");
              if (!newValue) {
                setInputSearch("");
                setNewBalance("");
              }
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
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.logoURI && (
                  <Avatar src={option.logoURI} alt={option.name} sx={{ width: 20, height: 20, mr: 1 }} />
                )}
                <Typography variant="body1">{option.name}</Typography>
              </Box>
            )}
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
          isOptionEqualToValue={(option, value) => option.id === value?.id}
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

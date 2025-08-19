import React, { useEffect, useState } from "react";
import {
  Box,
  styled,
  Select,
  SelectChangeEvent,
  Button,
  MenuItem,
  darken,
  lighten,
  TextField,
  DialogActions,
  Dialog,
  DialogContent,
  Grid,
  useTheme,
  FormControl,
  InputLabel,
  Autocomplete,
  Avatar,
  InputAdornment,
  Typography,
} from "@mui/material";
import {
  BasicTable,
  fetchWalletsPortfolio,
  nativeBarSx,
  PaginatedList,
  toTableTokensModels,
} from "components";
import { useTranslation } from "react-i18next";
import { GridRowSelectionModel, useGridApiRef } from "@mui/x-data-grid";
import { fetchWallets } from "components";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { getIndexResultWalletTableColumns } from "@/constants/ColumnsDefs/IndexResultWalletTable";
import { PositionAllocation } from "@/models/Wallet/PositionAllocation";
import { Wallet } from "@/models/Wallet/Wallet";
import { TokenSearchItem } from "@/models/Wallet/TokenSearchItem";
import { iconsApi } from "@/services/iconsService";
import SearchIcon from '@mui/icons-material/Search';
import CustomNoWalletOverlay from "@/components/CustomNoWalletOverlay";
import { filterDustTokens } from "components";

interface CurrentPositionSectionProps {
    onWalletChange?: (wallet: Wallet | null) => void;
    selectedToken: string | null;
    onFilteredRowsChange?: (rows: WalletBalance[]) => void;
    selectedChainNewPosition: string | null;
    onTokenChange?: (token: WalletBalance | null) => void;
    onClearTokenAndChain?: () => void;
  }

export const CurrentPositionSection : React.FC<CurrentPositionSectionProps> = 
({ onWalletChange,onFilteredRowsChange, selectedToken,selectedChainNewPosition,onTokenChange,onClearTokenAndChain }) => {
  const theme = useTheme();
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const apiRef = useGridApiRef();
  const dispatch = useAppDispatch();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [newToken, setNewToken] = useState<string>("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [isAddingManualPosition, setIsAddingManualPosition] = useState<boolean>(false);
  const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
  const [filteredWalletData, setFilteredWalletData] = useState<WalletBalance[]>([]);
  const [positionRows, setPositionRows] = useState<PositionAllocation[]>([]);
  const [selectedRows, setSelectedRows] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState("");
  const [addPositionError, setAddPositionError] = useState<string>("");
  const [tokensToTrade, settokensToTrade] = useState<number>(5);
  const [tokenIcons, setTokenIcons] = useState<PaginatedList<TokenSearchItem> | null>(null);
  const [symbolOptionSwapFor, setSymbolOptionSwapFor] = useState<TokenSearchItem | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const [wasManualSelection, setWasManualSelection] = useState(false);
  const { tableData } = useAppSelector( state => state.marketCapWeightedModeling );
    const { portfolioWalletData } = useAppSelector((state) => state.wallets);

  const handleClearTable = () => {
    setSelectedChain("");
    setSelectedRows(null);
    setSelectedWallet(null);
     if (onClearTokenAndChain) {
    onClearTokenAndChain();
  }

    if (onWalletChange) {
      onWalletChange(null);
    }
    setFilteredRows([]);
  };

    const coinGeckoChainId = (chain: string) => {
               switch (chain.toLowerCase()) {
                 case "ethereum":
                   return 1;
                 case "optimism":
                   return 10;
                 case "arbitrum":
                   return 42161;
                 case "bnb chain":
                   return 56;
                 case "polygon":
                   return 137;
                 case "avalanche":
                   return 43114;
               }
             };

  const normalizeNetworkName = (network: string): string => {
    if (!network) return "";
    
    const networkLower = network.toLowerCase();
    
    if (networkLower === "binance-smart-chain") {
      return "BNB Chain";
    }
    
    return network.charAt(0).toUpperCase() + network.slice(1).toLowerCase();
  };

  const { wallets } = useAppSelector(state => state.wallets);

  useEffect(() => {
    if (wasManualSelection) return;

    if (selectedToken && selectedChainNewPosition) {
      const matchingRow = filteredRows.find(
        row => row.tokenName?.toLowerCase() === selectedToken.toLowerCase() && 
        row.chain?.toLowerCase() === selectedChainNewPosition.toLowerCase()
      );

      setSelectedRows(`${matchingRow?.tokenName?.toLowerCase()}-${matchingRow?.chain?.toLowerCase()}`);
    } else {
      setSelectedRows(null);
    }
  }, [selectedToken,selectedChainNewPosition, filteredRows]); 

  useEffect(() => {
    if (wasManualSelection) {
      const timeout = setTimeout(() => {
        setWasManualSelection(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [wasManualSelection]); 

  useEffect(() => {
    dispatch(fetchWallets(null));
  }, []);

  useEffect(() => {
      if (wallets && wallets.length > 0) {
        const addresses = wallets.map(w => w.address);
           dispatch(fetchWalletsPortfolio(addresses));
      }
    }, [wallets, dispatch]);

    const selectedPortfolio = portfolioWalletData.find(
      (p) => p.walletAddress === selectedWallet?.address
    )?.tokenHoldings;

         useEffect(() => {
       if(selectedPortfolio) {
         const filteredTokens = filterDustTokens(selectedPortfolio);
         const data = filteredTokens.map(token => ({
           tokenName: token.symbol,
           name: token.name,
           chain: normalizeNetworkName(token.network),
           balance: token.balance,
           tokenAddress: token.tokenAddress,
         }));
         setFilteredWalletData(data);
         setFilteredRows(data);
         if (onFilteredRowsChange) {
           onFilteredRowsChange(data);
         }
       } else {
         setFilteredWalletData([]);
         setFilteredRows([]);
         if (onFilteredRowsChange) {
           onFilteredRowsChange([]);
         }
       }
     },[selectedPortfolio])

  useEffect(() => {
    if (!selectedChain) return;

    const delayDebounce = setTimeout(() => {
      const fetchIconsForSwapFor = async () => {
        const chainId = coinGeckoChainId(selectedChain);

        try {
          const result = await iconsApi.getIcons(
            inputSearch,
            0,
            chainId,
            500
          );
          setTokenIcons(result);
        } catch (error) {
          console.error('Error loading icons for swap for:', error);
        }
      };

      fetchIconsForSwapFor();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [selectedChain, inputSearch]);


    useEffect(() => {
    if (!selectedWallet || isManualUpdate) {
      if (isManualUpdate) {
        setIsManualUpdate(false);
      }
      return;
    }
  }, [selectedWallet]);


  useEffect(() => {
    setFilteredRows(filteredWalletData);
    if (onFilteredRowsChange) {
      onFilteredRowsChange(filteredWalletData);
    }
  }, [filteredWalletData]);

  useEffect(() => {
    if (onFilteredRowsChange) {
      onFilteredRowsChange(filteredRows);
    }
  }, [filteredRows]);

  useEffect(() => {
    if (symbolOptionSwapFor && newBalance && selectedChain) {
      const tokenNameLower = symbolOptionSwapFor.sym.toLowerCase();
      const selectedChainLower = selectedChain.toLowerCase();
      const isDuplicate = filteredRows.some(
        row =>
          row.tokenName?.toLowerCase() === tokenNameLower &&
          row.chain?.toLowerCase() === selectedChainLower
      );
  
      if (isDuplicate) {
        setAddPositionError(t("TokenAlreadyExists"));
      } else {
        setAddPositionError("");
      }
    } else {
      setAddPositionError("");
    }
  }, [symbolOptionSwapFor
    , newBalance, selectedChain, filteredRows]);

  useEffect(() => {
    if (filteredRows.length > 0 || tableData.length > 0) {
      const rebalancedData = tableData.map(asset => ({
        id: asset.symbol ? asset.symbol.toLowerCase() : "",
        symbol: asset.symbol ? asset.symbol.toLowerCase() : "",
        qty: asset.qty,
        action: "",
        connection: true,
      }));

      const walletData = filteredRows
        .filter(row => selectedRows === (row.tokenName || ""))
        .map(({ tokenName, balance }) => ({
          id: tokenName ? tokenName.toLowerCase() : "default-id",
          symbol: tokenName ? tokenName.toLowerCase() : "",
          qty: balance,
          action: "",
          connection: true,
        }));

      const mergedData = [...rebalancedData.slice(0, tokensToTrade), ...walletData];

      const updatedRows = mergedData.map(row => {
        const rebalancedRow = rebalancedData.find(asset => asset.symbol === row.symbol);
        const walletRow = walletData.find(wallet => wallet.symbol === row.symbol);

        let qty = 0;
        let action = "";

        if (rebalancedRow && walletRow) {
          qty = rebalancedRow.qty - walletRow.qty;
          action = qty >= 0 ? "Buy" : "Sell";
        } else if (!rebalancedRow && walletRow) {
          qty = -walletRow.qty;
          action = qty >= 0 ? "Buy" : "Sell";
        } else if (rebalancedRow && !walletRow) {
          qty = rebalancedRow.qty;
          action = qty >= 0 ? "Buy" : "Sell";
        }

        return {
          ...row,
          qty,
          action: action.charAt(0).toUpperCase() + action.slice(1).toLowerCase(),
        };
      });

      let uniqueRows;

      if (selectedWallet) {
        if (selectedRows !== null) {
          uniqueRows = Array.from(
            new Map(
              updatedRows
                .filter(
                  row =>
                    selectedRows === row.symbol ||
                    rebalancedData.slice(0, tokensToTrade).some(reb => reb.symbol === row.symbol),
                )
                .map(item => [item.id, item]),
            ).values(),
          );
        } else {
          uniqueRows = rebalancedData.slice(0, tokensToTrade).map(walletRow => {
            const qty = walletRow.qty;
            return {
              ...walletRow,
              qty,
              action: qty >= 0 ? "Buy" : "Sell",
            };
          });
        }
      } else {
        uniqueRows = Array.from(new Map(updatedRows.map(item => [item.id, item])).values());
      }
      setPositionRows(uniqueRows);
    }
  }, [filteredRows, tableData, selectedWallet, selectedRows, tokensToTrade]);

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setWasManualSelection(true);
    const selectedId = newSelection.length > 0 ? String(newSelection[0]) : null;
    
    if (selectedId) {
      const selectedToken = filteredRows.find(row => {
    if (!row.tokenName || !row.chain) return false;
      const id = `${row.tokenName.toLowerCase()}-${row.chain.toLowerCase()}`;
      return id === selectedId;
    }) ?? null;

       const supportedChains = ['ethereum', 'bnb chain', 'optimism', 'polygon', 'avalanche', 'arbitrum'];
       const isSupportedChain = selectedToken && selectedToken.chain && supportedChains.includes(selectedToken.chain.toLowerCase());

      if (isSupportedChain) {
        if (onTokenChange) {
          onTokenChange(selectedToken);
        }
        setSelectedRows(selectedId);
      } else {
        if (onTokenChange) {
          onTokenChange(null);
        }
        setSelectedRows(null);
      }
    } else {
      if (onTokenChange) {
        onTokenChange(null);
      }
      setSelectedRows(null);
    }
};

  const handleWalletSelect = (event: SelectChangeEvent) => {
    const selectedWalletId = event.target.value as string;
    const selectedWallet = wallets?.find(wallet => wallet.walletId === selectedWalletId) || null;
    setSelectedWallet(selectedWallet);

    setSelectedRows(null);
    setSelectedChain(""); 
    
    if (onTokenChange) {
      onTokenChange(null);
    }
    if (onWalletChange) {
      onWalletChange(selectedWallet);
    }
  };

  const handleCancelManualPosition = () => {
    setSelectedChain("");
    setSymbolOptionSwapFor(null);
    setNewBalance("");
    setIsAddingManualPosition(false);
  };

  const handleSaveManualPosition = () => {
    if (symbolOptionSwapFor && newBalance) {
      const tokenName = symbolOptionSwapFor.sym.toUpperCase();
      const balance = parseFloat(newBalance);
      const chainId = coinGeckoChainId(selectedChain);

      if (!chainId || !selectedWallet) return;

      const newAsset = {
        tokenName: symbolOptionSwapFor.sym.toUpperCase(),
        balance: parseFloat(newBalance),
        tokenAddress: symbolOptionSwapFor?.address?.[0],
      };

      const updatedChainAssets = selectedWallet.chainAssets.map(chainAsset => {
        if (chainAsset.chainId === chainId) {
          return {
            ...chainAsset,
            walletAssets: [newAsset, ...chainAsset.walletAssets],
          };
        }
        return chainAsset;
      });

      const updatedWallet = {
        ...selectedWallet,
        chainAssets: updatedChainAssets,
      };

      setSelectedWallet(updatedWallet);

      if (onWalletChange) {
        onWalletChange(updatedWallet);
      }

             const newRow: WalletBalance = {
         tokenName: symbolOptionSwapFor.sym,
         chain: normalizeNetworkName(selectedChain),
         balance: parseFloat(newBalance),
       };
      setFilteredRows(prevRows => [newRow, ...prevRows]);
      setIsAddingManualPosition(false);
      setIsManualUpdate(true);
    }
  };

  const onOptionChange = (value: TokenSearchItem | null) => {
    setSymbolOptionSwapFor(value);
  };

  return (
      <Grid
        mt={2}
        spacing={0}
        container
        xs={12}
        sx={{ marginTop: 0}}>
        <Grid
          container
          xs={12}
          spacing={1}>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            container
            direction="row"
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              marginLeft: "8px",
              marginRight: { lg: "1.5%", md: "1.5%", xs: 0 },
              marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
              backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
            }}>

            <Grid
              item
              xs={4.5}
              md={4.5}
              lg={4}
              sx={{ marginTop: "15px", marginLeft: "2%" }}>
              <Select
                displayEmpty
                value={selectedWallet?.walletId || ""}
                onChange={handleWalletSelect}
                renderValue={selected => (selected ? selectedWallet?.walletName : t("AddSavedWallet"))}
                sx={{
                  backgroundColor: "#109EEF",
                  fontSize: "11px",
                  color: "white",
                  width: "100%",
                  maxHeight: "40px",
                  marginBottom: "12px",
                  "& .MuiSelect-icon": { color: "white" },
                }}>
                {wallets?.map(wallet => (
                  <MenuItem
                    key={wallet.walletId}
                    value={wallet.walletId}>
                    {wallet.walletName}
                  </MenuItem>
                ))}
              </Select>

              {selectedWallet?(<>
                            <Button
                              sx={{
                                backgroundColor: "white",
                                width: "100%",
                                height: "40px",
                                color: "#1e90ff",
                                justifyContent: "flex-start",
                                paddingLeft: "15px",
                                fontSize: "11px bold",
                              }}
                              variant="outlined"
                              onClick={() => setIsAddingManualPosition(true)}>
                              {t("AddManualPosition")}
                            </Button>
                            </>
                            ) : (
                              <Button
                                sx={{
                                  backgroundColor: "white",
                                  width: "100%",
                                  height: "40px",
                                  color: "#1e88e5",
                                  justifyContent: "flex-start",
                                  paddingLeft: "15px",
                                  fontSize: "11px bold",
                                  borderColor: "#1e88e5",
                                  "&.Mui-disabled": {
                                    backgroundColor: "transparent",
                                    borderColor: "#1e88e5",
                                    color: "#1e88e5",
                                  },
                                }}
                                variant="outlined"
                                disabled
                                onClick={() => setIsAddingManualPosition(true)}
                              >
                              {t("AddManualPosition")}
                            </Button>
                            )}

              <Box sx={{ marginTop: "12px", display: "flex", flexDirection: "column" }}>
                <Button
                  sx={{ width: "70px", height: "35px", fontSize: "11px" }}
                  variant="outlined"
                  onClick={handleClearTable}>
                  {t("Clear")}
                </Button>
              </Box>
            </Grid>

            <Grid
              item
              xs={6.8}
              md={6.9}
              lg={7.1}
              spacing={1}
              sx={{ marginTop: "15px", marginLeft: { lg: "5%", md: "2%", xs: "0%" } }}>
              <WalletsTable
                sx={{
                  ...tableScrollSx,
                  width: "100%",
                }}
                hideFooter
                rowSelection={true}
                rowSelectionModel={selectedRows ? [selectedRows] : []}
                checkboxSelection={false}
                apiRef={apiRef}
                getRowId={(x) => `${x.tokenName.toLowerCase()}-${x.chain.toLowerCase()}`}
                columns={getIndexResultWalletTableColumns()}
                rows={filteredRows}
                onRowSelectionModelChange={handleSelectionChange}
                slots={{
                  noRowsOverlay: CustomNoWalletOverlay,
                }}
                                                  getRowClassName={(params) => {
                    const supportedChains = ['ethereum', 'bnb chain', 'optimism', 'polygon', 'avalanche', 'arbitrum'];
                    const isSupportedChain = params.row.chain && supportedChains.includes(params.row.chain.toLowerCase());
                    
                    if (!isSupportedChain) {
                      return 'unsupported-chain-row';
                    }
                    
                    if (selectedRows &&
                        `${params.row.tokenName?.toLowerCase()}-${params.row.chain?.toLowerCase()}` === selectedRows) {
                      return 'selected-row';
                    }
                    
                    return '';
                  }}
                                                           componentsProps={{
                  row: (params) => {
                    const supportedChains = ['ethereum', 'bnb chain', 'optimism', 'polygon', 'avalanche', 'arbitrum'];
                    const isSupportedChain = params.row.chain && supportedChains.includes(params.row.chain.toLowerCase());
                    
                    return {
                      title: isSupportedChain ? t("ClickToLoadCurrentPosition") : "This chain is not supported for selection"
                    };
                  }
                }}
              />
              <Dialog
                open={isAddingManualPosition}
                onClose={handleCancelManualPosition}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 450 }}>
                <FormControl fullWidth size="medium" error={!!addPositionError}>
                  <InputLabel id="chain-select-label">{t("Chain")}</InputLabel>
                                     <Select
                     labelId="chain-select-label"
                     value={selectedChain}
                     label={t("Chain")}
                     onChange={e => {
                       setSelectedChain(e.target.value);
                       setSymbolOptionSwapFor(null)
                       setAddPositionError("");
                     }}
                   >
                       <MenuItem disabled value=""></MenuItem>
                       <MenuItem value="ETHEREUM">ETHEREUM</MenuItem>
                       <MenuItem value="BNB CHAIN">BNB CHAIN</MenuItem>
                       <MenuItem value="OPTIMISM">OPTIMISM</MenuItem>
                       <MenuItem value="POLYGON">POLYGON</MenuItem>
                       <MenuItem value="AVALANCHE">AVALANCHE</MenuItem>
                       <MenuItem value="ARBITRUM">ARBITRUM</MenuItem>
                       <MenuItem value="BASE">BASE</MenuItem>
                       <MenuItem value="ZKSYNC">ZKSYNC</MenuItem>
                       <MenuItem value="GNOSIS">GNOSIS</MenuItem>
                       <MenuItem value="LINEA">LINEA</MenuItem>
                       <MenuItem value="SONIC">SONIC</MenuItem>
                       <MenuItem value="UNICHAIN">UNICHAIN</MenuItem>
                   </Select>
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
                        } else if (reason === 'clear') {
                          onOptionChange(null);
                          setInputSearch('');
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("Search")}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                {symbolOptionSwapFor?.lURI ? (
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
                                )}
                              </>
                            ),
                            sx: {
                              input: {
                                textTransform: symbolOptionSwapFor ? 'uppercase' : 'none',
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
                            {option.name
                              ? `${option.sym.toUpperCase()} - ${option.name}`
                              : option.sym.toUpperCase()}
                          </Typography>
                        </Box>
                      )}
                    />
                    <TextField
                    label={t("Qty")}
                    variant="outlined"
                    size="medium"
                    value={newBalance}
                    onChange={e => setNewBalance(e.target.value)}
                    type="number"
                    fullWidth 
                    sx={{}}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={handleSaveManualPosition}
                    disabled={Boolean(addPositionError) || !symbolOptionSwapFor || !newBalance || !selectedChain}
                  >
                    {t("Add")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelManualPosition}>
                    {t("Cancel")}
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const WalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  minHeight: "426px",
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto !important",
    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "transparent",
  },
  "& .MuiDataGrid-main": {
    height: "auto",
    maxHeight: "425px",
  },
  "& .MuiDataGrid-columnHeaders": {
  backgroundColor: theme.palette.mode === "light" ? "#f5f5f5": "transparent",
},
  "& .MuiDataGrid-footerContainer": {
    height: "40px",
  },
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "& .MuiDataGrid-row--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
  },
  "& .MuiDataGrid-cell--editing[data-field=walletName]": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "dark"
        ? darken(theme.palette.primary.main, 0.6)
        : lighten(theme.palette.primary.main, 0.7),
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  }, 
  "& .MuiDataGrid-row:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.mode === "light" ? "#e3f2fd" : "#1a237e",
    border: theme.palette.mode === "light" ?"1px solid black": "1px solid white",
  },
  "& .MuiDataGrid-row:hover .MuiDataGrid-cell": {
    backgroundColor: theme.palette.mode === "light" ? "#109EEF" : darken(theme.palette.primary.main, 0.2),
  },
  "& .unsupported-chain-row": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  "& .unsupported-chain-row:hover": {
    cursor: "not-allowed",
    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#2a2a2a",
    border: "none",
  },
  "& .unsupported-chain-row:hover .MuiDataGrid-cell": {
    backgroundColor: "transparent",
  },
  "& .selected-row .MuiDataGrid-cell": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell": {
    cursor: "pointer",
    userSelect: "none",
  },
}));

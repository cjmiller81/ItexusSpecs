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
import { keyframes } from '@mui/system';
import {
  BasicTable,
  fetchWalletsPortfolio,
  nativeBarSx,
  PaginatedList,
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
import CustomSelectWalletOverlay from "@/components/CustomSelectWalletOverlay";
import { filterDustTokens } from "components";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { isSupportedChain } from "@/utils/supportedChains";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(33, 154, 131, 0.5);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(33, 154, 131, 0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

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
  const [showDust, setShowDust] = useState(false);
  const [manualPositions, setManualPositions] = useState<WalletBalance[]>([]);
  const { tableData } = useAppSelector( state => state.marketCapWeightedModeling );
  const { portfolioWalletData } = useAppSelector((state) => state.wallets);

  const handleClearTable = () => {
    setSelectedChain("");
    setSelectedRows(null);
    setSelectedWallet(null);
    setManualPositions([]);
    if (onClearTokenAndChain) {
      onClearTokenAndChain();
    }

    if (onWalletChange) {
      onWalletChange(null);
    }
    setFilteredRows([]);
  };

  const toggleDust = () => {
    setShowDust(prev => !prev);
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
                 case "base":
                   return 8453;
                 case "zksync":
                   return 324;
                 case "gnosis":
                   return 100;
                 case "linea":
                   return 59144;
                 case "sonic":
                   return 146;
                 case "unichain":
                   return 130;
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
  
  const NoRowsOverlayComponent = () => {
    if (wallets && wallets.length > 0 && !selectedWallet) {
      return <CustomSelectWalletOverlay />;
    }
    return <CustomNoWalletOverlay />;
  };

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
          const tokensToProcess = showDust ? selectedPortfolio : filterDustTokens(selectedPortfolio);
          const portfolioData = tokensToProcess.map(token => ({
            tokenName: token.symbol,
            name: token.name,
            chain: normalizeNetworkName(token.network),
            balance: token.balance,
            tokenAddress: token.tokenAddress,
          }));
          
          const combinedData = [...portfolioData, ...manualPositions];
          setFilteredWalletData(combinedData);
          setFilteredRows(combinedData);
          if (onFilteredRowsChange) {
            onFilteredRowsChange(combinedData);
          }
        } else {
          setFilteredWalletData(manualPositions);
          setFilteredRows(manualPositions);
          if (onFilteredRowsChange) {
            onFilteredRowsChange(manualPositions);
          }
        }
      },[selectedPortfolio, showDust, manualPositions])

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
      
      const selectedPortfolio = portfolioWalletData.find(
        (p) => p.walletAddress === selectedWallet?.address
      )?.tokenHoldings;
      
      const portfolioData = selectedPortfolio ? selectedPortfolio.map(token => ({
        tokenName: token.symbol,
        chain: normalizeNetworkName(token.network),
      })) : [];
      
      const allTokens = [...portfolioData, ...manualPositions];
      
      const isDuplicate = allTokens.some(
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
  }, [symbolOptionSwapFor, newBalance, selectedChain, portfolioWalletData, selectedWallet, manualPositions]);

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

              const isSupportedChainToken = selectedToken && selectedToken.chain && 
         isSupportedChain(selectedToken.chain);

       if (isSupportedChainToken) {
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
    setAddPositionError("");
    setIsAddingManualPosition(false);
  };

  const handleSaveManualPosition = () => {
    if (symbolOptionSwapFor && newBalance) {
      const newRow: WalletBalance = {
        tokenName: symbolOptionSwapFor.sym,
        chain: normalizeNetworkName(selectedChain),
        balance: parseFloat(newBalance),
        tokenAddress: symbolOptionSwapFor?.address?.[0],
      };

      setManualPositions(prevPositions => [newRow, ...prevPositions]);
      
      setIsAddingManualPosition(false);
      setIsManualUpdate(true);
    }
  };

  const onOptionChange = (value: TokenSearchItem | null) => {
    setSymbolOptionSwapFor(value);
  };

  return (
    <>
      <Grid
        mt={2}
        spacing={0}
        container
        xs={12}>
        <Grid
          container
          xs={12}
          spacing={1}>
          <Grid
            id="current_position_section"
            item
            xs={12}
            md={12}
            lg={12}
            spacing={1}
            container
            direction="row"
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              marginLeft: "8px",
              marginRight: { lg: "1.5%", md: "1.5%", xs: 0 },
              marginTop: { lg: "0%", md: "1.5%", xs: "4%" },
              backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "#f7f5f2",
            }}>

             <Grid
                item
                xs={12}
                md={4.5}
                lg={4.6}
                sx={{ marginTop: "31px", marginLeft: "0%", marginRight:{ lg: "0%", md: "1%", xs: "2%" }, position: 'relative'  }}>
              
              {!selectedWallet && wallets && wallets.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    animation: `${bounce} 2s ease-in-out infinite`,
                    zIndex: 10,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#219a83',
                    }}
                  >
                    Click Here
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#219a83',
                    }}
                  >
                    ↓
                  </Typography>
                </Box>
              )}

              {!wallets || wallets.length === 0 ? (
                <Select
                  id="wallet_dropdown"
                  displayEmpty
                  value=""
                  renderValue={() => t("AddSavedWallet")}
                  sx={{
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#219a83",
                    width: "100%",
                    maxHeight: "40px",
                    marginBottom: "12px",
                    pointerEvents: 'none',
                    cursor: 'not-allowed',
                    "& .MuiSelect-icon": { color: "#219a83" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#219a83",
                    },
                  }}
                />
              ) : !selectedWallet ? (
                <Select
                  id="wallet_dropdown"
                  displayEmpty
                  value=""
                  onChange={handleWalletSelect}
                  renderValue={() => t("AddSavedWallet")}
                  sx={{
                    backgroundColor: "#219a83",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "white",
                    width: "100%",
                    maxHeight: "40px",
                    marginBottom: "12px",
                    animation: `${pulseGlow} 2s ease-in-out infinite`,
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    "& .MuiSelect-icon": { color: "white" },
                  }}
                >
                  {wallets?.map(wallet => (
                    <MenuItem
                      key={wallet.walletId}
                      value={wallet.walletId}>
                      {wallet.walletName}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  id="wallet_dropdown"
                  displayEmpty
                  value={selectedWallet.walletId}
                  onChange={handleWalletSelect}
                  renderValue={selected => selectedWallet.walletName}
                  sx={{
                    backgroundColor: "#219a83",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "white",
                    width: "100%",
                    maxHeight: "40px",
                    marginBottom: "12px",
                    "& .MuiSelect-icon": { color: "white" },
                  }}
                >
                  {wallets?.map(wallet => (
                    <MenuItem
                      key={wallet.walletId}
                      value={wallet.walletId}>
                      {wallet.walletName}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {selectedWallet?(<>
                            <Button
                              id="manual_position_btn"
                              sx={{
                                backgroundColor: "#f7f5f2", // Warm off-white
                                width: "100%",
                                height: "40px",
                                color: "#219a83",
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
                                id="manual_position_btn"
                                sx={{
                                  backgroundColor: "#f7f5f2",
                                  width: "100%",
                                  height: "40px",
                                  color: "#219a83",
                                  justifyContent: "flex-start",
                                  paddingLeft: "15px",
                                  fontSize: "11px bold",
                                  borderColor: "#219a83",
                                  "&.Mui-disabled": {
                                    backgroundColor: "transparent",
                                    borderColor: "#219a83",
                                    color: "#219a83",
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

              {selectedWallet && (
                <Box
                  sx={{
                    mt: 2,
                    width: '100%',
                    borderRadius: '12px',
                    background: (theme) => theme.palette.mode === 'dark' ? '#222b3fff' : '#e9eef6',
                    color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a1a',
                    '--tg-step': '0px',
                    '@media (min-width:3840px)': { '--tg-step': '1px' },
                  }}
                >
                  <Box sx={{ padding:"8px" }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 600, mb: 1, color: '#219a83' }}>
                      {t("HowToUseADDTEMPORARYPOSITION")}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.4 }}>
                      {t("ThisIsAToolToUseToSimulateTradeOrHoldingNotYetInYourWallet")}
                    </Typography>
                  </Box>

                  <Box sx={{ padding:"6px" }}>
                    {[{
                      n: 1, t: 'Choose Your Asset and Chain', d: 'Select any token and blockchain to simulate'
                    },{
                      n: 2, t: 'Set Quantity', d: "Enter the amount you're considering"
                    },{
                      n: 3, t: 'Preview Impact', d: 'Test current swap routes with the position'
                    }].map(step => (
                      <Box key={step.n} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                        <Box sx={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: '#219a83', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: 600, flexShrink: 0
                        }}>{step.n}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '15px', fontWeight: 450, color: theme.palette.mode === "dark" ?'#e5e7eb': '#6c7179ff', mb: 0.25 }}>{step.t}</Typography>
                          <Typography sx={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1 }}>{step.d}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{padding:"8px"}}>
                    <Typography sx={{ fontSize: '14px', color: theme.palette.mode === "dark" ?'#d1d5db': '#6c7179ff', mb: 0.5 }}>
                      Click <Box component="span" sx={{ color: '#219a83', fontWeight: 500 }}>&quot;Clear&quot;</Box> to remove the position.
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
                      {t("NOTEThisWillAlsoRequireYouToReloadSelectedWallet")}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>

               <Grid
                 item
                 xs={12}
                 md={6.9}
                 lg={6.6}
                 sx={{ marginTop: "5px", marginLeft: { lg: "4%", md: "2%", xs: "0%" },marginRight:{ lg: "0%", md: "1%", xs: "2%" }, position: 'relative' }}>
               
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  sx={{marginBottom:"5px", paddingRight:"5px", paddingLeft:"5px"}}
                >
                 {selectedWallet !== undefined ? (
                   <Box display="flex" alignItems="center" sx={{ visibility: selectedWallet ? 'visible' : 'hidden' }}>
                     <InfoOutlinedIcon sx={{ color: "#666", fontSize: 18, mr: 0.5 }} />
                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                       {t("TableDisplaysTokenPositionsOnly")}
                     </Typography>
                   </Box>
                 ) : null}
                 <Box 
                   display="flex" 
                   alignItems="center" 
                   sx={{ cursor: "pointer" }}
                   onClick={toggleDust}
                 >
                   {showDust ? (
                     <VisibilityOffIcon sx={{ color: "#666", fontSize: 20, mr: 0.5 }} />
                   ) : (
                     <RemoveRedEyeIcon sx={{ color: "#666", fontSize: 20, mr: 0.5 }} />
                   )}
                   <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                     {showDust ? "Hide Dust" : "Show Dust"}
                   </Typography>
                 </Box>
               </Box>
               
                <Box id="token_list">
                  <WalletsTable
                    sx={{
                      ...tableScrollSx,
                      width: "100%",
                      '& .MuiDataGrid-virtualScroller': {
                        border: (!wallets || wallets.length === 0) ? '2px dashed #219a83' : 'none',
                        borderRadius: (!wallets || wallets.length === 0) ? '8px' : '0',
                        overflow: (!wallets || wallets.length === 0) ? 'hidden !important' : 'auto',
                      },
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
                    noRowsOverlay: NoRowsOverlayComponent,
                  }}
                                                                     getRowClassName={(params) => {
                     const isSupportedChainRow = params.row.chain && 
                       isSupportedChain(params.row.chain);
                     
                     if (!isSupportedChainRow) {
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
                     const isSupportedChainRow = params.row.chain && 
                       isSupportedChain(params.row.chain);
                     
                     return {
                       title: isSupportedChainRow ? t("ClickToLoadCurrentPosition") : `${params.row.chain} chain is not supported for selection`
                     };
                   }
                 }}
                />
                </Box>
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
    </>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const WalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  minHeight: "425px",
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
    backgroundColor: theme.palette.mode === "light" ? "#219a83" : darken(theme.palette.primary.main, 0.2),
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

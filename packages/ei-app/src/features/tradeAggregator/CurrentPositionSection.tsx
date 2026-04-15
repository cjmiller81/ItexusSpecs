import React, { useEffect, useState, useCallback } from "react";
import { useLifiChainMap, LifiChain } from "@/common/lifiChainContext";
import { lifiChainMapToArray } from "./lifiChains";
import {
  Box,
  Select,
  SelectChangeEvent,
  Button,
  MenuItem,
  Grid,
  useTheme,
  Typography,
  CircularProgress
} from "@mui/material";
import { AddTemporaryPositionDialog } from "./AddTemporaryPositionDialog";
import { keyframes } from '@mui/system';
import {
  fetchWalletsPortfolio,
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
import CustomNoWalletOverlay from "@/components/CustomNoWalletOverlay";
import CustomSelectWalletOverlay from "@/components/CustomSelectWalletOverlay";
import { filterDustTokens } from "components";
import { WalletsTable } from "./WalletsTable";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { isSupportedChain } from "@/utils/supportedChains";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(33, 154, 131, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(33, 154, 131, 0.1);
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
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
  // Ref for the root container
  const rootRef = React.useRef<HTMLDivElement>(null);
  // State for dynamic height
  const [dynamicHeight, setDynamicHeight] = useState<number | undefined>(undefined);
  const [defaultHeight, setDefaultHeight] = useState<number>(700);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);

  // Listen for NewPositionSection height changes
  useEffect(() => {
    const updateHeight = () => {
      const newSection = document.getElementById('new-position-section-root');
      if (newSection && rootRef.current && defaultHeight) {
        const newHeight = newSection.offsetHeight;
        if (newHeight > defaultHeight) {
          setDynamicHeight(newHeight);
        } else {
          setDynamicHeight(undefined);
        }
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    const observer = new MutationObserver(updateHeight);
    const newSection = document.getElementById('new-position-section-root');
    if (newSection) {
      observer.observe(newSection, { childList: true, subtree: true, attributes: true });
    }
    return () => {
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
    };
  }, [defaultHeight]);
  const theme = useTheme();
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const apiRef = useGridApiRef();
  const dispatch = useAppDispatch();
  const [newToken, setNewToken] = useState<string>("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [isAddingManualPosition, setIsAddingManualPosition] = useState<boolean>(false);
  const [filteredWalletData, setFilteredWalletData] = useState<WalletBalance[]>([]);
  const [positionRows, setPositionRows] = useState<PositionAllocation[]>([]);
  const [selectedRows, setSelectedRows] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<LifiChain | null>(null);
  const [addPositionError, setAddPositionError] = useState<string>("");
  const [tokensToTrade, settokensToTrade] = useState<number>(5);
  const [tokenIcons, setTokenIcons] = useState<PaginatedList<TokenSearchItem> | null>(null);
  const [symbolOptionSwapFor, setSymbolOptionSwapFor] = useState<TokenSearchItem | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const [wasManualSelection, setWasManualSelection] = useState(false);
  const [showDust, setShowDust] = useState(false);
  const [manualPositions, setManualPositions] = useState<WalletBalance[]>([]);
  const { tableData } = useAppSelector( state => state.marketCapWeightedModeling );
  const { portfolioWalletData } = useAppSelector((state) => state.wallets);

  const handleClearTable = () => {
    setSelectedChain(null);
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

  const { lifiChainMap, isLoading: lifiChainsLoading, error } = useLifiChainMap();
  const lifiChains = lifiChainMapToArray(lifiChainMap);
  const lifiChainsError = !!error;
  const [inputSearchBridgeToChain, setInputSearchBridgeToChain] = useState("");

  // Sync inputSearchBridgeToChain with selectedChain
  useEffect(() => {
    if (selectedChain) {
      setInputSearchBridgeToChain(selectedChain.name);
    } else {
      setInputSearchBridgeToChain("");
    }
  }, [selectedChain]);

  const { wallets } = useAppSelector(state => state.wallets);
  
  // Loading state for wallet positions (portfolio fetch)
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);

  useEffect(() => {
    if (wallets && wallets.length > 0 && lifiChainMap) {
      const addresses = wallets.map(w => w.address);
      setIsPortfolioLoading(true);
      dispatch(fetchWalletsPortfolio({ addresses, lifiChainMap }));
    }
  }, [wallets, dispatch, lifiChainMap]);

  // When portfolioWalletData changes, stop loading
  useEffect(() => {
    if (isPortfolioLoading) {
      setIsPortfolioLoading(false);
    }
  }, [portfolioWalletData]);

  const NoRowsOverlayComponent = () => {
    // Show the "Select Wallet" overlay until a wallet is selected
    if (wallets && wallets.length > 0 && !selectedWallet) {
      return <CustomSelectWalletOverlay />;
    }
    // Only show spinner if a wallet is selected and loading
    if (selectedWallet && isPortfolioLoading) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" minHeight={200}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CircularProgress size={32} sx={{ color: '#219a83' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Loading wallet positions...
          </Typography>
        </Box>
      );
    }
    // If a wallet is selected but no positions exist, show CustomNoWalletOverlay
    if (selectedWallet && filteredRows.length === 0) {
      return <CustomNoWalletOverlay />;
    }
    // Otherwise, default overlay
    return null;
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
            decimals: token.decimals
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
      const selectedChainLower = selectedChain.name.toLowerCase();
      
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

      // Allow selection of any token, even if chain is not supported
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
};

  const handleWalletSelect = (event: SelectChangeEvent) => {
    const selectedWalletId = event.target.value as string;
    const selectedWallet = wallets?.find(wallet => wallet.walletId === selectedWalletId) || null;
    setSelectedWallet(selectedWallet);

    setSelectedRows(null);
    setSelectedChain(null); 
    
    if (onTokenChange) {
      onTokenChange(null);
    }
    if (onWalletChange) {
      onWalletChange(selectedWallet);
    }
  };

  return (
    <>
      <Grid
        mt={2}
        spacing={0}
        container
        sx={{ width: '100%' }}
      >
        <Grid
          container
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Grid
            id="current_position_section"
            ref={rootRef}
            item
            xs={12}
            container
            spacing={1}
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              marginLeft: { xs: 0, sm: '4px', md: '8px' },
              marginRight: { lg: "1.5%", md: "1.5%", xs: 0 },
              marginTop: { lg: "0%", md: "1.5%", xs: "4%" },
              backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "#f7f5f2",
              width: '100%',
              flexDirection: { xs: 'column', md: 'row' },
              display: 'flex',
              gap: { xs: 2, md: 0 },
              padding: { xs: 1, sm: 2 },
              height: dynamicHeight
                ? `${dynamicHeight}px`
                : `${defaultHeight}px`,
              overflow: 'auto',
            }}
          >
            <Grid
              item
              xs={12}
              md={5}
              lg={4.6}
              sx={{
                marginTop: { xs: '16px', md: "31px" },
                marginLeft: "0%",
                marginRight: { lg: "0%", md: "1%", xs: "0%" },
                position: 'relative',
                width: { xs: '100%', md: '34%' },
                minWidth: 0,
                paddingRight: { xs: 0, md: 2 },
                paddingBottom: { xs: 2, md: 0 },
                flex: { xs: 'unset', md: '0 0 34%' },
                maxWidth: { xs: '100%', md: '34%' },
              }}
            >

              {!wallets || wallets.length === 0 ? (
                <Select
                  id="wallet_dropdown"
                  displayEmpty
                  value=""
                  renderValue={() => t("SelectSavedWAallet")}
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
                  renderValue={() => t("SelectSavedWAallet")}
                  sx={{
                    backgroundColor: "#219a83",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "white",
                    width: "100%",
                    maxHeight: "40px",
                    marginBottom: "12px",
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `${pulseGlow} 3s ease-in-out infinite`,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    "& .MuiSelect-icon": { color: "white", position: 'relative', zIndex: 1 },
                    "& .MuiSelect-select": { position: 'relative', zIndex: 1 },
                    "&::before": {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      animation: `${shimmer} 2s infinite`,
                      zIndex: 0,
                    },
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

              {selectedWallet ? (
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
                  }}
                  variant="outlined"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  {t("AddManualPosition")}
                </Button>
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
              md={7}
              lg={7.4}
              sx={{
                marginTop: { xs: '0px', md: "5px" },
                marginLeft: { lg: "4%", md: "2%", xs: "0%" },
                marginRight: { lg: "0%", md: "1%", xs: "0%" },
                position: 'relative',
                width: { xs: '100%', md: '62%' },
                minWidth: 0,
                paddingLeft: { xs: 0, md: 2 },
                flex: { xs: 'unset', md: '0 0 62%' },
                maxWidth: { xs: '100%', md: '62%' },
              }}
            >
               
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  sx={{marginBottom:"5px", paddingRight:"5px", paddingLeft:"5px"}}
                >
                 {selectedWallet !== undefined ? (
                   <Box display="flex" alignItems="center" sx={{ visibility: selectedWallet ? 'visible' : 'hidden' }}>
                     <InfoOutlinedIcon sx={{ color: "#666", fontSize: 18, mr: 0.5 }} />
                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", whiteSpace: 'nowrap' }}>
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
                   <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem", whiteSpace: 'nowrap' }}>
                     {showDust ? "Hide Dust" : "Show Dust"}
                   </Typography>
                 </Box>
               </Box>
               
                <Box id="token_list">
                  <WalletsTable
                    sx={{
                      width: "100%",
                      '& .MuiDataGrid-virtualScroller': {
                        border: (!wallets || wallets.length === 0) ? '2px dashed #219a83' : 'none',
                        borderRadius: (!wallets || wallets.length === 0) ? '8px' : '0',
                        overflow: (!wallets || wallets.length === 0) ? 'hidden !important' : 'auto',
                      },
                    }}
                    maxHeight={(dynamicHeight ?? defaultHeight) - 120}
                    hideFooter
                    defaultRowsPerPage={100}
                    rowSelection={true}
                    rowSelectionModel={selectedRows ? [selectedRows] : []}
                    checkboxSelection={false}
                    apiRef={apiRef}
                    getRowId={(x) => `${x.tokenName.toLowerCase()}-${x.chain.toLowerCase()}`}
                    columns={getIndexResultWalletTableColumns()}
                    rows={filteredRows}
                    onRowSelectionModelChange={handleSelectionChange}
                    components={{
                      NoRowsOverlay: NoRowsOverlayComponent,
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
              <AddTemporaryPositionDialog
                open={isAddDialogOpen}
                onClose={() => {
                  setAddPositionError("");
                  setIsAddDialogOpen(false);
                }}
                lifiChains={lifiChains}
                lifiChainsLoading={lifiChainsLoading}
                lifiChainsError={lifiChainsError}
                tokenIcons={tokenIcons}
                fetchTokenIcons={useCallback((chainName, search) => {
                  const chainId = coinGeckoChainId(chainName);
                  iconsApi.getIcons(search, 0, chainId, 500).then(setTokenIcons).catch(() => {});
                }, [])}
                onAdd={(chain, token, qty) => {
                  // Prevent duplicate manual positions or wallet positions
                  const tokenNameLower = token.sym.toLowerCase();
                  const chainNameLower = chain.name.toLowerCase();
                  // Check manual positions
                  const existsManual = manualPositions.some(
                    row => row.tokenName?.toLowerCase() === tokenNameLower &&
                      row.chain?.toLowerCase() === chainNameLower
                  );
                  // Check wallet positions
                  const selectedPortfolio = portfolioWalletData.find(
                    (p) => p.walletAddress === selectedWallet?.address
                  )?.tokenHoldings || [];
                  const existsWallet = selectedPortfolio.some(
                    row => row.symbol?.toLowerCase() === tokenNameLower &&
                      normalizeNetworkName(row.network)?.toLowerCase() === chainNameLower
                  );
                  if (existsManual || existsWallet) {
                    setAddPositionError(t("Positions already exists in loaded wallet"));
                    return;
                  }
                  const newRow = {
                    tokenName: token.sym,
                    chain: chain.name,
                    balance: parseFloat(qty),
                    tokenAddress: token?.address?.[0],
                  };
                  setManualPositions(prev => [newRow, ...prev]);
                  setAddPositionError("");
                  setIsAddDialogOpen(false);
                  setIsManualUpdate(true);
                }}
                addPositionError={addPositionError}
                setAddPositionError={setAddPositionError}
                t={t}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};


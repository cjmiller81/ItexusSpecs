import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Tooltip,
  SelectChangeEvent,
  useTheme,
  Grid,
  FormControl,
  Autocomplete,
  alpha,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { getTradablePairs,  useAppDispatch } from 'components';
import { formatVolume} from '@/utils/utils';
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import { Exchange, useGetExchangesQuery, useGetExchangesWithTickersQuery } from './TradeTableApi';
import { skipToken } from "@reduxjs/toolkit/query";

interface TradeData {
  symbol: string;
  mkt: string;
  qty: string;
  value: string;
  action: string;
}

interface TradingPair {
  base: string;
  target: string;
  last: number;
  volume: number;
  pair: string;
}

export function TradeTable() {
  const [tradeData, setTradeData] = useState<TradeData>({
    symbol: '',
    mkt: '',
    qty: '0',
    value: '',
    action: 'buy',
  });
  
  const { t } = useTranslation(["TradeTable"]);
  const [showMarketSelector, setShowMarketSelector] = useState(true);
  const [selectedCEX, setSelectedCEX] = useState('');
  const dispatch = useAppDispatch()
  const [debouncedSymbol, setDebouncedSymbol] = useState('');
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const isDarkMode = theme.palette.mode === "dark";
  const borderColor = theme.palette.divider;
  const [isSwitchIncluded, setIsSwitchIncluded] = useState<boolean>(false);
  const [manualValueInput, setManualValueInput] = useState('');
  const [activeTab, setActiveTab] = useState<"Trading Pairs" | "Arbitrage Matrix">("Trading Pairs");
  const { data: coinGeckoExchanges, isLoading: isCoinGeckoExchangesLoading } = useGetExchangesQuery();
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const { data: coinGeckoExchangesWithTickers, isLoading: isTradingPairsLoading } = useGetExchangesWithTickersQuery(selectedExchange?.id ?? skipToken)
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [topTradingPairs, setTopTradingPairs] = useState<TradingPair[]>([]);
  
  // Fetch trading pairs for selected exchange
  useEffect(() => {
    const fetchTradingPairs = async () => {
      if (!selectedExchange || !coinGeckoExchangesWithTickers) return;

      try {
        // Process and deduplicate trading pairs
        const pairsMap = new Map();
        coinGeckoExchangesWithTickers.tickers?.forEach(ticker => {
            const pair = `${ticker.base}/${ticker.target}`;
            if (!pairsMap.has(pair)) {
              pairsMap.set(pair, {
                base: ticker.base,
                target: ticker.target,
                last: ticker.last,
                volume: ticker.converted_volume.usd,
                pair: pair
              });
            }
        });

        const pairs = Array.from(pairsMap.values());
        setTradingPairs(pairs);
        
        // Get top 10 trading pairs by volume for the table
        const topPairs = [...pairs]
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 10);
        setTopTradingPairs(topPairs);
      } catch (error) {
        console.error('Failed to fetch trading pairs:', error);
      } 
    };

    fetchTradingPairs();
  }, [selectedExchange, coinGeckoExchangesWithTickers]);

  const handleTradingPairSelect = (pair: string | null) => {
    if (pair) {
      const [symbol, target] = pair.split('/');
      setTradeData({
        ...tradeData,
        symbol,
        mkt: pair
      });
    } else {
      setTradeData({
        ...tradeData,
        symbol : '',
        mkt: ''
      });
    }
  };
  
  const handleExchangeSelect = (event: SelectChangeEvent<string>) => {
    const exchangeId = event.target.value;
    const exchange = coinGeckoExchanges?.find(e => e.id === exchangeId);
    setSelectedExchange(exchange || null);
    setTradeData({
      symbol: '',
      mkt: '',
      qty: '0',
      value: '',
      action: 'buy',
    });
  };

  const handleTopPairClick = (pair: TradingPair) => {
    handleTradingPairSelect(pair.pair);
  };

  const handleSwitchClick = () => {
    setManualValueInput('');
    setTradeData((prev) => ({
      ...prev,
      qty: "",      
      value: "", 
    }));
    setIsSwitchIncluded(prev => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSymbol(tradeData.symbol);
    }, 150);
    setTradeData((prev) => ({
      ...prev,
    }));
    return () => clearTimeout(timer);
  }, [tradeData.symbol]);

  useEffect(() => {
    if (debouncedSymbol.length < 3) {
      return;
    }

    dispatch(getTradablePairs(debouncedSymbol.toUpperCase()));
    setShowMarketSelector(true);
  }, [debouncedSymbol, dispatch]);

  useEffect(() => {
    if (!tradeData.mkt) {
      return;
    }
    const selectedMarket = tradingPairs.find(m => m.pair === tradeData.mkt);
    if (!selectedMarket) {
      setTradeData(prev => ({ ...prev, value: '', qty: '0' }));
      return;
    }

    const price = selectedMarket.last;
    if (isNaN(price) || price <= 0) {
      setTradeData(prev => ({ ...prev, value: '', qty: '0' }));
      return;
    }

    if (isSwitchIncluded) {
      if(tradeData.action === 'buy')
      {
        const val = parseFloat(tradeData.value.replace(/,/g, '')) || 0;
          if (val > 0) {
            const computedQty = val / price;
            const formattedQty = computedQty.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            });
          setTradeData(prev => ({ ...prev, qty: formattedQty }));
        }
      }
      else{
        const val = parseFloat(tradeData.value.replace(/,/g, '')) || 0;
        const computedQty = val / price;
        if (val > 0) {
            const formattedQty = computedQty.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            });
          setTradeData(prev => ({ ...prev, qty: formattedQty }));
        }
      }
    } else {
        if(tradeData.action === 'buy')
        {
          const qtyParse = parseFloat(tradeData.qty.replace(/,/g, '')) || 0;
          
          const valueNeeded = qtyParse * price;
          
          const formattedValue = (!isNaN(qtyParse) && qtyParse > 0)
            ? valueNeeded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
            : '';

          setTradeData(prev => ({ ...prev, value: formattedValue }));
        }
        else{  
          const val = parseFloat(tradeData.qty.replace(/,/g, '')) || 0;
          const computedQty = val * price;
          if (val > 0) {
              const formattedQty = computedQty.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              });
            setTradeData(prev => ({ ...prev, value: formattedQty }));
          }
        }
      }
  }, [
    tradeData.mkt,
    tradeData.value,
    tradeData.qty,
    tradeData.symbol,
    isSwitchIncluded,
    tradeData.action,
    tradingPairs
  ]);

  return (
    <Box sx={{height: "100%"}}>
      <Typography variant="h4"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}>
          {selectedCEX ? `${t("TradeAggregatorCex")} : ${selectedCEX}` : t("TradeAggregatorCex")}
      </Typography>
      
      <Grid
        container
        direction="column"
        sx={{
          borderRadius: "10px",
          minHeight: "calc(100vh - 40%)",
          boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
          backgroundColor:
            theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
            padding: 2,
          }}
      >
      
      {/* Tabs */}
      <Grid item container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button
            variant={activeTab === "Trading Pairs" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveTab("Trading Pairs")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              backgroundColor: activeTab === "Trading Pairs" ? "#1e88e5" : undefined,
              color: activeTab === "Trading Pairs" ? "#fff" : undefined,
              "&:hover": {
                backgroundColor: activeTab === "Trading Pairs" ? "#1565c0" : undefined,
              },
            }}>
              {t("TradingPairs")}
          </Button>
       </Grid>
       <Grid item>
          <Button
            variant={activeTab === "Arbitrage Matrix" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveTab("Arbitrage Matrix")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              backgroundColor: activeTab === "Arbitrage Matrix" ? "#1e88e5" : undefined,
              color: activeTab === "Arbitrage Matrix" ? "#fff" : undefined,
              "&:hover": {
                backgroundColor: activeTab === "Arbitrage Matrix" ? "#1565c0" : undefined,
              },
            }}>
              {t("ArbitrageMatrix")}
          </Button>
        </Grid>
      </Grid>

      {activeTab === "Trading Pairs" ? (
        <>
          {/* Exchange dropdown */}
          <Grid
            container
            spacing={2}
            alignItems="center" 
            sx={{ mb: 2 }}
          >
            <Grid item>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '0.9rem',
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.7)'
                      : 'rgba(0, 0, 0, 0.7)',
                }}
              >
                {t("SelectExchange")}:
              </Typography>
            </Grid>
    
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Autocomplete
                  size="small"
                  options={coinGeckoExchanges || []}
                  loading={isCoinGeckoExchangesLoading}
                  getOptionLabel={(option) => option.name} 
                  value={coinGeckoExchanges?.find(ex => ex.id === selectedExchange?.id) || null}
                  onChange={(event, newValue) => {
                    handleExchangeSelect({ target: { value: newValue?.id }} as SelectChangeEvent<string>);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("SelectExchange")}
                    />
                  )}
                  sx={{ width: 200 }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Content */}
          <Box display="flex" justifyContent="space-between" gap={10}>
            <Box flex="1.6" sx={{marginTop:"5px", maxWidth:"100%"}}>
              <Paper 
                elevation={3} 
                sx={(theme) => ({
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: alpha(
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                    0.9
                  ),
                })}>
                 {selectedExchange && (
                   <>
                     <Typography
                       variant="h6"
                       sx={{
                         color: (theme) =>
                           theme.palette.mode === 'dark'
                             ? 'rgba(255, 255, 255, 0.9)'
                             : 'rgba(0, 0, 0, 0.9)',
                       }}
                     >
                      {t("ModelTradeon")} {selectedExchange.name}
                     </Typography>
                  </>)}

                 <TableContainer
                   component={Paper}
                   sx={{ width: "100%", backgroundColor: 'transparent' }}
                   elevation={0}
                 >
                   <Table sx={{ tableLayout: "fixed",  '& td, & th': { border: 'none' } }}>
                     <TableHead>
                       <TableRow>
                         
                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, width: "15%", color: textColor, }}>
                           {t("TradingPair")}
                         </TableCell>
         
                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`,width: "13%", color: textColor }}>
                           {t("TradeType")}
                         </TableCell>
         
                         <TableCell
                           sx={{
                             borderBottom: `1px solid ${borderColor}`,
                             width: "16%",
                             paddingLeft: "45px",
                             color: textColor,
                             fontWeight: "bold",
                           }}
                         >
                           <Box sx={{ display: "flex", alignItems: "center" }}>
                             {`${tradeData.symbol ? tradeData.symbol.toUpperCase() + " to" : ""} ${tradeData.action === "buy" ? "Buy" : "Sell"}`}
                             
                             {isSwitchIncluded ? (
                                 <Box sx={{ ml: 1, marginTop:"5px" }}>
                                   <LockIcon sx={{ color: "#ffa600", fontSize: 16 }} />
                                 </Box>
                               ) : (
                                 <Box sx={{ ml: 1, marginTop:"5px" }}>
                                   <EditIcon sx={{ color: theme.palette.mode === 'light' ? "black" : "white", fontSize: "16px"}} />
                                 </Box>
                             )}
                           </Box>
                         </TableCell>
         
                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`,fontWeight: "bold", color: textColor, width: "10%" }}>
                           {t("SwitchCryptoInput")}
                         </TableCell>
         
                         <TableCell
                           sx={{
                             borderBottom: `1px solid ${borderColor}`,
                             width: "13%",
                             color: textColor,
                             fontWeight: "bold",
                           }}
                         >
                           <Box sx={{ display: "flex", alignItems: "center", marginLeft: "4px" }}>
                             {`${tradeData.mkt ? tradeData.mkt.split("/")[1] + " to" : ""} ${tradeData.action === "buy" ? "Spend" : "Receive"}`}
         
                             {!isSwitchIncluded ? (
                               
                                <Box sx={{ ml: 1, marginTop:"5px" }}>
                                   <LockIcon sx={{ color: "#ffa600", fontSize: 16 }} />
                                 </Box>
                               ) : (
                                 <Box sx={{ ml: 1, marginTop:"5px" }}>
                                   <EditIcon sx={{ color: theme.palette.mode === 'light' ? "black" : "white", fontSize: 16 }} />
                                 </Box>
                             )}
                           </Box>
                         </TableCell>
                         
                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor, width:"12%"}}>
                           {t("Exchange")}
                         </TableCell>

                       </TableRow>
                     </TableHead>
                     <TableBody>
                       <TableRow>

                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor}}> 
                           <FormControl size="small" sx={{ minWidth: 100 }}>
                             <Autocomplete
                               size="small"
                               options={tradingPairs}
                               disabled={!selectedExchange}
                               getOptionLabel={(option) => option.pair} 
                               loading={isTradingPairsLoading}
                               value={tradingPairs.find(x => x.pair == tradeData.mkt) || null}
                               onChange={(event, newValue) => {
                                 handleTradingPairSelect(newValue?.pair || null);
                               }}
                               renderInput={(params) => (
                                 <TextField
                                   {...params}
                                   placeholder={t("SelectTradingPair")}
                                 />
                               )}
                               sx={{ width: 200 }}
                             />
                           </FormControl>
                         </TableCell>
                          
                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                           <Box
                             sx={{
                               width: "90%",
                               height: 30,
                               borderRadius: "4px",
                               overflow: "hidden",
                               display: "flex",
                               userSelect: "none",
                               cursor: tradeData.symbol ? "pointer" : "not-allowed",
                               opacity: tradeData.symbol ? 1 : 0.5,
                               border: `1px solid ${borderColor}`,
                               pointerEvents: tradeData.symbol ? "auto" : "none", 
                             }}
                             onClick={() => {
                               if (!tradeData.symbol) return; 
                               setTradeData({
                                 ...tradeData,
                                 action: tradeData.action === "buy" ? "sell" : "buy",
                               });
                             }}
                           >
                             <Box
                               sx={{
                                 flex: 1,
                                 backgroundColor: tradeData.action === "buy" ? "green" : "transparent",
                                 color: tradeData.action === "buy" ? "white" : textColor,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 fontSize: "12px",
                                 fontWeight: "bold",
                                 transition: "0.3s",
                               }}
                             >
                               {t("Buy")} {tradeData.symbol?.toUpperCase() || ""}
                             </Box>
                             <Box
                               sx={{
                                 flex: 1,
                                 backgroundColor: tradeData.action === "sell" ? "red" : "transparent",
                                 color: tradeData.action === "sell" ? "white" : textColor,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 fontSize: "12px",
                                 fontWeight: "bold",
                                 transition: "0.3s",
                               }}
                             >
                               {t("Sell")} {tradeData.symbol?.toUpperCase() || ""}
                             </Box>
                           </Box>
                         </TableCell>

                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, paddingLeft: "40px" }}>
                           {isSwitchIncluded ? (
                           <Box
                             sx={{
                               height: "36px",
                               padding: "8px",
                               color: "gray",
                               textAlign: "center",
                               fontWeight: "bold",
                               backgroundColor: isDarkMode ? "#373737" : "#e0e0e0",
                               borderRadius: "8px",
                               border: `1px solid ${borderColor}`,
                               display: "flex",
                               alignItems: "center",
                               justifyContent: "center",
                               userSelect: "none",
                               cursor: "default",
                             }}
                           >
                             {tradeData.qty || ""}
                           </Box>
                         ) : (
                           <TextField
                             disabled={!tradeData.symbol}
                             value={
                               tradeData.qty === "0" || tradeData.qty === "" 
                                 ? "" 
                                 : tradeData.qty.startsWith(".") 
                                   ? `0${tradeData.qty}` 
                                   : tradeData.qty
                             }
                             onChange={(e) => {
                               const rawValue = e.target.value.replace(/,/g, "");
                               if (/^(\d+)?(\.\d*)?$/.test(rawValue) || rawValue === "") {
                                 setTradeData((prev) => ({ ...prev, qty: rawValue }));
                               }
                             }}
                             placeholder={`Input ${tradeData.symbol?.toUpperCase() || ""} Qty`}
                             variant="outlined"
                             sx={{
                               input: { height: "20px", padding: "8px" },
                               fieldset: { borderRadius: "8px" },
                             }}
                             autoComplete="off"
                           />
                         )}
                         </TableCell>

                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                             <Button
                                 variant="contained"
                                 disabled={!tradeData.symbol}
                                 onClick={handleSwitchClick}
                                 sx={{
                                   width:"100%",
                                   backgroundColor: "#f59e0b",
                                   fontWeight: "bold",
                                   "&:hover": { backgroundColor: "#d97706" },
                                 }}
                               >
                                 <SwapHorizIcon />
                             </Button>
                         </TableCell>
           
                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                           {!isSwitchIncluded ? (
                             <Box
                               tabIndex={-1}
                               sx={{
                                 height: "36px",
                                 padding: "8px",
                                 color: "gray",
                                 textAlign: "center",
                                 fontWeight: "bold",
                                 backgroundColor: isDarkMode ? "#373737" : "#e0e0e0",
                                 borderRadius: "8px",
                                 border: `1px solid ${borderColor}`,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 userSelect: "none",
                                 cursor: "default",
                               }}
                             >
                               {tradeData.value || ""}
                             </Box>
                           ) : (
                             <TextField
                               disabled={!tradeData.symbol || !isSwitchIncluded}
                               value={isSwitchIncluded
                                 ? (manualValueInput === "0" || manualValueInput === ""
                                     ? ""
                                     : manualValueInput.startsWith(".")
                                     ? `0${manualValueInput}`
                                     : manualValueInput)
                                 : (tradeData.value === "0" || tradeData.value === ""
                                     ? ""
                                     : tradeData.value.startsWith(".")
                                     ? `0${tradeData.value}`
                                     : tradeData.value)
                               }
                               onChange={(e) => {
                                 const raw = e.target.value.replace(/,/g, "");
                                 if (/^(\d+)?(\.\d*)?$/.test(raw) || raw === "") {
                                   if (isSwitchIncluded) {
                                     setManualValueInput(raw);
                                     setTradeData(prev => ({ ...prev, value: raw }));
                                   }
                                 }
                               }}
                               onBlur={() => {
                                 if (isSwitchIncluded) {
                                   setTradeData(prev => ({ ...prev, value: manualValueInput }));
                                 }
                               }}
                               placeholder={
                                 isSwitchIncluded
                                   ? `Input ${tradeData.mkt?.split("/")[1]?.toUpperCase() || ""} Qty`
                                   : ""
                               }
                               variant="outlined"
                               sx={{
                                 input: { height: "20px", padding: "8px" },
                                 fieldset: { borderRadius: "8px" },
                                 textAlign: "center",
                               }}
                               autoComplete="off"
                             />
                           )}
                         </TableCell>

                         <TableCell sx={{ borderBottom: `1px solid ${borderColor}`}}>
                           <Tooltip title={`${t("Trade")} on ${selectedExchange?.name}`} arrow>
                             <a
                               href={selectedExchange?.url || ""}
                               target="_blank"
                               rel="noopener noreferrer"
                               style={{ textDecoration: "none", pointerEvents: !tradeData.symbol ? "none" : "auto", }}
                             >
                             <Button
                               variant="outlined"
                               disabled={!tradeData.symbol}
                               sx={{
                                 textTransform: "none",
                                 fontWeight: "bold",
                                 borderRadius: "4px",
                                  ...(tradeData.symbol && {
                                   backgroundColor: "rgb(3, 169, 244)",
                                   "&:hover": { backgroundColor: "rgb(6, 120, 172)", borderColor: "#45a049" },
                                 }),
                                 color: "white",
                               }}
                               endIcon={<NorthEastIcon />}
                             >
                               {t("TradeOn")} {selectedExchange?.name}
                             </Button>
                             </a>
                           </Tooltip>
                         </TableCell>
                      </TableRow>
                    </TableBody>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ padding: "16px 24px" }}>
                        {tradeData.qty && tradeData.value && tradeData.symbol && tradeData.mkt && tradeData.action && (
                          <Box
                          tabIndex={-1}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "8px",
                              padding: "10px 16px",
                              fontWeight: "bold",
                              backgroundColor: isDarkMode
                                      ? "#0a1e2c"
                                      : "#e0e0e0", 
                              position: "relative",
                              userSelect: "none",
                              cursor: "default",
                            }}
                          >
                            <Box
                            tabIndex={-1}
                              sx={{
                                width: "6px",
                                height: "100%",
                                borderRadius: "4px 0 0 4px",
                                backgroundColor: tradeData.action === "buy" ? "#4caf50" : "#f44336",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                userSelect: "none",
                                cursor: "default",
                              }}
                            />
          
                            <Box sx={{ marginLeft: "12px" }}>
                              <div style={{ marginBottom: "4px", color: tradeData.action === "buy" ? "#4caf50" : "#f44336" }}>
                                {t("Transaction")}:
                              </div>
                              <div>
                                {tradeData.action === "buy"
                                  ? `Buy ${tradeData.qty} ${tradeData.symbol.toUpperCase()} → Spend ~${tradeData.value} ${tradeData.mkt.split("/")[1]}`
                                  : `Sell ${tradeData.qty} ${tradeData.symbol.toUpperCase()} → Receive ~${tradeData.value} ${tradeData.mkt.split("/")[1]}`}
                              </div>
                            </Box>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                   </Table>
                 </TableContainer>
              </Paper>    
            </Box>
          </Box>

          {selectedExchange && (    
            <Paper 
              elevation={3} 
              sx={(theme) => ({
                borderRadius: 2,
                marginTop: 1,
                p: 2,
                backgroundColor: alpha(
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                  0.9
                ),
              })}>
                <Typography variant="h6" gutterBottom>
                  {t("TopTradingPairsOn")} {selectedExchange.name}
                </Typography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    backgroundColor: 'transparent', 
                  }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Pair</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Volume</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topTradingPairs.map((pair) => (
                          <TableRow key={pair.pair}>
                            <TableCell>{pair.pair}</TableCell>
                            <TableCell>${pair.last.toLocaleString()}</TableCell>
                            <TableCell>${formatVolume(pair.volume)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleTopPairClick(pair)}
                              >
                                Model Trade
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </TableContainer>
            </Paper>)
          }
        </>   
      ) 
      :  
      (
        <Typography sx={{ fontSize: "20px", height: "20%" }}> Coming soon...</Typography>
      )}
     </Grid>
    </Box>
  );
}
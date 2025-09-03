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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SwapVertIcon from '@mui/icons-material/SwapVert';
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
      
      <Grid item container spacing={2} sx={{ marginBottom: 2 }}>
                 <Grid item>
           <Button
             variant={activeTab === "Trading Pairs" ? "contained" : "outlined"}
             color="primary"
             onClick={() => setActiveTab("Trading Pairs")}
             startIcon={<SwapVertIcon sx={{ 
               color: activeTab === "Trading Pairs" ? "#fff" : undefined 
             }} />}
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
             startIcon={<TrendingUpIcon />}
             sx={{
               textTransform: "none",
               fontWeight: 500,
               fontSize: "0.875rem",
               backgroundColor: activeTab === "Arbitrage Matrix" ? "#1e88e5" : undefined,
               color: activeTab === "Arbitrage Matrix" ? "#fff" : undefined,
               "&:hover": {
                 backgroundColor: activeTab === "Arbitrage Matrix" ? "#1e88e5" : undefined,
               },
             }}>
               {t("ArbitrageMatrix")}
           </Button>
         </Grid>
      </Grid>

      {activeTab === "Trading Pairs" ? (
        <>
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

           <Box display="flex">
             <Box flex="1.6" sx={{ maxWidth:"100%"}}>
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
                         marginBottom:"10px",
                          color: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.9)'
                              : 'rgba(0, 0, 0, 0.9)',
                        }}
                      >
                       {t("ModelTradeon")} {selectedExchange.name}
                      </Typography>
                   </>)}

                  <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", overflow: "auto" }}>
                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "180px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem', fontWeight: 500 }}>
                         {t("TradingPair")}
                       </Typography>
                       <FormControl size="small" sx={{ minWidth: 180 }}>
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
                         />
                       </FormControl>
                     </Box>

                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "200px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem', fontWeight: 500 }}>
                         {t("TradeType")}
                       </Typography>
                       <Box
                          sx={{
                            height: "37px",
                            borderRadius: "6px",
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
                     </Box>

                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "190px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem',}}>
                         {`${tradeData.symbol ? tradeData.symbol.toUpperCase() + " to" : ""} ${tradeData.action === "buy" ? "Buy" : "Sell"}`}
                         {isSwitchIncluded ? (
                           <LockIcon sx={{ color: "#ffa600", fontSize: 16, ml: 1 }} />
                         ) : (
                           <EditIcon sx={{ color: theme.palette.mode === 'light' ? "black" : "white", fontSize: "16px", ml: 1 }} />
                         )}
                       </Typography>
                         {isSwitchIncluded ? (
                          <Box
                            sx={{
                              height: "37px",
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
                             input: { height: "20px", padding: "0 12px" },
                             fieldset: { borderRadius: "8px" },
                             "& .MuiOutlinedInput-root": { height: "37px" }
                           }}
                           autoComplete="off"
                         />
                       )}
                     </Box>

                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "190px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem', }}>
                         {t("SwitchCryptoInput")}
                       </Typography>
                       <Button
                         variant="contained"
                         disabled={!tradeData.symbol}
                         onClick={handleSwitchClick}
                         sx={{
                           width: "auto",
                           height: "37px",
                           backgroundColor: "#f59e0b",
                           fontWeight: "bold",
                           borderRadius: "6px",
                           "&:hover": { backgroundColor: "#d97706" },
                         }}
                       >
                         <SwapHorizIcon />
                       </Button>
                     </Box>

                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "190px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem',}}>
                         {`${tradeData.mkt ? tradeData.mkt.split("/")[1] + " to" : ""} ${tradeData.action === "buy" ? "Spend" : "Receive"}`}
                         {!isSwitchIncluded ? (
                           <LockIcon sx={{ color: "#ffa600", fontSize: 16, ml: 1 }} />
                         ) : (
                           <EditIcon sx={{ color: theme.palette.mode === 'light' ? "black" : "white", fontSize: 16, ml: 1 }} />
                         )}
                       </Typography>
                         {!isSwitchIncluded ? (
                          <Box
                            sx={{
                              height: "37px",
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
                             input: { height: "20px", padding: "0 12px" },
                             fieldset: { borderRadius: "6px" },
                             textAlign: "center",
                             "& .MuiOutlinedInput-root": { height: "37px" }
                           }}
                           autoComplete="off"
                         />
                       )}
                     </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "180px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem'}}>
                         {t("Exchange")}
                       </Typography>
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
                              borderRadius: "6px",
                              height: "37px",
                               ...(tradeData.symbol && {
                                backgroundColor: "#1e88e5",
                                "&:hover": { backgroundColor: "#1e88e5", },
                              }),
                              color: "white",
                            }}
                           endIcon={<NorthEastIcon />}
                         >
                           {t("TradeOn")} {selectedExchange?.name}
                         </Button>
                         </a>
                       </Tooltip>
                     </Box>
                   </Box>

                   {tradeData.qty && tradeData.value && tradeData.symbol && tradeData.mkt && tradeData.action && (
                     <Box
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
                         marginTop: 2,
                         width: "100%",
                       }}
                     >
                       <Box
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
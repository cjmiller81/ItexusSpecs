import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  Box,
  Tooltip,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfirmTransactionDialog } from './ConfirmTransactionDialog';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { MarketData, fetchExchanges, getAccountBalance, getTradablePairs, resetAccountBalance, nativeBarSx, useAppDispatch, useAppSelector } from 'components';

interface TradeData {
  symbol: string;
  mkt: string;
  qty: string;
  value: string;
  action: string;
}

export function TradeTable() {
  const [tradeData, setTradeData] = useState<TradeData>({
    symbol: '',
    mkt: '',
    qty: '0',
    value: '',
    action: '',
  });
  const [showMarketSelector, setShowMarketSelector] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [crossPairWarning, setCrossPairWarning] = useState<string | null>(null);
  const [selectedCEX, setSelectedCEX] = useState('');
  const { t } = useTranslation(["TradeTable"]);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const dispatch = useAppDispatch()
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const { exchanges } = useAppSelector( state => state.wallets)
  const balance = useAppSelector((state) => state.kraken.balance);
  const marketData = useAppSelector((state) => state.kraken.tradablePairs);
  const { error } = useAppSelector((state) => state.kraken);
  const [debouncedSymbol, setDebouncedSymbol] = useState('');
  const [baseSymbols, setBaseSymbols] = useState<string[]>([]);
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const isDarkMode = theme.palette.mode === "dark";
  const borderColor = theme.palette.divider;
  const hoverColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const getCrossPair = (marketPair: string): string => {
    if (!marketPair) return '';
    const parts = marketPair.split('/');
    return parts.length > 1 ? parts[1] : '';
  };

  const handleSendClick = () => {
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
      dispatch(fetchExchanges(null))
    }, [dispatch])

  useEffect(() => {
    return () =>{
      dispatch(resetAccountBalance());
    };
  },[])
    
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSymbol(tradeData.symbol);
    }, 150); 
    setTradeData((prev) => ({
      ...prev,
      mkt: '',
    }));
    return () => clearTimeout(timer);
  }, [tradeData.symbol]);

  useEffect(() => {
    if (debouncedSymbol.length < 3) {
      return;
    }
    
    dispatch(getTradablePairs(debouncedSymbol));
    setShowMarketSelector(true);
  }, [debouncedSymbol, dispatch]);

  useEffect(() => {
    if (!tradeData.mkt) {
      setSelectedPositions([]);
      setCrossPairWarning(null);
      return;
    }

    const crossPair = getCrossPair(tradeData.mkt);
    const matchingPosition = balanceData.find(position => position.asset === crossPair);

    if (matchingPosition) {
      setSelectedPositions([matchingPosition.asset]);
      setCrossPairWarning(null);
    } else {
      setSelectedPositions([]);
      setCrossPairWarning(
        t("PleaseSelectDifferentMarket")
      );
    }
  }, [tradeData.mkt]);

  useEffect(() => {
    if (!tradeData.mkt || !tradeData.qty) {
      setTradeData((prev) => ({ ...prev, value: '' }));
      setInsufficientFunds(false);
      return;
    }
  
    const selectedMarket = marketData.find((market) => market.displayName === tradeData.mkt);
    if (!selectedMarket) {
      setTradeData((prev) => ({ ...prev, value: '' }));
      setInsufficientFunds(false);
      return;
    }
  
    const price = parseFloat(selectedMarket.price);
    const qty = parseFloat(tradeData.qty.replace(/,/g, ''));
  
    if (isNaN(price) || isNaN(qty)) {
      setTradeData((prev) => ({ ...prev, value: '' }));
      setInsufficientFunds(false);
      return;
    }
  
    const calculatedValue = price * qty;
    const formattedValue = calculatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    setTradeData((prev) => ({ ...prev, value: formattedValue }));
    
    const crossPair = getCrossPair(tradeData.mkt);

    const position = balanceData.find((pos) => pos.asset?.toLowerCase() === crossPair?.toLowerCase());

    const positionSell = balanceData.find(
      (pos) => pos.asset?.toLowerCase() === tradeData.symbol?.toLowerCase()
    );

    if ( tradeData.action === 'sell') {
      if (positionSell === undefined) {
        setInsufficientFunds(true);
      } else {
        setInsufficientFunds(parseFloat(tradeData.qty) > parseFloat(positionSell.balance.replace(/,/g, '')));
      }
    }     
    else if ( tradeData.action === 'buy') {
      if (!position) {
        setInsufficientFunds(true);
      } else {
        setInsufficientFunds(calculatedValue > parseFloat(position.balance.replace(/,/g, '')));
      }
    } else {
      setInsufficientFunds(false);
    }
  }, [tradeData.mkt, tradeData.qty, tradeData.action, tradeData.symbol]);

  const handleCEXSelect = (event: SelectChangeEvent<string>) => {
    const selectedCEXValue = event.target.value;
    setSelectedCEX(selectedCEXValue);

    if (selectedCEXValue) {
      fetchBalance();
    }
  };

  const fetchBalance = async () => {
    try {
      dispatch(getAccountBalance());
    } catch (error) {
      console.error('Failed to fetch Kraken balance:', error);
    }
  };

  useEffect(() => {
    if (balance && typeof balance === 'object') {
      const formattedData = Object.entries(balance).map(([asset, amount]) => {
        const formattedAmount = parseFloat(amount.toString()).toFixed(10).replace(/\.?0+$/, '');
        return {
          asset,
          balance: formattedAmount,
        };
      });

      setBalanceData(formattedData);

      const extractedBaseSymbols = formattedData.map((position) => position.asset);
      setBaseSymbols(extractedBaseSymbols);
    }
  }, [balance]);
  
  const handleMarketSelect = (market: string) => {
    setTradeData({ ...tradeData, mkt: market });
  };

  return (
    <Box>
    <Typography variant="h4" sx={{  marginBottom: 2 }}>
        {t("CEX")}: {selectedCEX ? selectedCEX : ''}
    </Typography>
    <Box display="flex" justifyContent="space-between" gap={10}>
      <Box display="flex" flexDirection="column" gap={2}sx={{ minWidth: 200, maxWidth:"20%" }}>
        <Box>
          <Select
            value={selectedCEX}
            onChange={handleCEXSelect}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "+ ADD SAVED CEX")}
            sx={{
              backgroundColor: "#109EEF",
              fontSize: "11px",
              width: "58%",
              maxHeight: "40px",
              marginBottom: "12px",
            }}
          >
            {exchanges?.map((cex) => (
              <MenuItem key={cex.exchange_id} value={cex.name}>
                {cex.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box flex="0.6">
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              fontWeight: 500,
            }}
          >
            {t("CurrentPosition")}
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ width: "100%", boxShadow: 3 }}
          >
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                <TableCell
                  sx={{ borderBottom: `1px solid ${borderColor}`, width: "50%", color: textColor }}
                >
                  {t("Symbol")}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: `1px solid ${borderColor}`, width: "50%", color: textColor }}
                >
                  {t("Qty")}
                </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceData.map((position) => {
                  const isSelected = selectedPositions.includes(position.asset);

                  return (
                    <TableRow
                      key={position.asset}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPositions((prev) => prev.filter((p) => p !== position.asset));
                        } else {
                          setSelectedPositions((prev) => [...prev, position.asset]);
                        }
                      }}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)"
                          : "transparent",
                        transition: "background-color 0.3s",
                        "&:hover": {
                          backgroundColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.05)", 
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`, 
                        }}
                      >
                        {position.asset}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                        }}
                      >
                        {position.balance}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </Box>

      <Box flex="1.6" sx={{marginTop:"65px"}}>
        <Typography
          variant="h6"
          sx={{
            marginBottom: 2,
            fontWeight: 500,
          }}
        >
          {t("NewPosition")}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", boxShadow: 3 }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, width: "17%", color: textColor }}>
                  {t("Symbol")}
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, width: "15%", color: textColor }}>
                  {t("MKT")}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: `1px solid ${borderColor}`, width: "21%", paddingLeft: "40px", color: textColor }}
                >
                  {t("Qty")}
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                  {t("Value")}
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                  {t("Trade")}
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                  {t("Action")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor}}>
                  <TextField
                    value={tradeData.symbol}
                    onChange={(e) => setTradeData({ ...tradeData, symbol: e.target.value })}
                    variant="outlined"
                    fullWidth
                    sx={{
                      input: { height: "20px", padding: "8px" },
                      fieldset: { borderRadius: "8px" },
                    }}
                    autoComplete="off"
                  />
                </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor, paddingRight: "20px" }}>
                <Tooltip title={t("ExchangeTradePairs")} arrow>
                <Button
                  onClick={() => setShowMarketSelector(!showMarketSelector)}
                  endIcon={showMarketSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",
                    borderBottom: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    padding: "0 0 5px 0",
                    minWidth: "130px",
                    justifyContent: "flex-start",
                    color: textColor,
                  }}
                >
                  {tradeData.mkt || "Select Market"}
                </Button>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, paddingLeft: "40px" }}>
                <TextField
                  value={tradeData.qty}
                  onChange={(e) => {
                    let rawValue = e.target.value.replace(/,/g, "");
                    if (/^\d*\.?\d*$/.test(rawValue)) {
                      setTradeData((prev) => ({ ...prev, qty: rawValue }));
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    input: { height: "20px", padding: "8px" },
                    fieldset: { borderRadius: "8px" },
                  }}
                />
              </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                <TextField
                      value={tradeData.value && tradeData.value !== "0" ? tradeData.value : "--"}
                  disabled
                  variant="standard"
                  sx={{
                    "&:before": { borderBottom: `1px solid ${borderColor}`},
                  }}
                />
              </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
              <Select
                value={tradeData.action}
                onChange={(e) => setTradeData({ ...tradeData, action: e.target.value })}
                displayEmpty
                variant="standard"
                sx={{
                  color: textColor,
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: "bold",
                  "&:before": { borderBottom: `1px solid ${borderColor}` },
                }}
              >
                <MenuItem value="" disabled sx={{ color: textColor }}>
                  {t("Select")}
                </MenuItem>
                <MenuItem value="buy" sx={{ color: textColor }}>
                  {t("Buy")}
                </MenuItem>
                <MenuItem value="sell" sx={{ color: textColor }}>
                  {t("Sell")}
                </MenuItem>
              </Select>
              </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}`}}>
                <Tooltip title={t("SendTradeExchange")} arrow>
                  <Button
                    variant="contained"
                    disabled={!tradeData.mkt || !tradeData.action || crossPairWarning !== null || insufficientFunds === true}
                    onClick={handleSendClick}
                    sx={{
                      backgroundColor: "#4caf50",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#45a049" },
                    }}
                  >
                    {t("SEND")}
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

        <ConfirmTransactionDialog
                  open={confirmDialogOpen}
                  onClose={() => setConfirmDialogOpen(false)}
                  tradeData={tradeData}
                  selectedCEX={selectedCEX}
                />

        {(crossPairWarning || insufficientFunds) && (
          <Typography
            sx={{
              color: '#ff4d4d',
              marginBottom: 2,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {crossPairWarning || insufficientFunds ? (
              insufficientFunds ? t("WarningInsufficientFunds") : crossPairWarning
            ) : null}
          </Typography>
        )}

        {showMarketSelector && (
          <TableContainer component={Paper} sx={{ marginBottom: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, width: "50%", color: textColor }}>
                    {t("MKT")}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, width: "50%", color: textColor }}>
                    {t("Price")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tradeData.symbol.length < 3 ? (
                  <></> 
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: "center", color: "red" }}>
                      {t("EnteredSymbolNotExist")}
                    </TableCell>
                  </TableRow>
                ) : (
                  marketData.map((market: MarketData) => {
                    const crossPair = getCrossPair(market.displayName);
                    const isHighlighted = baseSymbols.includes(crossPair);

                    return (
                      <TableRow
                        key={market.pairName}
                        onClick={() => handleMarketSelect(market.displayName)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: hoverColor,
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: isHighlighted ? "rgb(0, 150, 255)" : textColor,
                            borderBottom: `1px solid ${borderColor}`,
                          }}
                        >
                          {market.displayName}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                          {market.price}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
    </Box>
  );
}
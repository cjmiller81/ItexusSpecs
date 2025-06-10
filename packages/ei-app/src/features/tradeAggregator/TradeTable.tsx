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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { MarketData, fetchExchanges, getAccountBalance, getTradablePairs, resetAccountBalance, nativeBarSx, useAppDispatch, useAppSelector, postPlaceOrder, resetPlaceOrderResponseError } from 'components';
import { makeId } from '@/utils/utils';
import { PlaceOrderResponseDialog } from './PlaceOrderResponseDialog';

interface TradeData {
  symbol: string;
  mkt: string;
  qty: string;
  value: string;
  action: string;
}

interface OrderRequest {
  marketSymbol: string,
  amount: number,
  price: number,
  stopPrice: number,
  isBuy: boolean,
  isMargin: boolean,
  orderId: string,
  clientOrderId: string,
  shouldRoundAmount: boolean,
  orderType: number,
  isPostOnly: boolean
}

export function TradeTable() {
  const [tradeData, setTradeData] = useState<TradeData>({
    symbol: '',
    mkt: '',
    qty: '0',
    value: '',
    action: 'buy',
  });
  const [showMarketSelector, setShowMarketSelector] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [crossPairWarning, setCrossPairWarning] = useState<string | null>(null);
  const [selectedCEX, setSelectedCEX] = useState('');
  const { t } = useTranslation(["TradeTable"]);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [placeOrderResultDialogOpen, setPlaceOrderResultDialogOpen] = useState(false);
  const dispatch = useAppDispatch()
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const { exchanges } = useAppSelector(state => state.wallets)
  const balance = useAppSelector((state) => state.kraken.balance);
  const marketData = useAppSelector((state) => state.kraken.tradablePairs);
  const { error, placeOrderError } = useAppSelector((state) => state.kraken);
  const placeOrderResponse = useAppSelector((state) => state.kraken.placeOrderResponse)
  const [debouncedSymbol, setDebouncedSymbol] = useState('');
  const [baseSymbols, setBaseSymbols] = useState<string[]>([]);
  const shouldShowSendButton = false;
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
    return () => {
      dispatch(resetAccountBalance());
    };
  }, [])

  useEffect(() => {
    if (placeOrderResponse != null || placeOrderError != null) {
      setConfirmDialogOpen(false);
      setPlaceOrderResultDialogOpen(true);
    }

  }, [placeOrderResponse, placeOrderError])

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

    dispatch(getTradablePairs(debouncedSymbol.toUpperCase()));
    setShowMarketSelector(true);
  }, [debouncedSymbol, dispatch]);

  useEffect(() => {
    if (!tradeData.mkt) {
      setSelectedPositions([]);
      setCrossPairWarning(null);
      return;
    }

    const crossPair = getCrossPair(tradeData.mkt);
    const matchingPosition = balanceData.find(position => position.asset.toLowerCase() === crossPair.toLowerCase());
    
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

    if (tradeData.action === 'sell') {
      if (positionSell === undefined) {
        setInsufficientFunds(true);
      } else {
        setInsufficientFunds(parseFloat(tradeData.qty) > parseFloat(positionSell.balance.replace(/,/g, '')));
      }
    }
    else if (tradeData.action === 'buy') {
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

  const onConfirmTransaction = () => {
    let orderRequest: OrderRequest = {
      isMargin: false,
      orderId: "",
      orderType: 1,
      isPostOnly: false,
      clientOrderId: makeId(10),
      marketSymbol: tradeData.mkt.replace("/", ""),
      amount: Number.parseFloat(tradeData.qty),
      isBuy: tradeData.action === "buy",
      price: 0,
      stopPrice: 0,
      shouldRoundAmount: true
    }
    dispatch(postPlaceOrder(orderRequest));
  }

  const onClosePlaceOrderResponseDialog = () => {
    setPlaceOrderResultDialogOpen(false);
    dispatch(resetPlaceOrderResponseError())
  }

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
                  {t("SearchForSymol")}
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, width: "15%", color: textColor }}>
                  {t("TradingPair")}
                </TableCell>

                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                  {t("TradeType")}
                </TableCell>

                <TableCell
                  sx={{
                    borderBottom: `1px solid ${borderColor}`,
                    width: "21%",
                    paddingLeft: "40px",
                    color: textColor,
                    fontWeight: "bold",
                  }}
                >
                  {`${tradeData.symbol ? tradeData.symbol.toUpperCase() + " to" : ""} ${tradeData.action === "buy" ? "Buy" : "Sell"}`}
                </TableCell>

                <TableCell
                  sx={{
                    borderBottom: `1px solid ${borderColor}`,
                    color: textColor,
                    fontWeight: "bold",
                  }}
                >
                  {`${tradeData.mkt ? tradeData.mkt.split("/")[1] + " to" : ""} ${tradeData.action === "buy" ? "Spend" : "Receive"}`}
                </TableCell>
                
                {/* <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                  {t("Action")}
                </TableCell> */}
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}`, color: textColor }}>
                  {t("Exchange")}
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
                    minWidth: "130px",
                    color: textColor,
                    display: "flex",    
                    alignItems: "center",
                  }}
                >
                  {tradeData.mkt || "Select Market"}
                </Button>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                <Box
                  sx={{
                    width: 130,
                    height: 30,
                    borderRadius: "4px",
                    overflow: "hidden",
                    display: "flex",
                    userSelect: "none",
                    cursor: "pointer",
                    border: `1px solid ${borderColor}`,
                  }}
                  onClick={() =>
                    setTradeData({
                      ...tradeData,
                      action: tradeData.action === "buy" ? "sell" : "buy",
                    })
                  }
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
                <TextField
                  value={tradeData.qty}
                  onChange={(e) => {
                    let rawValue = e.target.value.replace(/,/g, "");
                    if (/^\d*\.?\d*$/.test(rawValue)) {
                      setTradeData((prev) => ({ ...prev, qty: rawValue }));
                    }
                  }}
                  variant="outlined"
                  
                  sx={{
                    input: { height: "20px", padding: "8px" },
                    fieldset: { borderRadius: "8px" },
                  }}
                />
              </TableCell>

              <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                <Box
                tabIndex={-1}
                  sx={{
                    height: "36px",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: isDarkMode
                            ? "#373737"
                            : "#e0e0e0", 
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
              </TableCell>

              {shouldShowSendButton && (
                <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                  <Tooltip title={t("SendTradeExchange")} arrow>
                    <Button
                      variant="contained"
                      disabled={
                        !tradeData.mkt ||
                        !tradeData.action ||
                        crossPairWarning !== null ||
                        insufficientFunds === true
                      }
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
              )}
              <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }}>
                <Tooltip title={`${t("Trade")} on Kraken`} arrow>
                  <a
                    href="https://id.kraken.com/sign-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      backgroundColor:"rgb(3, 169, 244)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgb(6, 120, 172)",
                        borderColor: "#45a049",
                      },
                    }}
                    endIcon={<NorthEastIcon />}
                  >
                    {t("TradeOn")} Kraken
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

          <ConfirmTransactionDialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            tradeData={tradeData}
            selectedCEX={selectedCEX}
            onConfirmTransaction={onConfirmTransaction}
          />

          <PlaceOrderResponseDialog
            open={placeOrderResultDialogOpen}
            onClose={onClosePlaceOrderResponseDialog}
            response={placeOrderResponse}
            errors={placeOrderError}
            t={t}
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
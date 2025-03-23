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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfirmTransactionDialog } from './ConfirmTransactionDialog';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { MarketData, fetchExchanges, getAccountBalance, getTradablePairs, resetAccountBalance, nativeBarSx, useAppDispatch, useAppSelector, postPlaceOrder } from 'components';
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
    action: '',
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
  const { error } = useAppSelector((state) => state.kraken);
  const placeOrderResponse = useAppSelector((state) => state.kraken.placeOrderResponse)
  const [debouncedSymbol, setDebouncedSymbol] = useState('');
  const [baseSymbols, setBaseSymbols] = useState<string[]>([]);

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
    console.log("refresh response")
    if (placeOrderResponse !== null || error != null) {
      setConfirmDialogOpen(false);
      setPlaceOrderResultDialogOpen(true);
    }

  }, [placeOrderResponse, error])

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

  return (
    <Box>
      <Typography variant="h4" sx={{ color: 'white', marginBottom: 2 }}>
        {t("CEX")}: {selectedCEX ? selectedCEX : ''}
      </Typography>
      <Box display="flex" justifyContent="space-between" gap={10}>
        <Box display="flex" flexDirection="column" gap={2} sx={{ minWidth: 200, maxWidth: "20%" }}>
          <Box>
            <Select
              value={selectedCEX}
              onChange={handleCEXSelect}
              displayEmpty
              renderValue={(selected) => (selected ? selected : "+ ADD SAVED CEX")}
              sx={{
                backgroundColor: "#109EEF",
                fontSize: "11px",
                color: "white",
                width: "58%",
                maxHeight: "40px",
                marginBottom: "12px",
                "& .MuiSelect-icon": { color: "white" },
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
                color: 'white',
                marginBottom: 2,
                fontWeight: 500,
              }}
            >
              {t("CurrentPosition")}
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "#1e1e1e", color: "white", width: "100%", boxShadow: 3 }}
            >
              <Table sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", width: "50%" }}
                    >
                      {t("Symbol")}
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", width: "50%" }}
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
                          backgroundColor: isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent",
                          transition: "background-color 0.3s",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
                        >
                          {position.asset}
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
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

        <Box flex="1.6" sx={{ marginTop: "67px" }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              marginBottom: 2,
              fontWeight: 500,
            }}
          >
            {t("NewPosition")}
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#1e1e1e", color: "white", width: "100%", boxShadow: 3 }}
          >
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", width: "17%" }}>
                    {t("Symbol")}
                  </TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", width: "15%" }}>
                    {t("MKT")}
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", width: "21%", paddingLeft: "40px" }}
                  >
                    {t("Qty")}
                  </TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>{t("Value")}</TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>{t("Trade")}</TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>{t("Action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <TextField
                      value={tradeData.symbol}
                      onChange={(e) => setTradeData({ ...tradeData, symbol: e.target.value })}
                      variant="outlined"
                      fullWidth
                      sx={{
                        input: { color: "white", height: "20px", padding: "8px" },
                        fieldset: { borderColor: "rgba(255, 255, 255, 0.3)", borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "white" },
                      }}
                      autoComplete="off"
                    />
                  </TableCell>

                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingRight: "20px" }}>
                    <Tooltip title={t("ExchangeTradePairs")} arrow>
                      <Button
                        onClick={() => setShowMarketSelector(!showMarketSelector)}
                        endIcon={showMarketSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        sx={{
                          color: "white",
                          textTransform: "none",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          padding: "0 0 5px 0",
                          minWidth: "130px",
                          justifyContent: "flex-start",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {tradeData.mkt || "Select Market"}
                      </Button>
                    </Tooltip>
                  </TableCell>

                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingLeft: "40px" }}>
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
                        input: { color: "white", height: "20px", padding: "8px" },
                        fieldset: { borderColor: "rgba(255, 255, 255, 0.3)", borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "white" },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <TextField
                      value={tradeData.value && tradeData.value !== "0" ? tradeData.value : "--"}
                      disabled
                      variant="standard"
                      sx={{
                        input: { color: "white" },
                        "&:before": { borderBottomColor: "rgba(255, 255, 255, 0.1)" },
                        "& .MuiInputBase-input.Mui-disabled": {
                          color: "white",
                          WebkitTextFillColor: "white",
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <Select
                      value={tradeData.action}
                      onChange={(e) => setTradeData({ ...tradeData, action: e.target.value })}
                      displayEmpty
                      variant="standard"
                      sx={{
                        color: "white",
                        "&:before": { borderBottomColor: "rgba(255, 255, 255, 0.1)" },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {t("Select")}
                      </MenuItem>
                      <MenuItem value="buy">{t("Buy")}</MenuItem>
                      <MenuItem value="sell">{t("Sell")}</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <Tooltip title={t("SendTradeExchange")} arrow>
                      <Button
                        variant="contained"
                        disabled={!tradeData.mkt || !tradeData.action}
                        onClick={handleSendClick}
                        sx={{
                          backgroundColor: "#4caf50",
                          color: "white",
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
            onConfirmTransaction={onConfirmTransaction}
          />

          <PlaceOrderResponseDialog
            open={placeOrderResultDialogOpen}
            onClose={() => setPlaceOrderResultDialogOpen(false)}
            response={placeOrderResponse}
            errors={error}
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
            <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: 'white', marginBottom: 3, boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '50%' }}>
                      {t("MKT")}
                    </TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '50%' }}>
                      {t("Price")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradeData.symbol.length < 3 ? (
                    <></>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: 'center', color: 'red' }}>
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
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              color: isHighlighted ? 'rgb(0, 150, 255)' : 'white',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            {market.displayName}
                          </TableCell>
                          <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
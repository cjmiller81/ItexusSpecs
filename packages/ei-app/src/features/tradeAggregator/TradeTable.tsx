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
  Checkbox,
  Alert,
  Box,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfirmTransactionDialog } from './ConfirmTransactionDialog';

interface TradeData {
  symbol: string;
  mkt: string;
  qty: string;
  value: string;
  action: string;
}

interface MarketData {
  pair: string;
  price: string;
  change24h: string;
  volume: string;
}

interface CurrentPosition {
  id: number;
  symbol: string;
  qty: string;
}

const marketData: MarketData[] = [
  { pair: 'SOL/USD', price: '169.16', change24h: '-3.44%', volume: '36.3M' },
  { pair: 'SOL/USDT', price: '169.33', change24h: '-3.40%', volume: '3.93M' },
  { pair: 'SOL/BTC', price: '.001779', change24h: '-0.04%', volume: '2.93M' },
  { pair: 'SOL/USDC', price: '169.55', change24h: '-3.35%', volume: '4.12M' },
];

const currentPositions: CurrentPosition[] = [
  { id: 1, symbol: 'BTC', qty: '0.0050' },
  { id: 2, symbol: 'USDT', qty: '1,110.0000' },
  { id: 3, symbol: 'USD', qty: '10,000.0000' },
];

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
  const savedCEXOptions = ['Binance', 'Kraken', 'Coinbase',];
  const { t } = useTranslation(["TradeTable"]);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const getCrossPair = (marketPair: string): string => {
    if (!marketPair) return '';
    const parts = marketPair.split('/');
    return parts.length > 1 ? parts[1] : '';
  };

  const handleSendClick = () => {
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    if (!tradeData.mkt) {
      setSelectedPositions([]);
      setCrossPairWarning(null);
      return;
    }

    const crossPair = getCrossPair(tradeData.mkt);
    const matchingPosition = currentPositions.find(position => position.symbol === crossPair);
    
    if (matchingPosition) {
      setSelectedPositions([matchingPosition.id]);
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
  
    const selectedMarket = marketData.find((market) => market.pair === tradeData.mkt);
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
    const formattedValue = calculatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setTradeData((prev) => ({ ...prev, value: formattedValue }));
  
    const position = currentPositions.find(
      (pos) => pos.symbol.toLowerCase() === tradeData.symbol.toLowerCase()
    );
    
    if (tradeData.action === 'sell') {
      if (!position) {
        setInsufficientFunds(true);
      } else {
        setInsufficientFunds(calculatedValue > parseFloat(position.qty.replace(/,/g, '')));
      }
    } else {
      setInsufficientFunds(false);
    }
  }, [tradeData.mkt, tradeData.qty, tradeData.action, tradeData.symbol]);
  
  const handleMarketSelect = (market: string) => {
    setTradeData({ ...tradeData, mkt: market });
    setShowMarketSelector(false);
  };

  return (
    <Box>
    <Typography variant="h4" sx={{ color: 'white', marginBottom: 2 }}>
        {t("CEX")}: {selectedCEX ? selectedCEX : ''}
    </Typography>
    <Box display="flex" justifyContent="space-between" gap={2}>
      <Box sx={{ minWidth: 200 }}>
        <Select
          value={selectedCEX}
          onChange={(e) => setSelectedCEX(e.target.value)}
          displayEmpty
          renderValue={(selected) => (selected ? selected : "+ ADD SAVED CEX")}
          sx={{
            backgroundColor: "#109EEF",
            fontSize: "11px",
            color: "white",
            width: "98%",
            maxHeight: "40px",
            marginBottom: "12px",
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          {savedCEXOptions.map((cex) => (
            <MenuItem key={cex} value={cex}>
              {cex}
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
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: 'white', width: '100%', boxShadow: 3 }}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '15%' }}>
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '40%' }}>{t("Symbol")}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '45%' }}>{t("Qty")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPositions.map((position) => (
                <TableRow
                  key={position.id}
                  sx={{
                    backgroundColor: selectedPositions.includes(position.id) ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  }}
                >
                  <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Checkbox
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                      checked={selectedPositions.includes(position.id)}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {position.symbol}
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {position.qty}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box flex="1.6">
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
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: 'white', width: '100%', boxShadow: 3 }}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '17%' }}>{t("Symbol")}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '20%' }}>{t("MKT")}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '21%', paddingLeft: '40px' }}>{t("Qty")}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t("Value")}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t("Trade")}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{t("Action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <TextField
                    value={tradeData.symbol}
                    onChange={(e) => setTradeData({ ...tradeData, symbol: e.target.value })}
                    variant="standard"
                    sx={{
                      input: { color: 'white' },
                      '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '20px' }}>
                <Tooltip title={t("ExchangeTradePairs")} arrow>
                  <Button
                    onClick={() => setShowMarketSelector(!showMarketSelector)}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 0,
                      padding: '0 0 5px 0',
                      minWidth: '120px',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {tradeData.mkt || 'Select Market'}
                  </Button>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '40px' }}>
                <TextField
                  value={tradeData.qty}
                  onChange={(e) => {
                    let rawValue = e.target.value.replace(/,/g, '');
                    if (/^\d*\.?\d*$/.test(rawValue)) {
                      setTradeData((prev) => ({ ...prev, qty: rawValue }));
                    }
                  }}
                  variant="standard"
                  sx={{
                    input: { color: 'white' },
                    '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                />

                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <TextField
                    value={tradeData.value}
                    disabled
                    variant="standard"
                    sx={{
                      input: { color: 'white' },
                      '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
                      '& .MuiInputBase-input.Mui-disabled': {
                        color: 'white',
                        WebkitTextFillColor: 'white',
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Select
                    value={tradeData.action}
                    onChange={(e) => setTradeData({ ...tradeData, action: e.target.value })}
                    displayEmpty
                    variant="standard"
                    sx={{
                      color: 'white',
                      '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
                      '& .MuiSelect-icon': { color: 'white' },
                    }}
                  >
                    <MenuItem value="" disabled>
                    {t("Select")}
                  </MenuItem>
                    <MenuItem value="buy">{t("Buy")}</MenuItem>
                    <MenuItem value="sell">{t("Sell")}</MenuItem>
                  </Select>
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Tooltip title={t("SendTradeExchange")} arrow>
                <Button
                  variant="contained"
                  disabled={!tradeData.mkt || !tradeData.action || crossPairWarning !== null}
                  onClick={handleSendClick}
                  sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold', '&:hover': { backgroundColor: '#45a049' } }}
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
          <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: 'white', marginBottom: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '50%' }}>{t("MKT")}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '50%' }}>{t("Price")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marketData.map((market) => (
                  <TableRow
                    key={market.pair}
                    onClick={() => handleMarketSelect(market.pair)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  >
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {market.pair}
                    </TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {market.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
    </Box>
  );
}
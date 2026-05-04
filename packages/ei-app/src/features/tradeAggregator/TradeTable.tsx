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
  Backdrop,
  Popover,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NorthEastIcon from "@mui/icons-material/NorthEast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTradablePairs,  useAppDispatch } from 'components';
import { formatVolume} from '@/utils/utils';
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { TabSelector } from '../../../../components/src/components/common/TabSelector';
import { Exchange, useGetCountriesQuery, useGetExchangesQuery, useGetExchangesTickerQuery, useGetCoinGeckoPricesQuery, useGetExchangesWithTickersQuery } from './TradeTableApi';
import { skipToken } from "@reduxjs/toolkit/query";
import ArbitrageMatrix from './ArbitrageMatrix';
 

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

const getCanonicalNames = (ticker: any) => {
  const base = ticker.canonical_base || ticker.base;
  const target = ticker.canonical_target || ticker.target;
  return { base, target };
};

export function TradeTable() {
  const [tradeData, setTradeData] = useState<TradeData>({
    symbol: '',
    mkt: '',
    qty: '0',
    value: '',
    action: 'buy',
  });
  
  const AllCountries = "All Countries";
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
  const { data: coinGeckoExchangesInitial, isLoading: isCoinGeckoExchangesLoading } = useGetExchangesQuery();
  const [coinGeckoExchanges, setCoinGeckoExchanges] = useState<Exchange[] | undefined>(coinGeckoExchangesInitial);
  const { data: countries, isLoading: isCoutriesLoading } = useGetCountriesQuery();
  const orderedCountries = React.useMemo(() => {
    const source = countries || [];
    const unique = Array.from(new Set(source));
    const rest = unique.filter((c) => c !== AllCountries && c !== "United States");
    return [AllCountries, "United States", ...rest];
  }, [countries]);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(AllCountries);
  const { data: backendExchangeData, isLoading: isBackendExchangeLoading } = useGetExchangesTickerQuery(selectedExchange?.id ?? skipToken, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const { data: coinGeckoExchangesWithTickers, isLoading: isTradingPairsLoading } = useGetExchangesWithTickersQuery(selectedExchange?.id ?? skipToken, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const [selectedTradingPair, setSelectedTradingPair] = useState<TradingPair | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [topTradingPairs, setTopTradingPairs] = useState<TradingPair[]>([]);
  const [demoRequested, setDemoRequested] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourAnchor, setTourAnchor] = useState<HTMLElement | null>(null);
  const [highlightTick, setHighlightTick] = useState(0);
  const [highlightReady, setHighlightReady] = useState(false);

   const getCoinIdFromBackend = (base: string): string | null => {
    if (!backendExchangeData) return null;
    
    for (const exchange of backendExchangeData) {
      const ticker = exchange.tickers?.find(t => {
        const { base: canonicalBase } = getCanonicalNames(t);
        return canonicalBase === base;
      });
      if (ticker?.coin_id) {
        return ticker.coin_id;
      }
    }
    return null;
  };

  const getOriginalBaseTargetFromBackend = (canonicalBase: string, canonicalTarget: string): { base: string, target: string } | null => {
    if (!backendExchangeData) return null;
    
    for (const exchange of backendExchangeData) {
      const ticker = exchange.tickers?.find(t => {
        const { base, target } = getCanonicalNames(t);
        return base === canonicalBase && target === canonicalTarget;
      });
      if (ticker) {
        return { base: ticker.base, target: ticker.target };
      }
    }
    return null;
  };

  const coinId = selectedTradingPair ? getCoinIdFromBackend(selectedTradingPair.base) : null;
  
  const hasPriceInCoinGecko = React.useMemo(() => {
    if (!selectedTradingPair || !coinGeckoExchangesWithTickers?.tickers || !backendExchangeData) return false;
    
    const originalFields = getOriginalBaseTargetFromBackend(selectedTradingPair.base, selectedTradingPair.target);
    if (!originalFields) return false;
    
    return coinGeckoExchangesWithTickers.tickers.some(ticker => {
      return ticker.base.toLowerCase() === originalFields.base.toLowerCase() && 
             ticker.target.toLowerCase() === originalFields.target.toLowerCase() && 
             ticker.last > 0;
    });
  }, [selectedTradingPair, coinGeckoExchangesWithTickers, backendExchangeData]);
  
  const queryParams = React.useMemo(() => {
    if (!coinId || !selectedExchange?.id || !selectedTradingPair || hasPriceInCoinGecko || !tradeData.mkt || !selectedTradingPair.base || !selectedTradingPair.target) {
      return skipToken;
    }
    
    const originalFields = getOriginalBaseTargetFromBackend(selectedTradingPair.base, selectedTradingPair.target);
    if (!originalFields) {
      return skipToken;
    }
    
    return [coinId, selectedExchange.id, originalFields.base, originalFields.target, refreshTimestamp.toString()];
  }, [coinId, selectedExchange?.id, selectedTradingPair, hasPriceInCoinGecko, refreshTimestamp, tradeData.mkt, backendExchangeData]);
  
  const { data: coinGeckoPrices } = useGetCoinGeckoPricesQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      skip: queryParams === skipToken || !selectedTradingPair || !tradeData.mkt,
      pollingInterval: 0
    }
  );

  const resetTour = React.useCallback(() => {
    setTourOpen(false);
    setTourStep(0);
    setTourAnchor(null);
    setSelectedExchange(null);
    setTradeData({ symbol: '', mkt: '', qty: '0', value: '', action: 'buy' });
  }, []);
  const getAnchors = React.useCallback((): (HTMLElement | null)[] => [
    document.getElementById('step-1') as HTMLElement | null,
    document.getElementById('step-2') as HTMLElement | null,
    document.getElementById('step-3') as HTMLElement | null,
    document.getElementById('step-4') as HTMLElement | null,
    document.getElementById('step-5') as HTMLElement | null,
    document.getElementById('step-6') as HTMLElement | null,
    document.getElementById('step-7') as HTMLElement | null,
  ], []);
  
  const handleDemoClick = () => {
    const kraken = coinGeckoExchanges?.find(ex => ex.id?.toLowerCase() === 'kraken' || ex.name?.toLowerCase() === 'kraken') || null;
    setSelectedExchange(kraken);
    setTradeData({
      symbol: 'ETH',
      mkt: 'ETH/USD',
      qty: '1',
      value: '',
      action: 'buy',
    });
    setDemoRequested(true);
    setTourStep(0);
    setTourOpen(false);
    setTourAnchor(null);
    setTimeout(() => {
      setTourOpen(true);
      const anchors = getAnchors();
      if (anchors[0]) {
        setTourAnchor(anchors[0]);
        try { anchors[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_e) { /* noop */ }
      }
    }, 0);
    const anchors = getAnchors();
    if (anchors[0]) {
      setTourAnchor(anchors[0]);
      try { anchors[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_e) { /* noop */ }
    }
  };

  useEffect(() => {
    if (coinGeckoExchangesInitial) {
      const filtered = coinGeckoExchangesInitial.filter(x => selectedCountry == AllCountries 
        || x.country == selectedCountry);
      
      const sorted = [...filtered].sort((a, b) => {
        if (a.trade_volume_24h_btc === null && b.trade_volume_24h_btc === null) return 0;
        if (a.trade_volume_24h_btc === null) return 1;
        if (b.trade_volume_24h_btc === null) return -1;
        return b.trade_volume_24h_btc - a.trade_volume_24h_btc;
      });
      
      setCoinGeckoExchanges(sorted);
    }
  }, [coinGeckoExchangesInitial, selectedCountry]);
  
  useEffect(() => {
    const fetchTopTradingPairs = async () => {
      if (!selectedExchange || !backendExchangeData) return;

      try {
        const pairsMap = new Map();
        backendExchangeData.forEach(exchange => {
          exchange.tickers?.forEach(ticker => {
            const { base, target } = getCanonicalNames(ticker);
            const pair = `${base}/${target}`;
            
            if (!pairsMap.has(pair)) {
              pairsMap.set(pair, {
                base: base,
                target: target,
                last: ticker.last,
                volume: ticker.converted_volume?.usd || 0,
                pair: pair
              });
            }
          });
        });

        const pairs = Array.from(pairsMap.values());
        
        const topPairs = [...pairs]
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 10);
        
        setTopTradingPairs(topPairs);

        if (demoRequested) {
          setTradeData(prev => ({ ...prev, qty: '1' }));
          setDemoRequested(false);
        }
      } catch (error) {
        console.error('Failed to fetch top trading pairs:', error);
      } 
    };

    fetchTopTradingPairs();
  }, [selectedExchange, backendExchangeData, demoRequested]);

  useEffect(() => {
    const fetchAllTradingPairs = async () => {
      if (!selectedExchange || !backendExchangeData) return;

      try {
        const pairsMap = new Map();

        backendExchangeData.forEach(exchange => {
          exchange.tickers?.forEach(ticker => {
            const { base, target } = getCanonicalNames(ticker);
            const pair = `${base}/${target}`;
            if (!pairsMap.has(pair)) {
              pairsMap.set(pair, {
                base: base,
                target: target,
                last: 0,
                volume: ticker.converted_volume.usd,
                pair: pair
              });
            }
          });
        });

        const pairs = Array.from(pairsMap.values());
        setTradingPairs(pairs);
      } catch (error) {
        console.error('Failed to fetch all trading pairs:', error);
      } 
    };

    fetchAllTradingPairs();
    }, [selectedExchange, backendExchangeData]);

  useEffect(() => {
    if (!coinGeckoExchangesWithTickers || !tradingPairs.length) return;

    setTradingPairs(prevPairs => {
      const updatedPairs = prevPairs.map(pair => {
        const coinGeckoTicker = coinGeckoExchangesWithTickers.tickers?.find(ticker => {
          const { base, target } = getCanonicalNames(ticker);
          return base === pair.base && target === pair.target;
        });
        
        if (coinGeckoTicker) {
          return {
            ...pair,
            last: coinGeckoTicker.last
          };
        }
        
        return pair;
      });

      const uniquePairs = updatedPairs.filter((pair, index, self) => 
        index === self.findIndex(p => p.pair === pair.pair)
      );

      return uniquePairs;
    });
  }, [coinGeckoExchangesWithTickers, tradingPairs.length]);

  useEffect(() => {
    if (coinGeckoPrices && selectedTradingPair && tradeData.symbol && selectedExchange?.id) {
      const originalFields = getOriginalBaseTargetFromBackend(selectedTradingPair.base, selectedTradingPair.target);
      if (!originalFields) return;
      
      const uniqueKey = `${originalFields.base}_${originalFields.target}_${selectedExchange.id}`;
      const priceData = coinGeckoPrices[uniqueKey];
      const currentPrice = priceData?.usd;
      
      if (currentPrice && currentPrice !== selectedTradingPair.last) {
        const updatedSelectedPair = {
          ...selectedTradingPair,
          last: currentPrice
        };
        setSelectedTradingPair(updatedSelectedPair);
        
        setTradingPairs(prevPairs => 
          prevPairs.map(pair => {
            if (pair.pair === selectedTradingPair.pair) {
              return {
                ...pair,
                last: currentPrice
              };
            }
            return pair;
          })
        );
      }
    }
  }, [coinGeckoPrices, selectedTradingPair, tradeData.symbol, selectedExchange?.id]);

  useEffect(() => {
    if (selectedTradingPair && coinGeckoExchangesWithTickers?.tickers && backendExchangeData) {
      const originalFields = getOriginalBaseTargetFromBackend(selectedTradingPair.base, selectedTradingPair.target);
      if (originalFields) {
        const ticker = coinGeckoExchangesWithTickers.tickers.find(t => 
          t.base.toLowerCase() === originalFields.base.toLowerCase() && 
          t.target.toLowerCase() === originalFields.target.toLowerCase() && 
          t.last > 0
        );
        
        if (ticker && ticker.last !== selectedTradingPair.last) {
          const updatedSelectedPair = {
            ...selectedTradingPair,
            last: ticker.last
          };
          setSelectedTradingPair(updatedSelectedPair);
          
          setTradingPairs(prevPairs => 
            prevPairs.map(pair => {
              if (pair.pair === selectedTradingPair.pair) {
                return {
                  ...pair,
                  last: ticker.last
                };
              }
              return pair;
            })
          );
        }
      }
    }
  }, [selectedTradingPair, coinGeckoExchangesWithTickers, backendExchangeData]);

  const handleTradingPairSelect = (pair: string | null) => {
    if (pair) {
      const [symbol, target] = pair.split('/');
      const selectedPair = tradingPairs.find(p => p.pair === pair);

      if (selectedPair) {
        setSelectedTradingPair(selectedPair);
        setRefreshTimestamp(Date.now());
      }

      setTradeData({
        ...tradeData,
        symbol,
        mkt: pair
      });
    } else {
      setSelectedTradingPair(null);
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
    setSelectedTradingPair(null);
    setTradeData({
      symbol: '',
      mkt: '',
      qty: '0',
      value: '',
      action: 'buy',
    });
  };

  const handleCountrySelect = (event: SelectChangeEvent<string>) => {
      const country = event.target.value;
      setSelectedCountry(country);
      
      if (selectedExchange?.country == country) {
        return;
      }

      setSelectedExchange(null);
      setSelectedTradingPair(null);
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
    
    const selectedMarket = selectedTradingPair || tradingPairs.find(m => m.pair === tradeData.mkt);
    if (!selectedMarket) {
      if (!demoRequested) {
        setTradeData(prev => ({ ...prev, value: '', qty: '0' }));
      }
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
    tradingPairs,
    selectedTradingPair,
    demoRequested
  ]);

  useEffect(() => {
    if (!tourOpen) return;
    const anchors = getAnchors();
    const timer = window.setTimeout(() => {
      const el = anchors[tourStep];
      if (el) {
        setTourAnchor(el);
        try {
          el.scrollIntoView({ behavior: 'auto', block: 'center' });
        } catch (_e) { /* noop */ }
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [tourStep, tourOpen, selectedExchange, tradingPairs, tradeData, isSwitchIncluded, getAnchors]);

  useEffect(() => {
    if (!tourOpen) return;
    const interval = window.setInterval(() => setHighlightTick(t => t + 1), 120);
    return () => window.clearInterval(interval);
  }, [tourOpen, tourStep]);

  useEffect(() => {
    if (!tourOpen || !tourAnchor) return;
    setHighlightReady(false);
    let frame = 0;
    let last: DOMRect | null = null;
    let stableCount = 0;
    let raf = 0 as any;

    const measure = () => {
      const baseEl = tourStep === 6
        ? (document.querySelector('#step-7 table') as HTMLElement | null)
        : (tourAnchor as HTMLElement);
      const rect = baseEl ? baseEl.getBoundingClientRect() : null;
      if (rect && last) {
        const dx = Math.abs(rect.left - last.left);
        const dy = Math.abs(rect.top - last.top);
        if (dx < 1 && dy < 1) stableCount += 1; else stableCount = 0;
      }
      last = rect || last;
      if (stableCount >= 2 || frame > 20) {
        setHighlightReady(true);
        return;
      }
      frame += 1;
      raf = window.requestAnimationFrame(measure);
    };
    raf = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(raf);
  }, [tourOpen, tourStep, tourAnchor]);

  const highlightRect = (() => {
    if (!tourAnchor) return null;
    try {
      if (tourStep === 3) {
        const col = document.getElementById('step-4') as HTMLElement | null;
        if (col) return col.getBoundingClientRect();
      }
      if (tourStep === 6) {
        const tableEl = document.querySelector('#step-7 table') as HTMLElement | null;
        if (tableEl) return tableEl.getBoundingClientRect();
      }
      return (tourAnchor as HTMLElement).getBoundingClientRect();
    } catch {
      return (tourAnchor as HTMLElement).getBoundingClientRect();
    }
  })();

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
            theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "#f7f5f2",
            padding: 2,
          }}
      >
      
      <TabSelector
        options={[
          { label: t("TradingPairs"), value: "Trading Pairs", icon: <SwapVertIcon sx={{ fontSize: 18 }} /> },
          { label: t("ArbitrageMatrix"), value: "Arbitrage Matrix", icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
        ]}
        value={activeTab}
        onChange={setActiveTab as (v: string) => void}
        sx={{ mb: 2, mt: 0, height: 36 }}
      />

      {activeTab === "Trading Pairs" ? (
        <>
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="column"
            sx={{ mb: 2 }}
          >
            <Grid item>
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "16px",
                  padding: "2px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "#219a83",
                  color: "#fff",
                  border: "1px solid #fff",
                  boxShadow: "none",
                  '&:hover': { backgroundColor: "#219a83", boxShadow: "none" }
                }}
                onClick={handleDemoClick}
              >
                {t("TradingPairsDemo")}
              </Button>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <Grid container alignItems="center" direction="row" spacing={2}>
                <Grid item container alignItems="center" sx={{ width: "auto" }}>
                  <Grid item>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.9rem',
                        marginRight:"10px",
                        color: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      {t("FilterbyCountry")}:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Autocomplete
                        disableClearable
                        size="small"
                        options={orderedCountries}
                        loading={isCoutriesLoading}
                        getOptionLabel={(option) => option} 
                        value={selectedCountry}
                        onChange={(event, newValue) => {
                          handleCountrySelect({ target: { value: newValue }} as SelectChangeEvent<string>);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("SelectCountry")}
                          />
                        )}
                        sx={{ width: 200 }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item id="step-1" container alignItems="center" sx={{ width: "auto" }}>
                  <Grid item>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.9rem',
                        marginRight:"10px",
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
              </Grid>
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
                       <FormControl  id="step-2"size="small" sx={{ minWidth: 180 }}>
                         <Autocomplete 
                           size="small"
                           options={tradingPairs}
                           disabled={!selectedExchange}
                           getOptionLabel={(option) => option.pair} 
                           loading={isBackendExchangeLoading}
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
                          id="step-3"
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
                       <Box id="step-4">
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
                     </Box>

                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: "190px" }}>
                       <Typography variant="body2" sx={{ color: textColor, fontSize: '0.9rem',}}>
                         {t("SwitchCryptoInput")}
                       </Typography>
                       <Button
                        id="step-5"
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
                         id="step-6"
                           variant="outlined"
                           disabled={!tradeData.symbol}
                           sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                              borderRadius: "6px",
                              height: "37px",
                               ...(tradeData.symbol && {
                                backgroundColor: "#219a83",
                                "&:hover": { backgroundColor: "#219a83", },
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

                   {tradeData.symbol && tradeData.mkt && tradeData.action && (
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
                           {tradeData.qty && tradeData.value ? t("Transaction") : "Last Price"}:
                         </div>
                         <div>
                           {tradeData.qty && tradeData.value ? (
                             tradeData.action === "buy"
                               ? `Buy ${tradeData.qty} ${tradeData.symbol.toUpperCase()} → Spend ~${tradeData.value} ${tradeData.mkt.split("/")[1]}`
                               : `Sell ${tradeData.qty} ${tradeData.symbol.toUpperCase()} → Receive ~${tradeData.value} ${tradeData.mkt.split("/")[1]}`
                           ) : (
                            (() => {
                              const selectedMarket = selectedTradingPair || tradingPairs.find(m => m.pair === tradeData.mkt);
                              const currentPrice = selectedMarket?.last;
                              return currentPrice 
                                ? `${tradeData.mkt} @ $${currentPrice.toLocaleString()}`
                                : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <span>{tradeData.mkt}</span>
                                      <CircularProgress size={16} />
                                    </Box>
                                  );
                            })()
                           )}
                         </div>
                       </Box>
                     </Box>
                   )}
               </Paper>    
             </Box>
           </Box>

          {selectedExchange && (    
            <Paper
            id="step-7"
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
                    <Table >
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
        <ArbitrageMatrix/>
      )}
     </Grid>

      <Backdrop
        open={tourOpen}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal - 1,
          backgroundColor: 'rgba(0,0,0,.4)'
        }}
      />
      {tourOpen && highlightReady && highlightRect && (
        <Box
          sx={{
            position: 'fixed',
            zIndex: (theme) => theme.zIndex.modal + 1,
            boxShadow: 'inset 0 0 0 4px #3b82f6',
            borderRadius: '12px',
            pointerEvents: 'none',
          }}
          style={{
            left: Math.max(0, highlightRect.left),
            top: Math.max(0, highlightRect.top),
            width: highlightRect.width,
            height: highlightRect.height,
          }}
        />
      )}

      <Popover
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
        open={tourOpen && Boolean(tourAnchor)}
        anchorEl={tourAnchor}
        onClose={resetTour}
        anchorOrigin={{
          vertical: tourStep === 6 ? 'top' : 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: tourStep === 6 ? 'bottom' : 'top',
          horizontal: 'center'
        }}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 3,
            maxWidth: 360,
            backgroundColor: '#f7f5f2',
            color: '#1a1a1a',
            ...(tourStep === 6 ? { mb: '15px' } : { mt: '15px' })
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="contained"
            onClick={resetTour}
            sx={{ 
              position: 'absolute',
              top: -12,
              right: -12,
              background: '#f7f5f2', 
              color: '#4a5568', 
              border: '1px solid #e2e8f0', 
              boxShadow: 'none', 
              textTransform: 'none', 
              minWidth: 'auto',
              width: 32,
              height: 32,
              borderRadius: '50%',
              padding: 0,
              fontSize: 20,
              '&:hover': { background: '#f0ece5', boxShadow: 'none' } 
            }}
          >
            ×
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14
          }}>{tourStep + 1}</Box>
          <Typography fontWeight={700} fontSize={18} sx={{ color: '#1a1a1a' }}>
            {[
              'Select Exchange',
              'Choose Trading Pair',
              'Buy or Sell',
              'Enter Amount',
              'Switch Input Mode',
              'Execute Trade',
              'Quick Access Pairs'
            ][tourStep]}
          </Typography>
        </Box>
        <Typography sx={{ color: '#6b7280', lineHeight: 1.8, mb: 2, fontSize: '0.95rem' }}>
          {[
            'First, choose which exchange you want to trade on. Each exchange offers different trading pairs and fees.',
            "Select the cryptocurrency pair you want to trade. This determines what you're buying or selling.",
            "Decide whether you want to buy or sell the first currency in the pair (ETH in this case).",
            'Input the amount of cryptocurrency you want to trade. This will automatically calculate the cost.',
            'Click this button to switch between entering the crypto amount or the dollar amount you want to spend.',
            "When you're ready, click this button to go directly to the exchange and complete your trade.",
            'Use this table to quickly model trades for the most popular trading pairs. Click "MODEL TRADE" to instantly load a pair.'
          ][tourStep]}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: i <= tourStep ? '#3b82f6' : '#e2e8f0' }} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {tourStep > 0 && (
              <Button
                variant="contained"
                onClick={() => {
                  setTourStep((prev) => prev - 1);
                }}
                sx={{ 
                  background: '#f7f5f2', 
                  color: '#4a5568', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: 'none', 
                  textTransform: 'none',
                  '&:hover': { background: '#f0ece5', boxShadow: 'none' } 
                }}
              >
                Prior
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => {
                setTourStep((prev) => {
                  if (prev < 6) return prev + 1;
                  resetTour();
                  return 0; 
                });
              }}
              sx={{ background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', color: '#fff', boxShadow: 'none', textTransform: 'none' }}
            >
              {tourStep === 6 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
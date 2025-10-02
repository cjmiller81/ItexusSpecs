
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  Autocomplete,
  TextField,
  Paper,
  alpha,
  useTheme,
  Checkbox,
  ListItemText,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Exchange, useGetExchangesQuery, useGetCountriesQuery, useLazyGetExchangesTickerQuery } from './TradeTableApi';

interface ExtendedExchange extends Exchange {
  isSelectAll?: boolean;
}

interface TradingPair {
  base: string;
  target: string;
  last: number;
  volume: number;
  pair: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;


const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

export default function ArbitrageMatrix() {
  const { t } = useTranslation(["TradeTable"]);
  const theme = useTheme();
  const AllCountries = "All Countries";
  const { data: coinGeckoExchangesInitial, isLoading: isCoinGeckoExchangesLoading } = useGetExchangesQuery();
  const { data: countries, isLoading: isCountriesLoading } = useGetCountriesQuery();
  const [getExchangesTicker] = useLazyGetExchangesTickerQuery();
  const [coinGeckoExchanges, setCoinGeckoExchanges] = useState<Exchange[] | undefined>(coinGeckoExchangesInitial);
  const [selectedExchanges, setSelectedExchanges] = useState<Exchange[]>([]);
  const [tempSelectedExchanges, setTempSelectedExchanges] = useState<Exchange[]>([]);
  const [exchangeDropdownOpen, setExchangeDropdownOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(AllCountries);
  const [selectedTradingPair, setSelectedTradingPair] = useState<TradingPair | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [commonTradingPairs, setCommonTradingPairs] = useState<TradingPair[]>([]);
  const [isLoadingTradingPairs, setIsLoadingTradingPairs] = useState<boolean>(false);
  const [exchangeDataCache, setExchangeDataCache] = useState<Map<string, any>>(new Map());
  
  useEffect(() => {
    if (coinGeckoExchangesInitial) {
      setCoinGeckoExchanges(coinGeckoExchangesInitial.filter(x => 
        selectedCountry === AllCountries || x.country === selectedCountry
      ));
    }
  }, [coinGeckoExchangesInitial, selectedCountry]);

  const filteredExchanges = useMemo(() => {
    return coinGeckoExchanges?.filter(exchange =>
      exchange.name.toLowerCase().includes(searchText.toLowerCase())
    ) || [];
  }, [coinGeckoExchanges, searchText]);

  const isAllSelected = tempSelectedExchanges.length === filteredExchanges.length && filteredExchanges.length > 0;
  const isIndeterminate = tempSelectedExchanges.length > 0 && tempSelectedExchanges.length < filteredExchanges.length;

  const optionsWithSelectAll = useMemo<ExtendedExchange[]>(() => {
    const selectAllOption: ExtendedExchange = {
      id: 'select-all',
      name: isAllSelected ? 'Deselect All' : 'Select All',
      country: null,
      url: '',
      centralized: true,
      isSelectAll: true
    };
    
    return [selectAllOption, ...filteredExchanges];
  }, [filteredExchanges, isAllSelected]);

  const filteredCountries = useMemo(() => {
    if (!coinGeckoExchangesInitial) return [];
    
    const countryCounts = coinGeckoExchangesInitial.reduce((acc, exchange) => {
      if (exchange.country) {
        acc[exchange.country] = (acc[exchange.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(countryCounts)
      .filter(country => countryCounts[country] >= 2)
      .sort();
  }, [coinGeckoExchangesInitial]);


  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    if (country !== AllCountries) {
      setSelectedExchanges(prev => 
        prev.filter(ex => ex.country === country)
      );
    }
  }; 

  // const handleTradingPairSelect = (pair: TradingPair | null) => {
  //   setSelectedTradingPair(pair);
  // };

  const handleExchangeDropdownOpen = () => {
    setTempSelectedExchanges(selectedExchanges);
    setExchangeDropdownOpen(true);
  };

  const handleExchangeDropdownClose = () => {
    setExchangeDropdownOpen(false);
    setSearchText('');
  };

  const handleExchangeOk = async () => {
    setSelectedExchanges(tempSelectedExchanges);
    handleExchangeDropdownClose();
    
    if (tempSelectedExchanges.length > 0) {
      await fetchExchangesData(tempSelectedExchanges);
    }
  };

  const handleExchangeCancel = () => {
    setTempSelectedExchanges([]);
    setSelectedExchanges([]);
    setExchangeDataCache(new Map());
    setCommonTradingPairs([]);
    handleExchangeDropdownClose();
  };

  const fetchExchangesData = async (exchanges: Exchange[]) => {
    setIsLoadingTradingPairs(true);
    setCommonTradingPairs([]);
    
    try {
      const exchangesToFetch = exchanges.filter(exchange => !exchangeDataCache.has(exchange.id));
      
      if (exchangesToFetch.length > 0) {
        for (const exchange of exchangesToFetch) {
          try {
            const result = await getExchangesTicker(exchange.id);
            
            if ('data' in result && result.data) {
              const exchangeData = Array.isArray(result.data) ? result.data[0] : result.data;
              
              setExchangeDataCache(prevCache => {
                const newCache = new Map(prevCache);
                newCache.set(exchange.id, exchangeData);
                return newCache;
              });
            } else {
              console.error(`Failed to fetch data for ${exchange.name}:`, result.error);
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error fetching data for ${exchange.name}:`, error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setExchangeDataCache(currentCache => {
        processExchangesDataWithCache(exchanges, currentCache);
        return currentCache;
      });
    } catch (error) {
      console.error('Failed to fetch exchanges data:', error);
      setIsLoadingTradingPairs(false);
    }
  };

  const processExchangesDataWithCache = (exchanges: Exchange[], cache: Map<string, any>) => {
    const successfulResults = exchanges
      .map(exchange => ({
        exchange,
        data: cache.get(exchange.id)
      }))
      .filter(result => result.data !== null && result.data !== undefined);

    if (successfulResults.length === 0) {
      setCommonTradingPairs([]);
      setIsLoadingTradingPairs(false);
      return;
    }

    if (successfulResults.length !== exchanges.length) {
      setCommonTradingPairs([]);
      setIsLoadingTradingPairs(false);
      return;
    }

    const allPairsMap = new Map<string, TradingPair>();
    
    successfulResults.forEach(({ data }) => {
      if (data?.tickers && Array.isArray(data.tickers)) {
        data.tickers.forEach((ticker: any) => {
          const pair = `${ticker.base}/${ticker.target}`;
          if (!allPairsMap.has(pair)) {
            allPairsMap.set(pair, {
              base: ticker.base,
              target: ticker.target,
              last: ticker.last,
              volume: ticker.converted_volume?.usd || 0,
              pair: pair
            });
          }
        });
      }
    });

    const commonPairs: TradingPair[] = [];
    
    allPairsMap.forEach((pair) => {
      const existsOnAllSelectedExchanges = exchanges.every(selectedExchange => {
        const exchangeData = cache.get(selectedExchange.id);
        if (!exchangeData?.tickers || !Array.isArray(exchangeData.tickers)) return false;
        return exchangeData.tickers.some((ticker: any) => 
          `${ticker.base}/${ticker.target}` === pair.pair
        );
      });

      if (existsOnAllSelectedExchanges) {
        commonPairs.push(pair);
      }
    });

    commonPairs.sort((a, b) => b.volume - a.volume);
    
    setCommonTradingPairs(commonPairs);
    setIsLoadingTradingPairs(false);
  };

  useEffect(() => {
    setSelectedTradingPair(null);
    
    if (selectedExchanges.length === 0) {
      setCommonTradingPairs([]);
      setIsLoadingTradingPairs(false);
    }
  }, [selectedExchanges]);  

  return (
    <Box sx={{ height: "100%", p: 1 }}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Grid container spacing={2} alignItems="flex-start" sx={{ alignItems: 'flex-start' }}>
            <Grid item>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  marginBottom: 1,
                  marginTop:"16px",
                  color: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.7)',
                }}
              >
                {t("SelectExchange")}:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <Autocomplete<ExtendedExchange, true, false, false>
                  multiple
                  size="small"
                  open={exchangeDropdownOpen}
                  onOpen={handleExchangeDropdownOpen}
                  onClose={(event, reason) => {
                    if (reason === 'blur') {
                      return;
                    }
                  }}
                  options={optionsWithSelectAll}
                  loading={isCoinGeckoExchangesLoading}
                  getOptionLabel={(option) => option.name}
                  value={tempSelectedExchanges}
                  onChange={(event, newValue) => {
                    if (newValue.length === 0 && selectedExchanges.length > 0) {
                      handleExchangeCancel();
                      return;
                    }

                    const selectAllOption = newValue.find(item => item.isSelectAll);
                    if (selectAllOption) {
                      if (isAllSelected) {
                        setTempSelectedExchanges([]);
                      } else {
                        setTempSelectedExchanges(filteredExchanges);
                      }
                    } else {
                      const regularSelections = newValue
                        .filter(item => !item.isSelectAll)
                        .map(item => ({ ...item, isSelectAll: undefined })) as Exchange[];
                      setTempSelectedExchanges(regularSelections);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setSearchText(newInputValue);
                  }}
                  disableCloseOnSelect
                  ListboxProps={{
                    style: {
                      maxHeight: "60vh",
                      overflow: 'auto',
                    },
                  }}
                  PaperComponent={({ children }) => (
                    <Paper>
                      {children}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
                        <Button 
                          size="small" 
                          onClick={handleExchangeCancel}
                          sx={{ 
                            textTransform: 'none',
                            color: 'white'
                          }}
                        >
                          {t("Cancel", { ns: "Common" }) || "Cancel"}
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          onClick={handleExchangeOk}
                          sx={{ 
                            textTransform: 'none',
                            color: 'white'
                          }}
                        >
                          {t("OK", { ns: "Common" }) || "OK"}
                        </Button>
                      </Box>
                    </Paper>
                  )}
                  renderOption={(props, option) => {
                    const isSelected = option.isSelectAll 
                      ? isAllSelected 
                      : tempSelectedExchanges.some(ex => ex.id === option.id);
                    
                    return (
                      <li {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Checkbox
                            style={{ marginRight: 8 }}
                            checked={isSelected}
                            indeterminate={option.isSelectAll ? isIndeterminate : false}
                          />
                          <ListItemText 
                            primary={option.name}
                            sx={{
                              fontWeight: option.isSelectAll ? 600 : 'normal',
                              color: option.isSelectAll ? theme.palette.primary.main : 'inherit'
                            }}
                          />
                        </Box>
                        {option.isSelectAll && (
                          <Divider sx={{ mt: 1, mb: 0.5 }} />
                        )}
                      </li>
                    );
                  }}
                  renderTags={() => null}
                  renderInput={(params) => {
                    let displayText = t("SelectExchange");
                    
                    if (selectedExchanges.length === 1) {
                      displayText = selectedExchanges[0].name;
                    } else if (selectedExchanges.length > 1) {
                      displayText = `${selectedExchanges.length} ${t('ExchangesSelected')}`;
                    }
                    
                    return (
                      <TextField
                        {...params}
                        placeholder={displayText}
                        InputProps={{
                          ...params.InputProps,
                          readOnly: true,
                          sx: {
                            color: 'white',
                            '& input::placeholder': {
                              color:theme.palette.mode === 'dark'? 'white': "black",
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    );
                  }}
                  sx={{ width: 300 }}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  marginBottom: 1,
                  marginTop:"16px",
                  color: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.7)',
                }}
              >
                {t("FilterbyCountry")}:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Autocomplete
                  disableClearable
                  size="small"
                  options={[AllCountries, ...filteredCountries]}
                  loading={isCountriesLoading}
                  getOptionLabel={(option) => option}
                  value={selectedCountry}
                  onChange={(event, newValue) => {
                    handleCountrySelect(newValue);
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

            <Grid item xs>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor: alpha(
                    theme.palette.mode === 'light'
                      ? "#fff"
                      : theme.palette.grey[900],
                    0.9
                  ),
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    marginBottom: 1,
                    color: theme.palette.mode === 'light'? "black" : 'white',
                  }}
                >
                  {t("TradingPair")}:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Autocomplete
                      size="small"
                      options={commonTradingPairs}
                      disabled={selectedExchanges.length === 0}
                      loading={isLoadingTradingPairs}
                      getOptionLabel={(option) => option.pair}
                      value={selectedTradingPair}
                      onChange={(event, newValue) => {
                        // handleTradingPairSelect(newValue);
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
                  
                  {selectedTradingPair && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, ml: 1 }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            mb: 0.5,
                            color: theme.palette.mode === 'light' ? 'black' : 'white',
                            fontSize: '0.9rem',
                          }}
                        >
                          How to Read This Matrix
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: 'rgba(76, 175, 80, 0.3)',
                              border: '1px solid #4caf50',
                              borderRadius:"2px",
                              mr: 0.8,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.7rem',
                              color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            Green = Profitable arbitrage opportunity
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: 'rgba(244, 67, 54, 0.3)',
                              border: '1px solid #f44336',
                              mr: 0.8,
                              borderRadius:"2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.7rem',
                              color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            Red = Loss (sell price lower than buy price)
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: theme.palette.mode === 'light' ? 'black' : 'white',
                            mb: 0.5,
                          }}
                        >
                          {t("ExampleBuy")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                            mb: 0.3,
                          }}
                        >
                          {t("FindTheIntersectionOfYour")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.7rem',
                            color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          <strong>{t("Note")}</strong> {t("ProfitsShownExcludeTradingDees")}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {!selectedTradingPair && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontStyle: 'italic',
                      }}
                    >
                      {t("SelectTradingPairToCiewArbitrageOpportunities")}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sx={{ flex: 1 }}>
          <Card
            sx={{
              height: '100%',
              minHeight: 400,
             backgroundColor: alpha(
                    theme.palette.mode === 'light'
                      ? "#fff"
                      : theme.palette.grey[900],
                    0.9
                  ),
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* ВРЕМЕННО ОТКЛЮЧЕНО: Показываем Chip вместо таблицы */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <Chip
                  icon={
                    <Box
                      component="svg"
                      viewBox="0 0 16 16"
                      sx={{ 
                        animation: `${rotate} 4s linear infinite`,
                        width: '12px',
                        height: '12px',
                        fill: '#60a5fa'
                      }}
                    >
                      <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                    </Box>
                  }
                  label="Arbitrage Matrix Coming Soon"
                  sx={{
                    background:
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '20px',
                    color: theme.palette.mode === 'light' ? theme.palette.primary.dark : '#60a5fa',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '13px',
                    animation: `${pulseGlow} 3s ease-in-out infinite`,
                    backdropFilter: 'blur(8px)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      animation: `${shimmer} 2s infinite`,
                      zIndex: 0,
                    },
                    '& .MuiChip-label': {
                      position: 'relative',
                      zIndex: 1,
                    },
                    '& .MuiChip-icon': {
                      position: 'relative',
                      zIndex: 1,
                    }
                  }}
                />
              </Box>

              {/* ЗАКОММЕНТИРОВАНО: Вся логика таблицы арбитража (понадобится позже) */}
              {/* {selectedExchanges.length === 0 ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {t("NoExchangesSelected")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {t("PleaseSelectExchangesToViewArbitrageMatrix")}
                  </Typography>

                </Box>
              ) : selectedTradingPair === null ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >

                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {t('TradeTable.SelectTradingPairMessage')}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {t('TradeTable.PleaseSelectTradingPairMessage')}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: 'white',
                      textAlign: 'left',
                    }}
                  >
                    {t('TradeTable.ArbitrageMatrixTitle')} {selectedTradingPair?.pair}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'left',
                    }}
                  >
                    {t('TradeTable.ArbitrageMatrixSubtitle')}
                  </Typography>
                  
                  <TableContainer
                    sx={{
                      border:`1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: 1,
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              color: theme.palette.mode === 'light' ? 'black' : 'white', 
                              fontWeight: 'bold',
                              backgroundColor: 'transparent',
                              border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
                            }}
                          ></TableCell>
                          {selectedExchanges.map((exchange) => (
                            <TableCell 
                              key={exchange.id} 
                              sx={{ 
                                color: theme.palette.mode === 'light' ? 'black' : 'white', 
                                fontWeight: 'bold', 
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
                              }}
                            >
                              {exchange.name}
                              <br />
                              <Typography variant="caption" sx={{ color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}>
                                SN/A
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedExchanges.map((rowExchange) => (
                          <TableRow key={rowExchange.id}>
                            <TableCell 
                              sx={{ 
                                color: theme.palette.mode === 'light' ? 'black' : 'white', 
                                fontWeight: 'bold',
                                backgroundColor: 'transparent',
                                border: 'none',
                              }}
                            >
                              {rowExchange.name}
                              <br />
                              <Typography variant="caption" sx={{ color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)' }}>
                                SN/A
                              </Typography>
                            </TableCell>
                            {selectedExchanges.map((colExchange, index) => (
                              <TableCell 
                                key={colExchange.id} 
                                sx={{ 
                                  textAlign: 'center',
                                  border: 'none',
                                  borderLeft: index === 0 ? `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}` : 'none',
                                  p: 0,
                                  minHeight: 80,
                                  height: 80,
                                }}
                              >
                                {rowExchange.id === colExchange.id ? (
                                  <Box
                                    sx={{
                                      backgroundColor: 'transparent',
                                      height: '100%',
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      py: 1,
                                    }}
                                  >
                                    <Typography sx={{ color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}>-</Typography>
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      backgroundColor: theme.palette.mode === 'light' ? 'rgba(13, 13, 14, 0.1)' : 'rgba(8, 8, 17, 0.1)',
                                      height: '65%',
                                      width: '85%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      py: 1,
                                      margin: 'auto',
                                    }}
                                  >
                                    <Typography sx={{ color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}>
                                      -$0.00
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}>
                                      0%
                                    </Typography>
                                  </Box>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )} */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
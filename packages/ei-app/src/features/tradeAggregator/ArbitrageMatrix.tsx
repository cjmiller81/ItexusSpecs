
import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Exchange, useGetExchangesQuery, useGetCountriesQuery } from './TradeTableApi';

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

export default function ArbitrageMatrix() {
  const { t } = useTranslation(["TradeTable"]);
  const theme = useTheme();
  const AllCountries = "All Countries";
  
  const { data: coinGeckoExchangesInitial, isLoading: isCoinGeckoExchangesLoading } = useGetExchangesQuery();
  const { data: countries, isLoading: isCountriesLoading } = useGetCountriesQuery();
  
  const [coinGeckoExchanges, setCoinGeckoExchanges] = useState<Exchange[] | undefined>(coinGeckoExchangesInitial);
  const [selectedExchanges, setSelectedExchanges] = useState<Exchange[]>([]);
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

  const filteredExchanges = coinGeckoExchanges?.filter(exchange =>
    exchange.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const isAllSelected = selectedExchanges.length === filteredExchanges.length && filteredExchanges.length > 0;
  const isIndeterminate = selectedExchanges.length > 0 && selectedExchanges.length < filteredExchanges.length;

  const selectAllOption: ExtendedExchange = {
    id: 'select-all',
    name: isAllSelected ? 'Deselect All' : 'Select All',
    country: null,
    url: '',
    centralized: true,
    isSelectAll: true
  };

  const optionsWithSelectAll: ExtendedExchange[] = [selectAllOption, ...filteredExchanges];

  const handleExchangeSelect = (exchanges: Exchange[]) => {
    setSelectedExchanges(exchanges);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    if (country !== AllCountries) {
      setSelectedExchanges(prev => 
        prev.filter(ex => ex.country === country)
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedExchanges.length === filteredExchanges.length) {
      setSelectedExchanges([]);
    } else {
      setSelectedExchanges([...filteredExchanges]);
    }
  };

  const handleTradingPairSelect = (pair: TradingPair | null) => {
    setSelectedTradingPair(pair);
  };

  const fetchCommonTradingPairs = useCallback(async () => {
    if (selectedExchanges.length === 0) {
      setCommonTradingPairs([]);
      return;
    }

    setIsLoadingTradingPairs(true);
    
    try {
        const exchangesToFetch = selectedExchanges.filter(exchange => !exchangeDataCache.has(exchange.id));
      
      if (exchangesToFetch.length > 0) {
        const exchangeDataPromises = exchangesToFetch.map(async (exchange) => {
          try {
            const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchange.id}/tickers?page=1&order=volume`);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${exchange.name}`);
            }
            const data = await response.json();
            return { exchange, data };
          } catch (error) {
            console.error(`Error fetching data for ${exchange.name}:`, error);
            return { exchange, data: null };
          }
        });

        const newExchangeDataResults = await Promise.all(exchangeDataPromises);
        
        setExchangeDataCache(prevCache => {
          const newCache = new Map(prevCache);
          newExchangeDataResults.forEach(({ exchange, data }) => {
            if (data !== null) {
              newCache.set(exchange.id, data);
            }
          });
          return newCache;
        });
      }

      const successfulResults = selectedExchanges
        .map(exchange => ({
          exchange,
          data: exchangeDataCache.get(exchange.id)
        }))
        .filter(result => result.data !== null);

      if (successfulResults.length === 0) {
        setCommonTradingPairs([]);
        return;
      }

        if (successfulResults.length !== selectedExchanges.length) {
          setCommonTradingPairs([]);
          return;
        }

      const allPairsMap = new Map<string, TradingPair>();
      
      successfulResults.forEach(({ data }) => {
        if (data?.tickers) {
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
        const existsOnAllSelectedExchanges = selectedExchanges.every(selectedExchange => {
          const exchangeData = exchangeDataCache.get(selectedExchange.id);
          if (!exchangeData?.tickers) return false;
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
    } catch (error) {
      console.error('Failed to fetch common trading pairs:', error);
      setCommonTradingPairs([]);
    } finally {
      setIsLoadingTradingPairs(false);
    }
  }, [selectedExchanges, exchangeDataCache]);

  useEffect(() => {
    setSelectedTradingPair(null);
    fetchCommonTradingPairs();
  }, [selectedExchanges, fetchCommonTradingPairs]);

  

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
                  options={optionsWithSelectAll}
                  loading={isCoinGeckoExchangesLoading}
                  getOptionLabel={(option) => option.name}
                  value={selectedExchanges}
                  onChange={(event, newValue) => {
                    const selectAllOption = newValue.find(item => item.isSelectAll);
                    if (selectAllOption) {
                      if (isAllSelected) {
                        handleExchangeSelect([]);
                      } else {
                        handleExchangeSelect(filteredExchanges);
                      }
                    } else {
                      const regularSelections = newValue.filter(item => !item.isSelectAll) as Exchange[];
                      handleExchangeSelect(regularSelections);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setSearchText(newInputValue);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={option.isSelectAll ? isAllSelected : selected}
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
                  )}
                  renderTags={() => null}
                  renderInput={(params) => {
                    let displayText = t("SelectExchange");
                    
                    if (selectedExchanges.length === 1) {
                      displayText = selectedExchanges[0].name;
                    } else if (selectedExchanges.length > 1) {
                      displayText = `${selectedExchanges.length} ${t('TradeTable.ExchangesSelected')}`;
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
                  options={countries || []}
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
                        handleTradingPairSelect(newValue);
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
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontStyle: 'italic',
                    }}
                  >
                    {t('TradeTable.SelectTradingPairTooltip')}
                  </Typography>
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
              {selectedExchanges.length === 0 ? (
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
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
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
                  renderTags={(value, getTagProps) => {
                    const regularSelections = value.filter(option => !option.isSelectAll);
                    if (regularSelections.length === 0) {
                      return null;
                    } else if (regularSelections.length === 1) {
                      return (
                        <Chip
                          variant="outlined"
                          label={regularSelections[0].name}
                          size="small"
                          {...getTagProps({ index: 0 })}
                          key={regularSelections[0].id}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          variant="outlined"
                          label={`${regularSelections.length} selected`}
                          size="small"
                          {...getTagProps({ index: 0 })}
                          key="multiple-selected"
                        />
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("SelectExchange")}
                    />
                  )}
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
                      ? theme.palette.grey[100]
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
                    color: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.7)'
                      : 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {t("TradingPair")}:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200, alignSelf: 'flex-start' }}>
                  <Autocomplete
                    size="small"
                    options={[]} 
                    disabled={selectedExchanges.length === 0}
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
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
                0.9
              ),
              borderRadius: 2,
            }}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {selectedExchanges.length === 0 ? (
                <>
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
                </>
              ) : (
                <>
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
                    Arbitrage Matrix
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {t("SelectedExchanges")}: {selectedExchanges.length}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {selectedExchanges.map((exchange) => (
                      <Chip
                        key={exchange.id}
                        label={exchange.name}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
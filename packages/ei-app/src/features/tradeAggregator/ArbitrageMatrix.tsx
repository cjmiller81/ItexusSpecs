
import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
} from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NearMeIcon from '@mui/icons-material/NearMe';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { keyframes } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Exchange, TradingPair as ApiTradingPair, useGetExchangesQuery, useGetTradingPairsQuery } from './TradeTableApi';

interface ExtendedExchange extends Exchange {
  isSelectAll?: boolean;
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
  const { data: tradingPairsFromApi, isLoading: isTradingPairsLoading } = useGetTradingPairsQuery();
  const [selectedExchanges, setSelectedExchanges] = useState<Exchange[]>([]);
  const [tempSelectedExchanges, setTempSelectedExchanges] = useState<Exchange[]>([]);
  const [exchangeDropdownOpen, setExchangeDropdownOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(AllCountries);
  const [selectedTradingPair, setSelectedTradingPair] = useState<ApiTradingPair | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const filteredExchanges = useMemo(() => {
    let exchanges = coinGeckoExchangesInitial || [];

    if (selectedTradingPair) {
      const supportedExchangeIds = selectedTradingPair.exchanges.map(ex => ex.exchange_id);
      exchanges = exchanges.filter(exchange => 
        supportedExchangeIds.includes(exchange.id)
      );
    }
    
    if (selectedCountry !== AllCountries) {
      exchanges = exchanges.filter(exchange => 
        exchange.country === selectedCountry
      );
    }
    
    exchanges = exchanges.filter(exchange =>
      exchange.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    return exchanges;
  }, [coinGeckoExchangesInitial, searchText, selectedTradingPair, selectedCountry]);

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
    
    let exchanges = coinGeckoExchangesInitial;
    
    if (selectedTradingPair) {
      const supportedExchangeIds = selectedTradingPair.exchanges.map(ex => ex.exchange_id);
      exchanges = exchanges.filter(exchange => 
        supportedExchangeIds.includes(exchange.id)
      );
    }
    
    const countryCounts = exchanges.reduce((acc, exchange) => {
      if (exchange.country) {
        acc[exchange.country] = (acc[exchange.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(countryCounts)
      .filter(country => countryCounts[country] >= 2)
      .sort();
  }, [coinGeckoExchangesInitial, selectedTradingPair]);


  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
  }; 

  const handleExchangeDropdownOpen = () => {
    setTempSelectedExchanges(selectedExchanges);
    setExchangeDropdownOpen(true);
  };

  const handleExchangeDropdownClose = () => {
    setExchangeDropdownOpen(false);
    setSearchText('');
  };

  const handleExchangeOk = () => {
    setSelectedExchanges(tempSelectedExchanges);
    handleExchangeDropdownClose();
  };

  const handleExchangeCancel = () => {
    setTempSelectedExchanges(selectedExchanges);
    handleExchangeDropdownClose();
  };

  return (
    <Box sx={{ height: "100%", p: 1 }}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Grid container spacing={2} alignItems="center" sx={{ alignItems: 'center' }}>
            <Grid item flexDirection={"row"} xs>
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
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Autocomplete
                        size="small"
                        value={selectedTradingPair}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            const exchangeNames = newValue.exchanges.map(ex => ex.name).sort();
                          }
                          
                          setSelectedTradingPair(newValue);
                          setSelectedExchanges([]);
                          setTempSelectedExchanges([]);
                          setSelectedCountry(AllCountries);
                        }}
                        options={tradingPairsFromApi || []}
                        getOptionLabel={(option) => option.pair}
                        isOptionEqualToValue={(option, value) => option.pair === value.pair}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("SelectTradingPair")}
                            InputProps={{
                              ...params.InputProps,
                              readOnly: true,
                            }}
                          />
                        )}
                        loading={isTradingPairsLoading}
                        loadingText={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                            <Typography variant="body2">Loading...</Typography>
                            <CircularProgress size={16} />
                          </Box>
                        }
                        sx={{ width: 200 }}
                      />
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        marginBottom: 1,
                        color: theme.palette.mode === 'light'? "black" : 'white',
                      }}
                    >
                      {t("SelectExchange")}:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Autocomplete<ExtendedExchange, true, false, false>
                        multiple
                        size="small"
                        disabled={!selectedTradingPair}
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
                        onChange={(event, newValue, reason) => {
                          if (reason === 'clear') {
                            setTempSelectedExchanges([]);
                            setSelectedExchanges([]);
                            handleExchangeDropdownClose();
                            return;
                          }

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
                        isOptionEqualToValue={(option, value) => option.id === value.id}
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
                        sx={{ width: 250 }}
                      />
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        marginBottom: 1,
                        color: theme.palette.mode === 'light'? "black" : 'white',
                      }}
                    >
                      {t("FilterExchangeByCountry")}:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Autocomplete
                        disableClearable
                        size="small"
                        disabled={!selectedTradingPair}
                        options={[AllCountries, ...filteredCountries]}
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
                  </Box>

                  {selectedTradingPair && selectedExchanges.length > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, flex: '4', minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <HelpOutlineIcon sx={{ fontSize: 18}} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {t("HowToReadThisMatrix")}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: "10px" }}>
                            <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50' }} />
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              {t("ProfitableArbitrageOpportunity")}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, backgroundColor: '#f44336', }} />
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              {t("LossSellPriceLowerThanBuyPrice")}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, flex: '5', minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <NearMeIcon sx={{ fontSize: 18,}} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {t("ReadingExample")}
                          </Typography>
                        </Box>
                        <Card sx={{ px: 1.2, py: 0.6, borderRadius: 1, backgroundColor: alpha(theme.palette.primary.main, 0.12), border: `1px solid ${theme.palette.primary.main}`, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <InfoOutlinedIcon sx={{ fontSize: 16,}} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {t("ExampleBuyBTCOnBybitSellOnGate")}
                          </Typography>
                        </Card>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {t("FindIntersectionOfBuyExchange")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, flex: '4', minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WarningAmberIcon sx={{ fontSize: 18, }} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {t("ImportantNote")}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {t("ProfitsShownExcludeTradingFees")}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      <Card
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          borderRadius: 2,
                          px: 2,
                          py: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${theme.palette.primary.main}`,
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: "white",
                            fontSize: '1.1rem',
                          }}
                        >
                          {selectedTradingPair ? 2 : 1}
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.primary.main,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              lineHeight: 1,
                            }}
                          >
                            {selectedTradingPair ? 'STEP 2' : 'STEP 1'}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              lineHeight: 1.2,
                            }}
                          >
                            {selectedTradingPair ? 'Choose Exchanges' : 'Select Trading Pair'}
                          </Typography>
                        </Box>
                      </Card>
                    </Box>
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

              {selectedTradingPair === null ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      
                    }}
                  >
                    <SignalCellularAltIcon sx={{ fontSize: 45, color: theme.palette.primary.main }} />
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {t("SelectATradingPairToBegin")}
                  </Typography>

                  <Card
                    sx={{
                      maxWidth: 400,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      borderLeft: `6px solid ${theme.palette.primary.main}`,
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '20%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.3),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                          }}
                        >
                          <SearchIcon 
                            sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                            }} 
                          />
                        </Box>
                        <Typography
                          variant="h7"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.9)'
                              : 'rgba(0, 0, 0, 0.9)',
                          }}
                        >
                          {t("ChooseYourPair")}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                          lineHeight: 1.6,
                        }}
                      >
                        {t("ChooseCryptocurrencyTradingPair")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ) : selectedExchanges.length === 0 ? (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 45, color: theme.palette.primary.main }} />
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {t("SelectExchangesToCompare")}
                  </Typography>

                  <Card
                    sx={{
                      maxWidth: 400,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      borderLeft: `6px solid ${theme.palette.primary.main}`,
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '20%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.3),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                          }}
                        >
                          <StoreIcon 
                            sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                            }} 
                          />
                        </Box>
                        <Typography
                          variant="h7"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.9)'
                              : 'rgba(0, 0, 0, 0.9)',
                          }}
                        >
                          {t("SelectExchanges")}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                          lineHeight: 1.6,
                          mb: 0.5,
                        }}
                      >
                        {t("SelectExchangesYouWantToPriceAgainst")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                          lineHeight: 1.6,
                        }}
                      >
                        <strong style={{ fontWeight: 900 }}>{t("ProTip")}</strong> {t("UseTheFilterExchangeByCountry")}
                      </Typography>
                    </CardContent>
                  </Card>
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
                    {t('ArbitrageMatrixTitle')} {selectedTradingPair?.pair}
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
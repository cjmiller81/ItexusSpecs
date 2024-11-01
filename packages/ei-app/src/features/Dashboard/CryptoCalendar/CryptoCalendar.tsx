import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { DashboardTile } from "@/features/Dashboard/DashboardTile";
import {
  Box,
  Divider,
  Grid,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CalendarEventTile from "./CalendarEventTile";
import { CalendarEvent, Category, Coin } from "./eventsResponseModel";
import { useGetCoinsQuery, useGetCategoriesQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import { CategoriesResponse } from "./eventsResponseModel";
import { SelectChangeEvent } from "@mui/material/Select";
import { OnFetchResponse, SymbolsLookupVirtualized, LookUpOption } from "components";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { setCompareOption } from "@/libs/redux/Slices/MarketCapEqualWeightChartSlice";

const TOP_COIN_LIMITS = {
  "top-100": 100,
  "top-300": 300,
  "top-500": 500,
};

const CryptoCalendar = ({
  loading,
  title,
  icon,
  calendarData,
  setSelectedDate,
  selectedDate,
  sx,
  onFetchPage,
}: {
  onFetchPage: (pageNumber: number, searchQuery: string) => Promise<OnFetchResponse>;
  loading: boolean;
  title: string;
  icon: React.ReactNode;
  calendarData: CalendarEvent[];
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  sx?: object;
}) => {
  const { t } = useTranslation("CryptoCalendar");
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchCoin, setSearchCoin] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [categoriesData, setCategoriesData] = useState<CategoriesResponse | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data: coinsData, isLoading: fetchLoading } = useGetCoinsQuery({ offset, limit });
  const { data: items } = useGetCategoriesQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (items) {
      setCategoriesData(items);
    }
  }, [items]);

  const categories = categoriesData?.body || [];
  const [coins, setCoins] = useState<Coin[]>([]);

  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    if (coinsData?.body) {
      setCoins(prevCoins => {
        const existingIds = new Set(prevCoins.map(coin => coin.id));
        const newCoins = coinsData.body.filter(coin => !existingIds.has(coin.id));
        return [...prevCoins, ...newCoins];
      });
    }
  }, [coinsData]);

  if (fetchLoading) return <div>downloading coins...</div>;

  const filteredCoins = coins.filter(coin => coin.fullname.toLowerCase().includes(searchCoin.toLowerCase()));
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase()),
  );

  const handleCoinSelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCoins(typeof value === "string" ? value.split(",") : value);
  };

  const handleCategorySelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const filteredEvents = calendarData.filter(event => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      event.categories.some(category => selectedCategories.includes(category.id.toString()));

    const matchesCoin =
      selectedCoins.length === 0 || event.coins.some(coin => selectedCoins.includes(coin.id.toString()));

    if (selectedCoins.some(coin => Object.keys(TOP_COIN_LIMITS).includes(coin))) {
      const limit =
        TOP_COIN_LIMITS[
          selectedCoins.find(coin => Object.keys(TOP_COIN_LIMITS).includes(coin)) as keyof typeof TOP_COIN_LIMITS
        ];
      const topCoins = coins.slice(0, limit).map(coin => coin.id.toString());
      return matchesCategory && event.coins.some(coin => topCoins.includes(coin.id.toString()));
    }

    return matchesCategory && matchesCoin;
  });

  const handleResetCoins = () => {
    setSelectedCoins([]);
    setSearchCoin("");
    setOffset(0);
  };

  const handleResetCategories = () => {
    setSelectedCategories([]);
    setSearchCategory("");
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (bottom && coins.length < (coinsData?.body?.length || 0)) {
      setOffset(prevOffset => prevOffset + limit);
    }
  };

  return (
    <DashboardTile
      title={title}
      icon={icon}
      loading={loading}
      sx={sx}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <FormControl sx={{ width: "49%" }}>
            <Select
              endAdornment={
                selectedCoins.length > 0 ? (
                  <IconButton
                    onClick={handleResetCoins}
                    size="small"
                    aria-label="clear selection"
                    sx={{ mr: 1, p: 0 }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null
              }
              multiple
              value={selectedCoins}
              onChange={handleCoinSelect}
              displayEmpty
              renderValue={selected => {
                if (selectedCoins.length === 0) {
                  return <em>Coins</em>;
                } else if (selectedCoins.length === 1) {
                  const selectedCoins = coins.find(coin => coin.id.toString() === selected[0]);
                  return selectedCoins ? selectedCoins.name : "";
                } else {
                  return `${selectedCoins.length} selected`;
                }
              }}
              sx={{
                minHeight: "30px", // Минимальная высота самого Select
                fontSize: "0.875rem", // Размер шрифта
                ".MuiSelect-select": {
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingLeft: "8px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "4px",
                },
              }}>
              <MenuItem disabled>
                <em>Coins</em>
              </MenuItem>
              <MenuItem disableRipple>
                <TextField
                  placeholder="Coin search"
                  variant="outlined"
                  size="small"
                  value={searchCoin}
                  onChange={e => setSearchCoin(e.target.value)}
                  sx={{ width: "100%", mb: 1 }}
                />
              </MenuItem>
              <MenuItem value="top-100">Top 100 Coins</MenuItem>
              <MenuItem value="top-300">Top 300 Coins</MenuItem>
              <MenuItem value="top-500">Top 500 Coins</MenuItem>
              {filteredCoins.length > 0 ? (
                filteredCoins.map(coin => (
                  <MenuItem
                    key={coin.id}
                    value={coin.id}>
                    <ListItemText primary={coin.fullname} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <em>No results</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl sx={{ width: "49%" }}>
            <SymbolsLookupVirtualized
              pageSize={50}
              onFetchPage={pageNumber => onFetchPage(pageNumber, inputSearch)}
              tooltip={t("CompareToSymbol", { ns: "Tooltips" })}
              loading={false}
              disableListWrap
              value={null}
              onChange={(_event, value) => {
                handleCoinSelect;
              }}
              autoComplete={true}
              onInputChange={(_event, value) => {}}
              filterOptions={x => x}
              inputValue={inputSearch}
              label={t("Coins")}
            />
          </FormControl>

          <FormControl sx={{ width: "49%" }}>
            <Select
              endAdornment={
                selectedCategories.length > 0 ? (
                  <IconButton
                    onClick={handleResetCategories}
                    size="small"
                    aria-label="clear selection"
                    sx={{ mr: 1, p: 0 }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null
              }
              multiple
              value={selectedCategories}
              onChange={handleCategorySelect}
              displayEmpty
              renderValue={selected => {
                if (selectedCategories.length === 0) {
                  return <em>Categories</em>;
                } else if (selectedCategories.length === 1) {
                  const selectedCategory = categories.find(category => category.id.toString() === selected[0]);
                  return selectedCategory ? selectedCategory.name : "";
                } else {
                  return `${selectedCategories.length} selected`;
                }
              }}
              sx={{
                minHeight: "30px",
                fontSize: "0.875rem",
                ".MuiSelect-select": {
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingLeft: "8px",
                },
              }}>
              <MenuItem disabled>
                <em>Categories</em>
              </MenuItem>
              <MenuItem disableRipple>
                <TextField
                  placeholder="Category search"
                  variant="outlined"
                  size="small"
                  value={searchCategory}
                  onChange={e => setSearchCategory(e.target.value)}
                  sx={{ width: "100%", mb: 1 }}
                />
              </MenuItem>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <MenuItem
                    key={category.id}
                    value={category.id.toString()}>
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <em>No results</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        <SimpleBarStyled
          style={{ height: "548px" }}
          onScroll={handleScroll}>
          <Grid
            container
            spacing={0}>
            {filteredEvents.map((event, index) => (
              <React.Fragment key={index}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ borderRadius: "0px" }}>
                  <CalendarEventTile event={event} />
                </Grid>
                {index !== filteredEvents.length - 1 && (
                  <Divider
                    sx={{ width: "100%" }}
                    variant="fullWidth"
                  />
                )}
              </React.Fragment>
            ))}
          </Grid>
        </SimpleBarStyled>

        <Divider
          sx={{ width: "100%" }}
          variant="fullWidth"
        />
      </Box>
    </DashboardTile>
  );
};

export default CryptoCalendar;

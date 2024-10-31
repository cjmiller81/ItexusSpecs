import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { DashboardTile } from "@/features/Dashboard/DashboardTile";
import { Box, Divider, Grid, ListItemText, MenuItem, Select, TextField, Chip, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CalendarEventTile from "./CalendarEventTile";
import { CalendarEvent, Coin } from "./eventsResponseModel";
import { useGetCoinsQuery, useGetCategoriesQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import { CategoriesResponse } from "./eventsResponseModel";
import { SelectChangeEvent } from "@mui/material/Select";

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
}: {
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

  useEffect(() => {
    if (items) {
      setCategoriesData(items);
    }
  }, [items]);

  const categories = categoriesData?.body || [];
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (coinsData?.body) {
      // Используем Set для уникальных монет
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

    // Если один из выбранных монет является топовой опцией, фильтруем события на основе этого
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
    setCoins([]);
    setOffset(0);
  };

  const handleResetCategories = () => {
    setSelectedCategories([]);
    setSearchCategory("");
  };

  const handleClearSelection = () => {
    handleResetCoins();
    handleResetCategories();
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;

    if (bottom && coins.length < (coinsData?.body?.length || 0)) {
      setOffset(prevOffset => prevOffset + limit); // Увеличиваем offset для загрузки следующей порции монет
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
          <Select
            multiple
            value={selectedCoins}
            onChange={handleCoinSelect}
            displayEmpty
            renderValue={selected => (
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                {Array.isArray(selected) && selected.length === 0 ? (
                  <em>Coins</em>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span>{Array.isArray(selected) ? selected.length : 0} selected</span>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        handleResetCoins();
                      }}
                      size="small"
                      edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
            sx={{ width: "49%", height: "30px" }}>
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

          <Select
            multiple
            value={selectedCategories}
            onChange={handleCategorySelect}
            displayEmpty
            renderValue={selected => (
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                {Array.isArray(selected) && selected.length === 0 ? (
                  <em>Categories</em>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span>{Array.isArray(selected) ? selected.length : 0} selected</span>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        handleResetCategories();
                      }}
                      size="small"
                      edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
            sx={{ width: "49%", height: "30px" }}>
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
        <Box sx={{ display: "flex", justifyContent: "center", margin: "3px 1px" }}>
          <Chip
            label="Clear All"
            color="error"
            variant="outlined"
            onClick={handleClearSelection}
            sx={{ cursor: "pointer" }}
          />
        </Box>
      </Box>
    </DashboardTile>
  );
};

export default CryptoCalendar;

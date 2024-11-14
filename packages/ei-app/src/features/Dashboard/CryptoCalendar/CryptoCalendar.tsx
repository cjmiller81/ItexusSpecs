import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { DashboardTile } from "@/features/Dashboard/DashboardTile";
import { Box, Divider, Grid, FormControl, MenuItem, ListItemText, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CalendarEventTile from "./CalendarEventTile";
import { CalendarEvent, CategoriesResponse, Coin } from "./eventsResponseModel";
import { useGetCategoriesQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ClearIcon, DateCalendar } from "@mui/x-date-pickers";
import { CustomDateSelector } from "./CustomDateSelector";
import { CoinsLookupVirtualized, OnFetchResponse } from "components";
import { CoinsLookUpOption } from "components/src/components/common/inputs/AppSymbolLookup/CoinsLookup";
import moment from "moment";

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
  setSelectedDate: (dateRange: [Date, Date]) => void;
  selectedDate: [Date, Date];
  sx?: object;
}) => {
  const { t } = useTranslation(["CryptoCalendar", "Common"]);
  const [selectedCoins, setSelectedCoins] = useState<CoinsLookUpOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [categoriesData, setCategoriesData] = useState<CategoriesResponse | null>(null);
  const { data: items } = useGetCategoriesQuery();

  useEffect(() => {
    if (items) {
      setCategoriesData(items);
    }
  }, [items]);

  const categories = categoriesData?.body || [];
  const [inputSearch, setInputSearch] = useState("");

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase()),
  );

  const handleCoinSelect = (value: CoinsLookUpOption[]) => {
    setSelectedCoins(value);
  };

  const getRenderValue = (selected: string[]) => {
    if (selected.length === 0) {
      return t("Category");
    }
    if (selected.length === 1) {
      const selectedCategory = categories.find(category => category.id.toString() === selected[0]);
      return selectedCategory ? selectedCategory.name : "";
    } else return `${selected.length} ${t("Selected", { ns: "Common" })}`;
  };

  const handleCategorySelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };
  console.log(calendarData);
  const filteredEvents = calendarData.filter(event => {
    const eventDate = moment(event.date_event).startOf("day");

    const isWithinDateRange =
      !selectedDate ||
      (eventDate.isSameOrAfter(selectedDate[0], "day") && eventDate.isSameOrBefore(selectedDate[1], "day"));

    const matchesCategory =
      selectedCategories.length === 0 ||
      event.categories.some(category => selectedCategories.includes(category.id.toString()));

    const matchesCoin =
      selectedCoins.length === 0 || event.coins.some(coin => selectedCoins.map(c => c.id).includes(coin.id.toString()));

    return isWithinDateRange && matchesCategory && matchesCoin;
  });

  const handleResetCategories = () => {
    setSelectedCategories([]);
    setSearchCategory("");
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
  };

  return (
    <DashboardTile
      title={title}
      icon={icon}
      loading={loading}
      sx={sx}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <FormControl sx={{ width: "50%" }}>
            <CoinsLookupVirtualized
              pageSize={50}
              onFetchPage={pageNumber => onFetchPage(pageNumber, inputSearch)}
              loading={false}
              disableListWrap
              value={selectedCoins}
              onChange={(_event, value) => {
                handleCoinSelect(value);
              }}
              autoComplete={true}
              onInputChange={(_event, value) => {
                setInputSearch(value);
              }}
              filterOptions={x => x}
              inputValue={inputSearch}
              label={t("Coins")}
            />
          </FormControl>

          <FormControl sx={{ width: "50%" }}>
            <Select
              endAdornment={
                selectedCategories.length > 0 ? (
                  <IconButton
                    onClick={handleResetCategories}
                    size="small"
                    sx={{ mr: 1, p: 0 }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null
              }
              multiple
              value={selectedCategories}
              onChange={handleCategorySelect}
              displayEmpty
              renderValue={getRenderValue}
              sx={{
                minHeight: "30px",
                ".MuiSelect-select": {
                  paddingTop: "4px",
                  textOverflow: "clip",
                  paddingBottom: "4px",
                  paddingLeft: "4px",
                  fontSize: 12,
                },
              }}>
              {filteredCategories.map(category => (
                <MenuItem
                  key={category.id}
                  value={category.id.toString()}>
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <SimpleBarStyled
          style={{ height: "548px" }}
          onScroll={handleScroll}>
          {filteredEvents.length > 0 ? (
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
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "190px",
                marginLeft: "15px",
                marginRight: "10px",

                fontSize: "22px",
              }}>
              No More Сurrent Events for this Date
            </Box>
          )}
        </SimpleBarStyled>

        <Divider
          sx={{ width: "100%" }}
          variant="fullWidth"
        />
        <Box sx={{ display: "flex", justifyContent: "center", margin: "3px 1px" }}>
          <CustomDateSelector
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </Box>
      </Box>
    </DashboardTile>
  );
};

export default CryptoCalendar;

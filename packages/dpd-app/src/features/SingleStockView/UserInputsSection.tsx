import { Grid, Typography, TextField, Box, Button, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { Market } from "@/models/Market";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useGetStockDataQuery } from "../stockApi";
import { BasicTable, nativeBarSx } from "components";
import { getMarketTableColumns } from "@/constants/ColumnsDefs/MarketTableColumns";

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

const UserInputsSection = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ticker, setTicker] = useState("");
  const [filteredData, setFilteredData] = useState<Market[]>([]);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [tickerError, setTickerError] = useState(false);
  const { t } = useTranslation("UserInputsSection");
  const [statisticsData, setStatisticsData] = useState({
    totalVolume: 0,
    totalBought: 0,
    totalSold: 0,
    avgTotalVolume: 0,
    avgBuySellRatio: 0,
    avgBuyVolume: 0,
    avgSellVolume: 0,
  });

  const [fetchData, setFetchData] = useState(false);

  const { data, isFetching } = useGetStockDataQuery({
    stocksTicker: ticker,
    fromDate: startDate ? moment.utc(startDate).startOf("day").toISOString() : '',
    toDate: endDate ? moment.utc(endDate).startOf("day").toISOString() : '',
  }, { skip: !fetchData });

  const validateFields = () => {
    let valid = true;
    if (!startDate) {
      setStartDateError(true);
      valid = false;
    }

    if (!endDate) {
      setEndDateError(true);
      valid = false;
    }

    if (!ticker.trim()) {
      setTickerError(true);
      valid = false;
    }

    return valid;
  };

  const handleDateChange = (e, type) => {
    const newDate = e.target.value ? moment.utc(e.target.value).startOf("day").toDate() : null;

    if (type === "start") {
      setStartDate(newDate);
    }
    if (type === "end") {
      setEndDate(newDate);
    }
  };

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
    setTickerError(false);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculateStatistics = (data: Market[]) => {
    const totalVolume = data.reduce((acc, item) => acc + item.totalVolume, 0);
    const totalBought = data.reduce((acc, item) => acc + item.bought, 0);
    const totalSold = data.reduce((acc, item) => acc + item.sold, 0);
    const avgTotalVolume = data.length > 0 ? totalVolume / data.length : 0;
    const avgBuySellRatio = 0;
    const avgBuyVolume = data.length > 0 ? totalBought / data.length : 0;
    const avgSellVolume = data.length > 0 ? totalSold / data.length : 0;

    return {
      totalVolume,
      totalBought,
      totalSold,
      avgTotalVolume,
      avgBuySellRatio,
      avgBuyVolume,
      avgSellVolume,
    };
  };

  useEffect(() => {
    if (data) {
      const updatedData = data.map(item => ({
        ...item,
        tradeReportDate: moment.utc(item.tradeReportDate).local().toDate(),
      }));
  
      updatedData.sort((a, b) => {
        const dateA = a.tradeReportDate;
        const dateB = b.tradeReportDate;
        return dateB.getTime() - dateA.getTime();
      });
  
      setFilteredData(updatedData);

      const statistics = calculateStatistics(updatedData);
      setStatisticsData(statistics);
    }
  }, [data]);
  

  const handleRunModel = () => {
    const isValid = validateFields();
    if (isValid) {
      setStartDateError(false);
      setEndDateError(false);
      setTickerError(false);
      setFetchData(true);
    } else {
      setFilteredData([]);
      setStatisticsData({
        totalVolume: 0,
        totalBought: 0,
        totalSold: 0,
        avgTotalVolume: 0,
        avgBuySellRatio: 0,
        avgBuyVolume: 0,
        avgSellVolume: 0,
      });
    }
  };

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12} md={4.1}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item>
            <Typography variant="h7">{t("Ticker")}</Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              placeholder={t("EnterTicker")}
              size="small"
              onChange={handleTickerChange}
              sx={{
                width: 175,
                fontSize: "12px",
                paddingLeft: "25px",
                "& .MuiOutlinedInput-root": {
                  borderColor: tickerError ? "red" : undefined,
                },
              }}
              error={tickerError}
              helperText={tickerError ? t("TickerIsRequired") : ""}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item>
            <Typography variant="h7">{t("StartDate")}</Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              type="date"
              size="small"
              sx={{
                width: 150,
                fontSize: "12px",
                "& .MuiOutlinedInput-root": {
                  borderColor: startDateError ? "red" : undefined,
                },
              }}
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) => handleDateChange(e, "start")}
              error={startDateError}
              helperText={startDateError ? t("StartIsRequired") : ""}
            />
          </Grid>
          <Grid item>
            <Typography variant="h7">{t("EndDate")}</Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              type="date"
              size="small"
              sx={{
                width: 150,
                fontSize: "12px",
                "& .MuiOutlinedInput-root": {
                  borderColor: endDateError ? "red" : undefined,
                },
              }}
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) => handleDateChange(e, "end")}
              error={endDateError}
              helperText={endDateError ? t("EndIsRequired") : ""}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" mb={2} sx={{ paddingLeft: "80px" }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "150px", color: "white", textTransform: "none" }}
              onClick={handleRunModel}
            >
              {t("RunModel")}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: "0px", marginBottom: "20px", width: "100vw", left: 0, position: "absolute", top: "auto" }} />
      </Grid>

      <Grid item xs={12} md={5}>
        <Typography variant="h6" sx={{ marginTop: "-18px", fontSize: "16px" }}>
          {t("TotalStatistics")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("TotalVolume")}:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formatNumber(statisticsData.totalVolume)}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("TotalBought")}:</Typography>
                  <Typography variant="body1" sx={{ color: "green", fontWeight: 'bold' }}>{formatNumber(statisticsData.totalBought)}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("TotalSold")}:</Typography>
                  <Typography variant="body1" sx={{ color: "#DC143C", fontWeight: 'bold' }}>{formatNumber(statisticsData.totalSold)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("AvgTotalVolume")}:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formatNumber(statisticsData.avgTotalVolume)}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("AvgBuy-SellRatio")}:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formatNumber(statisticsData.avgBuySellRatio)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("AvgBuyVolume")}:</Typography>
                  <Typography variant="body1" sx={{ color: "green", fontWeight: 'bold' }}>{formatNumber(statisticsData.avgBuyVolume)}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h7">{t("AvgSellVolume")}:</Typography>
                  <Typography variant="body1" sx={{ color: "#DC143C", fontWeight: 'bold' }}>{formatNumber(statisticsData.avgSellVolume)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={9.2}>
        <Box sx={tableScrollSx}>
          <BasicTable rows={filteredData} 
            columns={getMarketTableColumns()}
            getRowId={(row) => row.tradeReportDate}
            checkboxSelection = {false}
           />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserInputsSection;

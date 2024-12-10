import { Grid, Typography, TextField, Box, Button, Divider, useTheme } from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";
import { BasicTable, nativeBarSx } from "components";
import { getMarketTableColumns } from "@/constants/ColumnsDefs/MarketTableColumns";
import { useState } from "react";
import { Market } from "@/models/Market";
import { useTranslation } from "react-i18next";
import {tableData} from "@/mocks/tableData";
import moment from "moment";

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const MarketTable = styled(BasicTable)(({ theme }) => ({
  height: "calc(100vh - 120px)",
  maxHeight:"530px",
  display: "flex",
    mt: 2,
    
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "auto !important",
    },
    "& .MuiDataGrid-main": {
      height: "auto",
      maxHeight: "100%",
      flex: 1,
    },
    "& .MuiDataGrid-footerContainer": {
      height: "40px",
    },
    "& .MuiDataGrid-row": {
      maxHeight: "1000px !important",
    },
    ".MuiDataGrid-cell--withRenderer": {
      maxHeight: "1000px !important",
    },
    "& .MuiDataGrid-row--editing": {
      border: "solid",
      borderWidth: "1px",
      borderColor: theme.palette.primary.main,
    },
    "& .MuiDataGrid-cell--editing[data-field=walletName]": {
      border: "solid",
      borderWidth: "1px",
      borderColor: theme.palette.primary.main,
      backgroundColor:
        theme.palette.mode === "dark"
          ? darken(theme.palette.primary.main, 0.6)
          : lighten(theme.palette.primary.main, 0.7),
    },
    ".MuiDataGrid-withBorderColor": {
      bgColor: "transparent",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "black",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#9E9E9E",
      fontWeight: "bold",
    },
  }));

const UserInputsSection = () => {
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  
    const [ticker, setTicker] = useState('');
    const [filteredData, setFilteredData] = useState<Market[]>([]);
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
    const theme = useTheme();

    const [formErrors, setFormErrors] = useState({
      ticker: false,
      startDate: false,
      endDate: false,
    });
    const handleDateChange = (e, type) => {
      const newDate = e.target.value ? moment.utc(e.target.value) : null; 
      if (type === "start") setStartDate(newDate);
      if (type === "end") setEndDate(newDate);
    };
    
      const handleTickerChange = (e) => {
        setTicker(e.target.value);
      };
    
      const filterDataByDateRange = (start: moment.Moment | null, end: moment.Moment | null): Market[] => {
        if (!start || !end) return tableData;
      
        const startDate = moment.utc(start.startOf('day')).valueOf();
        const endDate = moment.utc(end.endOf('day')).valueOf();
      
        return tableData.filter((data: Market) => {
          const dataDate = moment.utc(data.date).valueOf();
          return dataDate >= startDate && dataDate <= endDate;
        });
      };   
    
      const handleRunModel = () => {
        const newFormErrors = {
          ticker: !ticker,
          startDate: !startDate,
          endDate: !endDate,
        };
    
        setFormErrors(newFormErrors);
    
        if (newFormErrors.ticker || newFormErrors.startDate || newFormErrors.endDate) {
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
          return;
        }
    
        const filtered = filterDataByDateRange(startDate, endDate);
        const updatedData = filtered.map((item) => ({
          ...item,
          symbol: ticker || item.symbol,
        }));
        setFilteredData(updatedData);
    
        const newStats = calculateStatistics(updatedData);
        setStatisticsData(newStats);
      };
      
      const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(value);
      };

      const calculateStatistics = (data: Market[]) => {
        const totalVolume = data.reduce((acc, item) => acc + item.total, 0);
        const totalBought = data.reduce((acc, item) => acc + item.bought, 0);
        const totalSold = data.reduce((acc, item) => acc + item.sold, 0);
        const avgTotalVolume = data.length > 0 ? totalVolume / data.length : 0;
        const avgBuySellRatio = data.length > 0 ? data.reduce((acc, item) => acc + item.buyRatio, 0) / data.length : 0;
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
      

  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12} md={3.7}>

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
              sx={{ width: 175, fontSize: "12px", paddingLeft: "25px"}}
              error={formErrors.ticker}
              helperText={formErrors.ticker ? t("Ticker field is required") : ""}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item >
            <Typography variant="h7">{t("StartDate")}</Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              type="date"
              size="small"
              sx={{ width: 150, fontSize: "12px" }}
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate ? startDate.utc().format("YYYY-MM-DD") : ""}
              onChange={(e) => handleDateChange(e, "start")}
              error={formErrors.startDate} // Ошибка показывается, если дата не выбрана
              helperText={formErrors.startDate ? t("Start date is required") : ""}
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
              sx={{ width: 150, fontSize: "12px" }}
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate ? endDate.utc().format("YYYY-MM-DD") : ""}
              onChange={(e) => handleDateChange(e, "end")}
              error={formErrors.endDate}
              helperText={formErrors.endDate ? t("End date is required") : ""}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" mb={2} sx={{paddingLeft:"80px"}}>
          <Grid item>
            <Button 
             variant="contained"
             color="primary"
             sx={{width: "150px", color: "white", textTransform: "none"}}
             onClick={handleRunModel}
             >
              {t("RunModel")}
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "0px", marginBottom: "20px", width: "100vw", left: 0, position: "absolute", top: "auto" }} />
      </Grid>

      <Grid item xs={12} md={5}>
  <Typography variant="h6"sx ={{marginTop:"-18px", fontSize:"16px"}}>
    {t("TotalStatistics")}
  </Typography>

  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("TotalVolume")}:</Typography>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>{formatNumber(statisticsData.totalVolume)}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("TotalBought")}:</Typography>
            <Typography variant="body1" sx={{color: "green", fontWeight: 'bold'}}>{formatNumber(statisticsData.totalBought)}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("TotalSold")}:</Typography>
            <Typography variant="body1" sx={{color: "#DC143C", fontWeight: 'bold'}}>{formatNumber(statisticsData.totalSold)}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={4}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgTotalVolume")}:</Typography>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>{formatNumber(statisticsData.avgTotalVolume)}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgBuy-SellRatio")}:</Typography>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>{formatNumber(statisticsData.avgBuySellRatio)}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={4}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgBuyVolume")}:</Typography>
            <Typography variant="body1" sx={{color: "green", fontWeight: 'bold'}}>{formatNumber(statisticsData.avgBuyVolume)}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgSellVolume")}:</Typography>
            <Typography variant="body1" sx={{color: "#DC143C", fontWeight: 'bold'}}>{formatNumber(statisticsData.avgSellVolume)}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Grid>

      <Grid item xs={12} md={9.2}>
        <MarketTable
          sx={{
            ...tableScrollSx,
            width: "100%",
          }}
          hideFooter
          rowSelection={false}
          checkboxSelection={false}
          getRowId={(row) => row.id}
          columns={getMarketTableColumns()}
          rows={filteredData} 
        />
      </Grid>
    </Grid>
  );
};

export default UserInputsSection;

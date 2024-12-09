import { Grid, Typography, TextField, Box, Button, Divider } from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";
import { BasicTable, nativeBarSx } from "components";
import { getMarketTableColumns } from "@/constants/ColumnsDefs/MarketTableColumns";
import { useState } from "react";
import { Market } from "@/models/Market";
import { useTranslation } from "react-i18next";
import {tableData} from "@/mocks/tableData";
import { statisticsData } from "@/mocks/statisticsData";

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const MarketTable = styled(BasicTable)(({ theme }) => ({
    minHeight: 300,
    mt: 2,
    display: "grid",
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "auto !important",
    },
    "& .MuiDataGrid-main": {
      height: "auto",
      maxHeight: "400px",
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
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
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
    
    const handleDateChange = (e, type) => {
        const newDate = e.target.value ? new Date(e.target.value) : null;
        if (type === "start") setStartDate(newDate);
        if (type === "end") setEndDate(newDate);
      };
    
      const handleTickerChange = (e) => {
        setTicker(e.target.value);
      };
    
      const filterDataByDateRange = (start: Date | null, end: Date | null): Market[] => {
        if (!start || !end) return tableData;
      
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
      
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
      
        return tableData.filter((data: Market) => {
          const dataDate = new Date(data.date);
          return dataDate >= startDate && dataDate <= endDate;
        });
      };
    
      const handleRunModel = () => {
        if (!startDate || !endDate) {
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
        } else {
          const filtered = filterDataByDateRange(startDate, endDate);
          const updatedData = filtered.map(item => ({
            ...item,
            symbol: ticker || item.symbol,
          }));
          setFilteredData(updatedData);
      
          const newStats = calculateStatistics(updatedData);
          setStatisticsData(newStats);
        }
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
              sx={{ width: 175, fontSize: "12px", paddingLeft: "25px" }}
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
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) => handleDateChange(e, "start")}
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
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) => handleDateChange(e, "end")}
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

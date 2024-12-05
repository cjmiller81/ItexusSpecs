import { Grid, Typography, TextField, Box, Button, Divider } from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";
import { BasicTable, nativeBarSx } from "components";
import { getMarketTableColumns } from "@/constants/ColumnsDefs/MarketTableColumns";
import { useState } from "react";
import { Market } from "@/models/Market";
import { useTranslation } from "react-i18next";

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

const statisticsData = {
    totalVolume: "30,896,859",
    totalBought: "18,383,879",
    totalSold: "12,512,980",
    avgTotalVolume: "2,808,805",
    avgBuySellRatio: "1.65", 
    avgBuyVolume: "5,178,663",
    avgSellVolume: "3,290,740",
  };

const tableData = [
  { id: 1, date: '11/22/2024', symbol: 'NVDA', bought: 581990, sold: 211559, avg: 11, buyRatio: 2.75, dpIndex: 73, total: 793549 },
  { id: 2, date: '11/21/2024', symbol: 'NVDA', bought: 2107562, sold: 1022774, avg: 41, buyRatio: 2.06, dpIndex: 67, total: 3130336 },
  { id: 3, date: '11/20/2024', symbol: 'NVDA', bought: 698501, sold: 342070, avg: 13, buyRatio: 2.04, dpIndex: 67, total: 1040571 },
  { id: 4, date: '11/17/2024', symbol: 'NVDA', bought: 418428, sold: 207406, avg: 8, buyRatio: 2.02, dpIndex: 67, total: 625834 },
  { id: 5, date: '11/16/2024', symbol: 'NVDA', bought: 1475371, sold: 769063, avg: 28, buyRatio: 1.92, dpIndex: 66, total: 2244434 },
  { id: 6, date: '11/15/2024', symbol: 'NVDA', bought: 1512174, sold: 843011, avg: 29, buyRatio: 1.79, dpIndex: 64, total: 2355185 },
  { id: 7, date: '11/14/2024', symbol: 'NVDA', bought: 9326065, sold: 5839808, avg: 180, buyRatio: 1.60, dpIndex: 61, total: 15165873 },
  { id: 8, date: '11/13/2024', symbol: 'NVDA', bought: 324527, sold: 252691, avg: 8, buyRatio: 1.28, dpIndex: 56, total: 577218 },
  { id: 9, date: '11/10/2024', symbol: 'NVDA', bought: 813088, sold: 1026979, avg: 31, buyRatio: 0.79, dpIndex: 44, total: 1840067 },
  { id: 10, date: '11/09/2024', symbol: 'NVDA', bought: 375676, sold: 643717, avg: 20, buyRatio: 0.58, dpIndex: 37, total: 1019393 },
  { id: 11, date: '11/08/2024', symbol: 'NVDA', bought: 750497, sold: 1353902, avg: 41, buyRatio: 0.55, dpIndex: 36, total: 2104399 },
].map(item => ({
    ...item,
    date: new Date(item.date),
  }));;

const UserInputsSection = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [ticker, setTicker] = useState('');
    const [filteredData, setFilteredData] = useState<Market[]>([]);
    const { t } = useTranslation("UserInputsSection");
    
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
        } else {
          const filtered = filterDataByDateRange(startDate, endDate);
          const updatedData = filtered.map(item => ({
            ...item,
            symbol: ticker || item.symbol,
          }));
          setFilteredData(updatedData);
        }
      };

  return (
    <Grid container spacing={3} alignItems="flex-start">
      <Grid item xs={12} md={3.8}>

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
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>{statisticsData.totalVolume}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("TotalBought")}:</Typography>
            <Typography variant="body1" sx={{color: "green", fontWeight: 'bold'}}>{statisticsData.totalBought}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("TotalSold")}:</Typography>
            <Typography variant="body1" sx={{color: "#DC143C", fontWeight: 'bold'}}>{statisticsData.totalSold}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={4}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgTotalVolume")}:</Typography>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>{statisticsData.avgTotalVolume}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgBuy-SellRatio")}:</Typography>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>{statisticsData.avgBuySellRatio}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={4}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgBuyVolume")}:</Typography>
            <Typography variant="body1" sx={{color: "green", fontWeight: 'bold'}}>{statisticsData.avgBuyVolume}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h7">{t("AvgSellVolume")}:</Typography>
            <Typography variant="body1" sx={{color: "#DC143C", fontWeight: 'bold'}}>{statisticsData.avgSellVolume}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Grid>

      <Grid item xs={12} md={9}>
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

import { Grid, Typography, TextField, Box, Button, Divider } from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";
import { BasicTable, nativeBarSx } from "components";
import { getMarketTableColumns } from "@/constants/ColumnsDefs/MarketTableColumns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { tableSectorsData } from "@/mocks/tableSectorsData";
import { Market } from "@/models/Market";

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

const UserInputsSectorsSection = () => {
    const [date, setDate] = useState < Date | null > (null);
    const [filteredData, setFilteredData] = useState < Market[] > ([]);
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
        setDate(newDate);
    };


    const filterDataByDate = (selectedDate: Date | null): Market[] => {
        if (!selectedDate) return [];

        const targetDate = new Date(selectedDate);
        targetDate.setHours(0, 0, 0, 0);

        return tableSectorsData.filter((data: Market) => {
            const dataDate = new Date(data.date);
            dataDate.setHours(0, 0, 0, 0); 
            return dataDate.getTime() === targetDate.getTime();
        });
    };

    const handleRunModel = () => {
        if (!date) {
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
            const filtered = filterDataByDate(date);
            const updatedData = filtered.map(item => ({
                ...item,
                symbol: item.symbol,
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
            <Grid item xs={12} md={3.5}>
                <Grid container spacing={4} alignItems="center" mb={2}sx={{paddingBottom:"20px"}}>
                    <Grid item >
                        <Typography variant="h7">{t("Date")}</Typography>
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
                            value={date ? date.toISOString().split("T")[0] : ""}
                            onChange={(e) => handleDateChange(e, "start")}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="center" mb={2} sx={{ paddingLeft: "63px" }}>
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

            <Grid item xs={12} md={5.5}>
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

export default UserInputsSectorsSection;

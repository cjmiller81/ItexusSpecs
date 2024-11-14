import { BottomNavigation, BottomNavigationAction, Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export default function UserDetailsSection({
  opened,
  user,
  orders,
  currentDayFills,
  workingOrders,
  bots,
  openPositions,
  theme,
  ...props
}) {
  const [navValue, setNavValue] = useState(0);
  const pageLinks = ["5WX30651", "5WX30652", "5WX30653"];
  const { t } = useTranslation(["UserDetailsSection", "ColumnsDefs"]);

  const columns = [
    { field: "fillTime", headerName: t("FillTime", { ns: "ColumnsDefs" }), width: 120 },
    { field: "symbol", headerName: t("Symbol", { ns: "ColumnsDefs" }), width: 80 },
    { field: "optionLeg", headerName: t("OptionLeg", { ns: "UserDetailsSection" }), width: 120 },
    { field: "side", headerName: t("Side", { ns: "UserDetailsSection" }), width: 80 },
    { field: "qty", headerName: t("QTY", { ns: "ColumnsDefs" }), width: 100 },
    { field: "avgPrice", headerName: t("AvgPrice", { ns: "ColumnsDefs" }), width: 120 },
  ];
  const orderColumns = [
    { field: "lastTimeUpdate", headerName: t("LastTimeUpdate", { ns: "UserDetailsSection" }), width: 110 },
    { field: "symbol", headerName: t("Symbol", { ns: "ColumnsDefs" }), width: 60 },
    { field: "optionLeg", headerName: t("OptionLeg", { ns: "UserDetailsSection" }), width: 130 },
    { field: "side", headerName: t("Side", { ns: "UserDetailsSection" }), width: 100 },
    { field: "qty", headerName: t("QTY", { ns: "ColumnsDefs" }), width: 50 },
    { field: "filledQTY", headerName: t("FilledQTY", { ns: "UserDetailsSection" }), width: 68 },
    { field: "avgPrice", headerName: t("AvgPrice", { ns: "ColumnsDefs" }), width: 68 },
    { field: "id", headerName: t("Id", { ns: "ColumnsDefs" }), width: 65 },
    { field: "status", headerName: t("Status", { ns: "ColumnsDefs" }), width: 73 },
    {
      field: "error",
      headerName: t("Error", { ns: "ColumnsDefs" }),
      width: 130,
      renderCell: params => {
        const { error } = params.row;
        return (
          <Tooltip
            title={error}
            placement="left"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#FFBF00",
                  maxWidth: "700px",
                  color: "black",
                  fontSize: "13px",
                  borderRadius: "4px",
                },
              },
            }}>
            {params.value}
          </Tooltip>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      fillTime: "2024-10-22 9:32",
      symbol: "/ESZ4",
      optionLeg: "241206P4400",
      side: "Short",
      qty: 2,
      avgPrice: 4.75,
    },
    {
      id: 2,
      fillTime: "2024-10-22 9:32",
      symbol: "/ESZ4",
      optionLeg: "241206C6400",
      side: "Short",
      qty: 2,
      avgPrice: 12.55,
    },
  ];

  const orderRows = [
    {
      rowId: 10,
      lastTimeUpdate: "2024-10-22 9:33",
      symbol: "/ESZ4",
      optionLeg: "241206P4400",
      side: t("BuyToClose", { ns: "UserDetailsSection" }),
      qty: 2,
      filledQTY: 0,
      avgPrice: 0,
      id: 147919,
      status: "Working",
      error: "",
    },
    {
      rowId: 20,
      lastTimeUpdate: "2024-10-22 9:33",
      symbol: "/ESZ4",
      optionLeg: "241206C6400",
      side: t("SellToClose", { ns: "UserDetailsSection" }),
      qty: 2,
      filledQTY: 0,
      avgPrice: 0,
      id: 147919,
      status: "Working",
      error: "",
    },
    {
      rowId: 30,
      lastTimeUpdate: "2024-10-22 9:32",
      symbol: "SPX",
      optionLeg: "241115C05735000",
      side: t("BuyToClose", { ns: "UserDetailsSection" }),
      qty: 1,
      filledQTY: 1,
      avgPrice: 2.53,
      id: 152876,
      status: "Filled",
      error: "",
    },
    {
      rowId: 40,
      lastTimeUpdate: "2024-10-22 9:32",
      symbol: "SPX",
      optionLeg: "241115P05715000",
      side: t("SellToClose", { ns: "UserDetailsSection" }),
      qty: 1,
      filledQTY: 1,
      avgPrice: 0.01,
      id: 152876,
      status: "Filled",
      error: "",
    },
    {
      rowId: 50,
      lastTimeUpdate: "2024-10-22 8:30",
      symbol: "SPX",
      optionLeg: "241115C05735000",
      side: t("BuyToClose", { ns: "UserDetailsSection" }),
      qty: 1,
      filledQTY: 0,
      avgPrice: 0,
      id: 152874,
      status: "Canceled",
      error: "",
    },
    {
      rowId: 60,
      lastTimeUpdate: "2024-10-22 8:30",
      symbol: "SPX",
      optionLeg: "241115P05715000",
      side: t("SellToClose", { ns: "UserDetailsSection" }),
      qty: 1,
      filledQTY: 0,
      avgPrice: 0,
      id: 152874,
      status: "Canceled",
      error: "",
    },
    {
      rowId: 70,
      lastTimeUpdate: "2024-10-22 8:10",
      symbol: "/ESZ4",
      optionLeg: "241206C6350",
      side: t("BuyToClose", { ns: "UserDetailsSection" }),
      qty: 2,
      filledQTY: 0,
      avgPrice: 0,
      id: 150450,
      status: "Error",
      error: t("BuyingPowerError", { ns: "UserDetailsSection" }),
    },
    {
      rowId: 80,
      lastTimeUpdate: "2024-10-22 8:10",
      symbol: "/ESZ4",
      optionLeg: "241206P4400",
      side: t("BuyToClose", { ns: "UserDetailsSection" }),
      qty: 2,
      filledQTY: 0,
      avgPrice: 0,
      id: 150450,
      status: "Error",
      error: t("BuyingPowerError", { ns: "UserDetailsSection" }),
    },
  ];

  return (
    <Box
      {...props}
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          align="left"
          sx={{ mt: 2, ml: 2 }}>
          Accounts
        </Typography>

        <BottomNavigation
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
          showLabels
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: 1,
          }}>
          {pageLinks.map((link, index) => (
            <BottomNavigationAction
              key={index}
              label={link}
              sx={{
                width: "80px",
                maxWidth: "80px",
                mr: 2,
                "&.Mui-selected": {
                  color: theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.grey[700]}`,
                },
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.8rem",
                  fontWeight: "normal",
                  padding: "4px 0",
                },
              }}
            />
          ))}
        </BottomNavigation>
        <Box
          sx={{
            borderTop: `0.5px solid grey`,
            width: "1000px !important",
          }}
        />
      </Box>
      <Typography
        sx={{
          marginLeft: "15px",
          backgroundColor: "#4cbb17",
          color: "black",
          padding: "8px 16px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          width: "fit-content",
        }}>
        {t("AccountBalance")} $350,000
      </Typography>

      <Box sx={{ height: "auto", width: "95%", marginLeft: "15px" }}>
        <Typography sx={{ marginTop: "20px" }}>{t("OpenPositions")}</Typography>
        <DataGrid
          slots={{
            footer: () => <></>,
          }}
          sx={{ marginTop: "10px", height: "auto" }}
          rows={rows}
          columns={columns}
          getRowId={row => row.id}
          rowHeight={45}
        />
      </Box>

      <Box sx={{ height: "auto", width: "95%", marginLeft: "15px" }}>
        <Typography sx={{ marginTop: "20px" }}>{t("Orders", { ns: "UserDetailsSection" })}</Typography>
        <DataGrid
          slots={{
            footer: () => <></>,
          }}
          sx={{ marginTop: "10px", height: "440px", width: "100%" }}
          rows={orderRows}
          columns={orderColumns}
          rowHeight={45}
          getRowId={row => row.rowId}
        />
      </Box>
    </Box>
  );
}

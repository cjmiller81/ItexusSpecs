import { BottomNavigation, BottomNavigationAction, Typography } from "@mui/material";
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

      <Box sx={{ height: "auto", width: "90%", marginLeft: "15px" }}>
        <Typography sx={{ marginTop: "20px" }}>{t("OpenPositions")}</Typography>
        <DataGrid
          slots={{
            footer: () => <></>,
          }}
          sx={{ marginTop: "10px", height: "162px" }}
          rows={rows}
          columns={columns}
          getRowId={row => row.id}
        />
      </Box>
    </Box>
  );
}

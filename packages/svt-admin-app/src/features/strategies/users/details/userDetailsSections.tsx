import { BottomNavigation, BottomNavigationAction, Typography, Tooltip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { fetchExchangeAccounts, fetchUserDetails } from "../userDetailsSlice";

export default function UserDetailsSection({
  opened,
  id,
  user,
  theme,
}) {
  const dispatch = useAppDispatch();
  const { exchangeAccounts, userDetails } = useAppSelector(state => state.adminDetails);
  const [navValue, setNavValue] = useState<number>(0);
  const { t } = useTranslation(["UserDetailsSection", "ColumnsDefs"]);

  useEffect(() => {
    if (id) {
      dispatch(fetchExchangeAccounts({ userId: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (
      id &&
      navValue >= 0 &&
      exchangeAccounts?.accounts &&
      exchangeAccounts.accounts.length > 0
    ) {
      dispatch(
        fetchUserDetails({
          userId: id,
          accountNumber: exchangeAccounts?.accounts[navValue].accountNumber,
        }),
      );
    }
  }, [dispatch, navValue, id, exchangeAccounts]);

  const pageLinks = useMemo(() => {
    if (exchangeAccounts) {
      return exchangeAccounts.accounts?.map(x => x.accountNumber);
    }

    return [];
  }, [exchangeAccounts]);

  const accountBalance = useMemo(() => {
    if (exchangeAccounts?.accounts && exchangeAccounts?.accounts?.length > 0) {
       const account = exchangeAccounts.accounts[navValue];

       return "$" + Number(`${account.accountBalance.units}.${account.accountBalance.nanos}`)
                       .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return "";
  }, [exchangeAccounts, navValue]);

  const columns = [
    { field: "timestamp", headerName: t("FillTime", { ns: "ColumnsDefs" }), width: 120, valueGetter: (params) => (new Date(params.row.timestamp.seconds * 1000)).toLocaleString()},
    { field: "underlyingSymbol", headerName: t("Symbol", { ns: "ColumnsDefs" }), width: 80 },
    { field: "marketSymbol", headerName: t("OptionLeg", { ns: "UserDetailsSection" }), width: 120, valueGetter: (params) =>  params.row.marketSymbol.split(' ').pop()},
    { field: "direction", headerName: t("Side", { ns: "UserDetailsSection" }), width: 80 },
    { field: "amountFilled", headerName: t("QTY", { ns: "ColumnsDefs" }), width: 100 },
    { field: "averagePrice", headerName: t("AvgPrice", { ns: "ColumnsDefs" }), width: 120 },
  ];
  const orderColumns = [
    { field: "timeLastUpdated", headerName: t("LastTimeUpdate", { ns: "UserDetailsSection" }), width: 110 },
    { field: "marketSymbol", headerName: t("Symbol", { ns: "ColumnsDefs" }), width: 60 },
    { field: "optionLeg", headerName: t("OptionLeg", { ns: "UserDetailsSection" }), width: 130 },
    { field: "marketAssetType", headerName: t("Side", { ns: "UserDetailsSection" }), width: 100 },
    { field: "qtyPlaced", headerName: t("QTY", { ns: "ColumnsDefs" }), width: 50 },
    { field: "qtyFilled", headerName: t("FilledQTY", { ns: "UserDetailsSection" }), width: 68 },
    { field: "priceAverageFill", headerName: t("AvgPrice", { ns: "ColumnsDefs" }), width: 68 },
    { field: "orderId", headerName: t("Id", { ns: "ColumnsDefs" }), width: 65 },
    { field: "orderStatus", headerName: t("Status", { ns: "ColumnsDefs" }), width: 73 },
    {
      field: "rejectReason",
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

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ mb: 3, marginLeft: "16px" }}>
        <Typography
          variant="h5"
          align="left"
          sx={{ mt: 2, ml: 1 }}>
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
          marginLeft: "25px",
          backgroundColor: "#4cbb17",
          color: "black",
          padding: "8px 16px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          width: "fit-content",
        }}>
        {t("AccountBalance")} {accountBalance}
      </Typography>

      <Box sx={{ height: "auto", width: "95%", marginLeft: "25px" }}>
        <Typography sx={{ marginTop: "20px" }}>{t("OpenPositions")}</Typography>
        <DataGrid
          slots={{
            footer: () => <></>,
          }}
          sx={{ marginTop: "10px", height: "auto" }}
          getRowId={_ => Math.random()}
          rows={userDetails?.positionList.positions ?? []}
          columns={columns}
          rowHeight={45}
        />
      </Box>

      <Box sx={{ height: "auto", width: "95%", marginLeft: "25px" }}>
        <Typography sx={{ marginTop: "20px" }}>{t("Orders", { ns: "UserDetailsSection" })}</Typography>
        <DataGrid
          slots={{
            footer: () => <></>,
          }}
          getRowId={row => row.orderId}
          sx={{ marginTop: "10px", height: "440px", width: "100%" }}
          rows={userDetails?.managedOrderList.managedOrderList_ ?? []}
          columns={orderColumns}
          rowHeight={45}
        />
      </Box>
    </Box>
  );
}

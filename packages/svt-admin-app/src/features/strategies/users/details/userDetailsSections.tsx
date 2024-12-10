import {
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { fetchExchangeAccounts, fetchUserDetails } from "../userDetailsSlice";
import { ManagedOrderRow } from "./managedOrderList";

export default function UserDetailsSection({ opened, id, user, theme, ...props }) {
  const dispatch = useAppDispatch();
  const { exchangeAccounts, userDetails } = useAppSelector(state => state.adminDetails);
  const [navValue, setNavValue] = useState<number>(0);
  const [order, setOrder] = useState<"asc" | "desc" | undefined>("asc");
  const [orderBy, setOrderBy] = useState("");
  const { t } = useTranslation(["UserDetailsSection", "ColumnsDefs"]);

  useEffect(() => {
    if (id) {
      dispatch(fetchExchangeAccounts({ userId: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && navValue >= 0 && exchangeAccounts?.accounts && exchangeAccounts.accounts.length > 0) {
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

      return (
        "$" +
        Number(`${account.accountBalance.units}.${account.accountBalance.nanos}`).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }

    return "";
  }, [exchangeAccounts, navValue]);

  const columns = [
    {
      field: "timestamp",
      headerName: t("FillTime", { ns: "ColumnsDefs" }),
      width: 150,
      valueGetter: params => new Date(params.row.timestamp.seconds * 1000).toLocaleString(),
    },
    { field: "underlyingSymbol", headerName: t("Symbol", { ns: "ColumnsDefs" }) },
    {
      field: "marketSymbol",
      headerName: t("OptionLeg", { ns: "UserDetailsSection" }),

      valueGetter: params => params.row.marketSymbol.split(" ").pop(),
    },
    { field: "direction", headerName: t("Side", { ns: "UserDetailsSection" }) },
    { field: "amountFilled", headerName: t("QTY", { ns: "ColumnsDefs" }) },
    { field: "averagePrice", headerName: t("AvgPrice", { ns: "ColumnsDefs" }) },
  ];
  const orderColumns = [
    { id: "timeLastUpdated.seconds", label: t("LastTimeUpdate"), width: 100 },
    { id: "marketSymbol", label: t("Symbol"), width: 2 },
    { id: "orderType", label: t("SpreadType"), width: 100 },
    { id: "qtyPlaced", label: t("QtyPlaced"), width: 80 },
    { id: "qtyFilled", label: t("QtyFilled"), width: 80 },
    { id: "priceLimit", label: t("SpreadPrice"), width: 100 },
    { id: "priceAverageFill", label: t("AvgFillPrice"), width: 100 },
    { id: "exchangeOrderId", label: t("OrderId"), width: 60 },
    { id: "orderStatus", label: t("Status"), width: 60 },
    { id: "source", label: t("Source"), width: 80 },
    { id: "rejectReason", label: t("Error"), width: 30, maxWidth: 170 },
  ];

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = property => () => {
    handleRequestSort(property);
  };

  const sortedRows = [...(userDetails?.managedOrderList.orders || [])].sort((a, b) => {
    if (orderBy) {
      const firstValue = orderBy.includes(".") ? orderBy.split(".").reduce((o, i) => o[i], a) : a[orderBy];
      const secondValue = orderBy.includes(".") ? orderBy.split(".").reduce((o, i) => o[i], b) : b[orderBy];

      if (order === "asc") {
        return firstValue < secondValue ? -1 : 1;
      } else {
        return firstValue > secondValue ? -1 : 1;
      }
    }
    return 0;
  });

  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginLeft: opened ? 0 : "50px",
        transition: "margin-left 0.3s ease",
      }}>
      <Box sx={{ mb: 3, marginLeft: "16px" }}>
        <Typography
          variant="h5"
          align="left"
          sx={{ mt: 2, ml: 1 }}>
          Accounts
        </Typography>

        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => setNavValue(newValue)}
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
        <TableContainer
          sx={{
            marginTop: "10px",
            maxHeight: "auto",
            width: "100%",
            height: "auto",
            border:
              theme.palette.mode !== "dark"
                ? "1px solid rgba(81, 81, 81, 0.27) !important"
                : "1px solid rgba(81, 81, 81, 1) !important",

            borderRadius: "5px",
            borderCollapse: "collapse",
          }}>
          <Table
            stickyHeader
            sx={{
              borderCollapse: "collapse",
            }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#009acf",
                    color: "white",
                    borderRight:
                      theme.palette.mode !== "dark"
                        ? "1px solid rgba(81, 81, 81, 1) !important"
                        : "1px solid rgba(224, 224, 224, 1) !important",
                    borderLeft:
                      theme.palette.mode !== "dark"
                        ? "1px solid rgba(81, 81, 81, 1) !important"
                        : "1px solid rgba(224, 224, 224, 1) !important",
                  }}
                />
                {orderColumns.map(column => (
                  <TableCell
                    key={column.id}
                    sx={{
                      backgroundColor: "#009acf",
                      color: "white",
                      width: column.width,
                      maxWidth: column.maxWidth,
                      borderRight:
                        theme.palette.mode !== "dark"
                          ? "1px solid rgba(81, 81, 81, 1) !important"
                          : "1px solid rgba(224, 224, 224, 1) !important",
                      borderLeft:
                        theme.palette.mode !== "dark"
                          ? "1px solid rgba(81, 81, 81, 1) !important"
                          : "1px solid rgba(224, 224, 224, 1) !important",
                    }}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={createSortHandler(column.id)}>
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map(row => (
                <ManagedOrderRow
                  key={row.exchangeOrderId}
                  row={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

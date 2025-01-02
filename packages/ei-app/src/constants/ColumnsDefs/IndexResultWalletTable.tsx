import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Typography } from "@mui/material";
import { WalletBalance } from "@/models/Wallet/WalletBalance";

i18next.setDefaultNamespace("ColumnsDefs");

export const getIndexResultWalletTableColumns = (): GridColDef<WalletBalance>[] => {
  return [
    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}>
          {params.row.tokenName}
        </Typography>
      ),
    },

    {
      field: "chain",
      headerName: t("Chain"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}>
          {params.row.chain}
        </Typography>
      ),
    },

    {
      field: "qty",
      headerName: t("Qty"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        if (!params.row.balance) return "--";
        return params.row.balance.toLocaleString("en-US", {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        });
      },
      renderCell: (params: GridRenderCellParams<WalletBalance, any, any>) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.80rem" }}>
          {params.formattedValue}
        </Typography>
      ),
    },
  ];
};

import { PositionAllocation } from "@/models/Wallet/PositionAllocation";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Typography } from "@mui/material";

i18next.setDefaultNamespace("ColumnsDefs");

export const getIndexPositionTableColumns = (): GridColDef<PositionAllocation>[] => {
  return [
    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}>
          {params.row.symbol}
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
        if (!params.row.qty) return "--";
        return params.row.qty.toLocaleString("en-US", {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        });
      },
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.80rem" }}>
          {params.formattedValue}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: t("Action"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}>
          {params.row.action}
        </Typography>
      ),
    },
    {
      field: "connection",
      headerName: t("Connection"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}>
          {params.row.connection}
        </Typography>
      ),
    },
  ];
};

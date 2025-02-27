import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Typography } from "@mui/material";

i18next.setDefaultNamespace("ColumnsDefs");

export const getCallSetListTableColumns = (): GridColDef[] => {
  return [
    {
      field: "ticker",
      headerName: t("Ticker"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.ticker}
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
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.action}
        </Typography>
      ),
    },
    {
      field: "optionType",
      headerName: t("Option Type"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.optionType}
        </Typography>
      ),
    },
    {
      field: "account",
      headerName: t("Account"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.account}
        </Typography>
      ),
    },
    {
      field: "dte",
      headerName: t("DTE"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.dte}
        </Typography>
      ),
    },
    {
      field: "range",
      headerName: t("Range"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.range}
        </Typography>
      ),
    },
    {
      field: "entryOrder",
      headerName: t("Entry Order"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.entryOrder}
        </Typography>
      ),
    },
    {
      field: "entryType",
      headerName: t("Entry Type"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.entryType}
        </Typography>
      ),
    },
    {
      field: "entryPrice",
      headerName: t("Entry Price"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.entryPrice}
        </Typography>
      ),
    },
    {
      field: "exitType",
      headerName: t("Exit Type"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.exitType}
        </Typography>
      ),
    },
    {
      field: "targetOrder",
      headerName: t("Target Order"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.targetOrder}
        </Typography>
      ),
    },
    {
      field: "targetPrice",
      headerName: t("Target Price"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.targetPrice}
        </Typography>
      ),
    },
    {
      field: "stopOrder",
      headerName: t("Stop Order"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.stopOrder}
        </Typography>
      ),
    },
    {
      field: "stopPrice",
      headerName: t("Stop Price"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.stopPrice}
        </Typography>
      ),
    },
    {
      field: "speed",
      headerName: t("Speed"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.speed}
        </Typography>
      ),
    },
  ];
};

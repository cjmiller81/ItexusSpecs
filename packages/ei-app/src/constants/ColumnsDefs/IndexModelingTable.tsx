import { Box } from "@mui/material"
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import i18next, { t } from "i18next"

i18next.setDefaultNamespace("ColumnsDefs")

export const getIndexModelingTableColumns = (): GridColDef[] => {
  return [
    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: props => {
        return (
          <Box
            component="div"
            sx={{ "& > img": { mr: 2, flexShrink: 0 }, display: "flex", alignItems: "flex-end" }}>
            <img
              loading="lazy"
              width="20"
              src={props.row.iconUrl}
              alt=""
            />
            <Box>{props.row.symbol}</Box>
          </Box>
        )
      },
    },
    {
      field: "price",
      headerName: t("Price"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row.price) return "--"
        return params.row.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      },
    },
    {
      field: "marketCap",
      headerName: t("MarketCap"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row.marketCap) return "--"
        return params.row.marketCap.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      },
    },
    {
      field: "weight",
      headerName: t("Weight"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => {
        return `${params.row.weight.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}%`
      },
    },
    {
      field: "qty",
      headerName: t("Qty"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row.price) return "--"
        return params.row.qty.toLocaleString("en-US", {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        })
      },
    },
  ]
}

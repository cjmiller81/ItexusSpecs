import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { IconCell } from "components"
import i18next, { t } from "i18next"
import { TopTokenData } from "./TopTokensTile"

i18next.setDefaultNamespace("ColumnsDefs")

export const getTopTokensColumnsDefs = (): GridColDef<TopTokenData>[] => {
  return [
    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<TopTokenData, any, any>) => (
        <IconCell
          symbol={params.row.symbol.toUpperCase()}
          iconUrl={params.row.iconUrl}
        />
      ),
    },
    {
      field: "price",
      headerName: t("Price"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
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
      valueGetter: params => {
        if (!params.row.marketCap) return "--"
        return params.row.marketCap.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      },
    },
    {
      field: "fulDilVal",
      headerName: t("FullyDilutedValuation"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        if (!params.row.fulDilVal) return "--"
        return params.row.fulDilVal.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      },
    },
  ]
}

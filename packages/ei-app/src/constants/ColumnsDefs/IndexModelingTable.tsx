import { IconCell } from "components"
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import i18next, { t } from "i18next"

i18next.setDefaultNamespace("ColumnsDefs")

export const getIndexModelingTableColumns = (): GridColDef<InvestingTableAsset>[] => {
  return [
    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<InvestingTableAsset, any, any>) => (
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
      field: "weight",
      headerName: t("Weight"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        return `${params.row.weight.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}%`
      },
    },
  ]
}

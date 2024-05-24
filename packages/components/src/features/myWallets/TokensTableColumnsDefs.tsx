import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import i18next from "i18next"

export const getTokenNamesColumns = (): GridColDef[] => {
  return [
    {
      field: "chainName",
      headerName: i18next.t("Chain", {ns: "ColumnsDefs"}),
      width: 100,
      disableExport: true,
      disableColumnMenu: true,
    },
    {
      field: "tokenName",
      headerName: i18next.t("TokenName", {ns: "ColumnsDefs"}),
      flex: 1,
    },
    {
      field: "balance",
      headerName: i18next.t("Amount", {ns: "ColumnsDefs"}),
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.balance.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })
      },
      flex: 1,
    },
    {
      field: "price",
      headerName: i18next.t("Price", {ns: "ColumnsDefs"}),
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row.price) return "--"
        return params.row.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      },
      flex: 1,
    },
    {
      field: "usdAmount",
      headerName: i18next.t("USDValue", {ns: "ColumnsDefs"}),
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row.usdAmount) return "--"
        return params.row.usdAmount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      },
      flex: 1,
    },
  ]
}

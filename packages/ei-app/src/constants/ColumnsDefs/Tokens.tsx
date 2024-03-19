import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import i18next, { t } from "i18next"

i18next.setDefaultNamespace("ColumnsDefs")
export const getTokenNamesColumns = (): GridColDef[] => {
  return [
    {
      field: "chainName",
      headerName: t("Chain"),
      width: 100,
      disableExport: true,
      disableColumnMenu: true,
    },
    {
      field: "tokenName",
      headerName: t("TokenName"),
      flex: 1,
    },
    {
      field: "balance",
      headerName: t("Amount"),
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
      headerName: t("Price"),
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
      headerName: t("USDValue"),
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

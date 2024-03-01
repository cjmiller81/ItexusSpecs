import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"

export const tokenNamesColumns: GridColDef[] = [
  {
    field: "tokenName",
    headerName: "Token Name",
    flex: 1,
  },
  {
    field: "balance",
    headerName: "Amount",
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
    headerName: "Price",
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
    headerName: "USD Value",
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

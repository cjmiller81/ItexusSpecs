import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"

export const tokenNamesColumns: GridColDef[] = [
  {
    field: "tokenName",
    headerName: "TokenName",
    width: 100,
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
    width: 100,
  },
  // Uncomment after the price is returned from the api

  // {
  //   field: "price",
  //   headerName: "Price",
  //   valueGetter: (params: GridValueGetterParams) => {
  //     return params.row.amount.toLocaleString("en-US", {
  //       minimumFractionDigits: 0,
  //       maximumFractionDigits: 6,
  //     })
  //   },
  //   width: 200,
  // },
  {
    field: "usdValue",
    headerName: "USD Value",
    // Uncomment after the price is returned from the api

    // valueGetter: (params: GridValueGetterParams) => {
    //   const value = params.row.balance * params.row.price
    //   return value.toLocaleString("en-US", {
    //     style: "currency",
    //     currency: "USD",
    //   })
    // },
    width: 100,
  },
]

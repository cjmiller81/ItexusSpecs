import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import { ICoin } from "@/services/backend-api.service"
import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../createAppSlice"
import { MarketCapEqualModelingState, initialState } from "./MarketCapWeightedModelingSlice"

export const marketCapEqualWeightModelingSlice = createAppSlice({
  name: "MarketCapEqualWeightModeling",
  initialState,
  reducers: create => ({
    setTokens: create.reducer((state, action: PayloadAction<number>) => {
      state.tokensCount = action.payload
      state.weight = 1 / action.payload
      calculateTableRows(state)
    }),
    setCapital: create.reducer((state, action: PayloadAction<number>) => {
      state.totalCapital = action.payload
      calculateTableRows(state)
    }),
    setPrefilteredData: create.reducer((state, action: PayloadAction<ICoin[]>) => {
      state.prefilteredData = action.payload.sort((a, b) => b.mCap - a.mCap)
      calculateTableRows(state)
    }),
  }),
})

function calculateTableRows(state: MarketCapEqualModelingState) {
  const newTableData = state.prefilteredData.slice(0, state.tokensCount).map<InvestingTableAsset>(data => ({
    tokenId: data.id,
    iconUrl: data.lURI,
    id: data.id,
    marketCap: data.mCap,
    symbol: data.sym,
    price: data.price,
    qty: (state.weight * state.totalCapital) / data.price,
    weight: state.weight * 100,
  }))
  state.tableData = newTableData
}
export const { setPrefilteredData, setTokens, setCapital } = marketCapEqualWeightModelingSlice.actions

import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import { PayloadAction } from "@reduxjs/toolkit"
import { Status, createAppSlice } from "components"
import { ICategory } from "components/src/models/token/ICatigory"
import { ICoin } from "components/src/models/token/ICoin"
import { IPlatform } from "components/src/models/token/IPlatform"

export interface MarketCapEqualModelingState {
  tokens: ICoin[]
  chains: IPlatform[]
  categories: ICategory[]
  statusFetchingModelingData: Status
  tokensCount: number
  totalCapital: number
  weight: number
  prefilteredData: ICoin[]
  tableData: InvestingTableAsset[]
}

const defaultTotalTokensCount: number = 10
export const initialState: MarketCapEqualModelingState = {
  statusFetchingModelingData: "idle",
  tokens: [],
  chains: [],
  categories: [],
  tokensCount: defaultTotalTokensCount,
  totalCapital: 1000,
  weight: 1 / defaultTotalTokensCount,
  prefilteredData: [],
  tableData: [],
}

export const marketCapWeightedModelingSlice = createAppSlice({
  name: "MarketCapWeightedModeling",
  initialState: {...initialState},
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
  const newTableData = state.prefilteredData.slice(0, state.tokensCount)

  const marketCapSum = newTableData.reduce((accumulator, tokenData) => {
    return accumulator + tokenData.mCap
  }, 0)

  const calculatedData = newTableData.map<InvestingTableAsset>(data => {
    const weightedValue = data.mCap / marketCapSum
    return {
      tokenId: data.id,
      iconUrl: data.lURI,
      id: data.id,
      marketCap: data.mCap,
      symbol: data.sym,
      price: data.price,
      qty: (weightedValue * state.totalCapital) / data.price,
      weight: weightedValue * 100,
    }
  })

  state.tableData = calculatedData
}
export const { setPrefilteredData, setTokens, setCapital } = marketCapWeightedModelingSlice.actions

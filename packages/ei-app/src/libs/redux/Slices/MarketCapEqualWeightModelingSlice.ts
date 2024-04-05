import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import { ICategory, ICoin, IPlatform } from "@/services/backend-api.service"
import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./WalletsSlice"

interface MarketCapEqualWeightModelingState {
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

const initialState: MarketCapEqualWeightModelingState = {
  statusFetchingModelingData: "idle",
  tokens: [],
  chains: [],
  categories: [],
  tokensCount: 7,
  totalCapital: 150,
  weight: 1 / 7,
  prefilteredData: [],
  tableData: []
}

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

function calculateTableRows(state: MarketCapEqualWeightModelingState) {
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

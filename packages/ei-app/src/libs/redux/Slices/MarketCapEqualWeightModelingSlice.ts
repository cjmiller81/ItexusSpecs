import { ITokenSetAllocation } from "@/containers/IndexModel/IndexModel.types"
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import { ICategory, ICoin, IPlatform } from "@/services/backend-api.service"
import { iconsApi } from "@/services/iconsService"
import { isFulfilled } from "@/utils/common"
import { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../RootReducer"
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
  prefilteredData: ITokenSetAllocation[]
  tableData: InvestingTableAsset[]
  iconsCache: { [id: string]: ICoin }
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
  tableData: [],
  iconsCache: {},
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
    setPrefilteredData: create.reducer((state, action: PayloadAction<ITokenSetAllocation[]>) => {
      state.prefilteredData = action.payload.sort((a, b) => b.marketCap - a.marketCap)
      calculateTableRows(state)
    }),
    updateIcons: create.asyncThunk(
      async (_, thunkApi): Promise<ICoin[]> => {
        const state = thunkApi.getState() as RootState
        const tableData = state.walletsReducer.MarketCapEqualWeightModeling.tableData

        const iconsTasks = tableData.filter(row => row.iconUrl === undefined).map(row => iconsApi.getbyId(row.tokenId))

        const tokenDetails = await Promise.allSettled(iconsTasks)
        const fulfilledValues = tokenDetails.filter(isFulfilled).map(p => p.value)

        return fulfilledValues
      },
      {
        fulfilled: (state, action) => {
          action.payload.forEach(icon => {
            state.iconsCache[icon.id] = icon
          })
          const newTableData = state.tableData.map<InvestingTableAsset>(row => {
            if (row.iconUrl) return row

            const icon = state.iconsCache[row.tokenId]
            return { ...row, iconUrl: icon?.lURI } as InvestingTableAsset
          })

          state.tableData = newTableData
        },
      },
    ),
  }),
})

function calculateTableRows(state: MarketCapEqualWeightModelingState) {
  state.tableData = state.prefilteredData.slice(0, state.tokensCount).map<InvestingTableAsset>(data => ({
    tokenId: data.id,
    iconUrl: state.iconsCache[data.id]?.lURI,
    id: data.id,
    marketCap: data.marketCap,
    symbol: data.symbol,
    price: data.price,
    qty: (state.weight * state.totalCapital) / data.price,
    weight: state.weight * 100,
  }))
}
export const { setPrefilteredData, setTokens, setCapital, updateIcons } = marketCapEqualWeightModelingSlice.actions

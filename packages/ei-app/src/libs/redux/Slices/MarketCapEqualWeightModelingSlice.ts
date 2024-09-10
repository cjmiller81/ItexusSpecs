import { filteredTokensApi, FilteredTokensResponse } from "@/features/Investing/filteredTokensApi";
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset";
import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "components";
import { defaultTotalTokensCount, initialState, MarketCapEqualModelingState } from "./MarketCapWeightedModelingSlice";

export const setTokenstCount = (state: MarketCapEqualModelingState, tokensCount: number | null) => {
  if (tokensCount === null) {
    state.tokensCount = null;
    state.weight = 1 / 0;
    return;
  }
  const tokensCountToSet = tokensCount === null ? defaultTotalTokensCount : tokensCount;
  const newTokensCount =
    tokensCountToSet > state.prefilteredData.length ? state.prefilteredData.length : tokensCountToSet;
  state.tokensCount = newTokensCount;
  state.weight = 1 / newTokensCount;
};

export const marketCapEqualWeightModelingSlice = createAppSlice({
  name: "MarketCapEqualWeightModeling",
  initialState: { ...initialState },
  reducers: create => ({
    setTokens: create.reducer((state, action: PayloadAction<number>) => {
      setTokenstCount(state, action.payload);
      calculateTableRows(state);
    }),
    setCapital: create.reducer((state, action: PayloadAction<number>) => {
      state.totalCapital = action.payload;
      calculateTableRows(state);
    }),
    fetchIndexModelingTokens: create.asyncThunk(
      async ({ filter, sort }: { filter: any; sort: any }, thunkApi): Promise<FilteredTokensResponse> => {
        return await filteredTokensApi.fetchFilteredTokens(sort, filter, 0, 100);
      },
      {
        fulfilled: (state, action) => {
          state.prefilteredData = action.payload.data;
          setTokenstCount(
            state,
            state.tokensCount === null && state.prefilteredData.length !== 0
              ? defaultTotalTokensCount
              : state.tokensCount,
          );
          calculateTableRows(state);
        },
      },
    ),
  }),
});

function calculateTableRows(state: MarketCapEqualModelingState) {
  const newTableData = state.prefilteredData.slice(0, state.tokensCount || 0).map<InvestingTableAsset>(data => ({
    tokenId: data.id,
    iconUrl: data.lURI,
    id: data.id,
    marketCap: data.mCap,
    symbol: data.sym,
    price: data.price,
    qty: (state.weight * state.totalCapital) / data.price,
    weight: state.weight * 100,
  }));
  state.tableData = newTableData;
}
export const { setTokens, setCapital, fetchIndexModelingTokens } = marketCapEqualWeightModelingSlice.actions;

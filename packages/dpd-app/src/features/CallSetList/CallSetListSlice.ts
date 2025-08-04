import { PayloadAction } from "@reduxjs/toolkit";
import { Status, createAppSlice } from "components";
import { TradePosition } from "@/models/TradePosition";
import { strategiesService } from "@/services/strategiesService";
import { EntryType, ExitTier, ExitType } from "@/models/DpdOptionScan";

export interface StockSliceState {
  positions: TradePosition[];
  statusFetchingStrategies: Status;
}

const initialState: StockSliceState = {
  positions: [],
  statusFetchingStrategies: "idle",
};

export const callSetListSlice = createAppSlice({
  name: "call-set-list",
  initialState,
  reducers: (create) => ({
    fetchStrategies: create.asyncThunk(
      async () => {
        const strategiesList = await strategiesService.getSchwab();
        
        // Helper functions to sum order quantities.
        const sumFilledUnits = (orders: Record<string, { units: number, nanos: number }>) =>
          Object.values(orders).reduce((sum, order) => sum + (order.units || 0), 0);
        const sumWorkingUnits = (orders: Record<string, { units: number, nanos: number }>) => 
          Object.values(orders).reduce((sum, units) => sum + (units.units || 0), 0);


        // Process each strategy: generate separate table rows for each position type and exit tier.
        const result: TradePosition[] = strategiesList.strategies.flatMap((strategy) => {
          const { strategyId, accountNumber, strategySettings } = strategy;
          const dteMin = strategySettings?.dteMin;
          const dteMax = strategySettings?.dteMax;

          // Map the entryType enum to the corresponding string value.
          let entryType = "";
          if (strategySettings) {
            switch (strategySettings.entryType) {
              case EntryType.ENTRY_USE_ASK:
                entryType = "USE_ASK";
                break;
              case EntryType.ENTRY_USE_BID:
                entryType = "USE_BID";
                break;
              case EntryType.ENTRY_USE_MID:
                entryType = "USE_MID";
                break;
              case EntryType.ENTRY_MARKET:
                entryType = "MARKET";
                break;
              default:
                entryType = "";
            }
          }

          // Determine exitType: if multiple exit tiers are present, use "OCO", otherwise "LIMIT".
          const exitTiers = strategySettings?.exitTiers;

          const processPosition = (position: any, type: "CALL" | "PUT" | "SHARES", originalQty: number): TradePosition[] => {
            if (!position) return [];

            // Get the ticker from the position object.
            const ticker = position.symbol || "";

            // Calculate the entry status and quantity:
            // If the sum of filledEntryOrders is greater than 0, the status is "Filled" with qty equal to the filled sum;
            // otherwise, use the sum of workingEntryOrders.
            let entryStatus = "Working";
            let qty = 0;
            if (position.filledEntryOrders) {
              const filled = sumFilledUnits(position.filledEntryOrders);
              if (filled > 0) {
                entryStatus = "Filled";
                qty = filled;
              } else if (position.workingEntryOrders) {
                qty = sumWorkingUnits(position.workingEntryOrders);
              }
            } else if (position.workingEntryOrders) {
              qty = sumWorkingUnits(position.workingEntryOrders);
            }
         
            // If no exit tiers are defined, return a single row with default target/stop values.
            if (!exitTiers || exitTiers.length === 0) {
              return [
                {
                  id: strategyId,
                  account: Number(accountNumber),
                  ticker: ticker,
                  optionType: type,
                  qty: qty,
                  dteMin: dteMin || 0,
                  dteMax: dteMax  || 0,
                  entryStatus: entryStatus  as "Working" | "Filled",
                  entryType: entryType,
                  entryPrice: 0, // Placeholder for ENTRY PRICE
                  exitType: undefined,
                  targetTierPercentage: 0,
                  stopTierPercentage: 0,
                  targetPrice: 0,
                  stopPrice: 0,
                },
              ];
            } else {
              // For each exit tier, create a separate row using the tier values for targetPrice and stopPrice.
              return exitTiers.map((tier: ExitTier) => {
                let targetTierPercentage = 0;
                let stopTierPercentage = 0;
                if (type === "CALL" || type === "PUT") {
                  targetTierPercentage = tier.optionTargetOffsetPercent;
                  stopTierPercentage = tier.optionStopOffsetPercent;
                } else if (type === "SHARES") {
                  targetTierPercentage = tier.stockTargetOffsetPercent;
                  stopTierPercentage = tier.stockStopOffsetPercent;
                }
                return {
                  id: strategyId,
                  account: Number(accountNumber),
                  ticker: ticker,
                  optionType: type,
                  qty: qty,
                  dteMin: dteMin,
                  dteMax: dteMax,
                  entryStatus: entryStatus,
                  entryType: entryType,
                  entryPrice: 0, // Placeholder for ENTRY PRICE
                  exitType: tier.exitType == ExitType.OCO ? "OCO" : "LIMIT",
                  targetTierPercentage: targetTierPercentage,
                  stopTierPercentage: stopTierPercentage,
                  targetPrice: 0,
                  stopPrice: 0,
                } as TradePosition;
              });
            }
          };

          // Process all available position types: CALL, PUT, and UNDERLYING (SHARES).
          const rows: TradePosition[] = [];
          rows.push(...processPosition(strategy.callLegPosition, "CALL", strategy.callLegOriginalQty));
          rows.push(...processPosition(strategy.putLegPosition, "PUT", strategy.putLegOriginalQty));
          rows.push(...processPosition(strategy.underlyingPosition, "SHARES", strategy.underlyingOriginalQty));
          return rows;
        });

        return result;
      },
      {
        pending: (state) => {
          state.statusFetchingStrategies = "loading";
        },
        fulfilled: (state, action: PayloadAction<TradePosition[]>) => {
          state.statusFetchingStrategies = "idle";
          state.positions = action.payload;
        },
        rejected: (state) => {
          state.statusFetchingStrategies = "failed";
        },
      }
    ),
  }),
});

export const { fetchStrategies } = callSetListSlice.actions;

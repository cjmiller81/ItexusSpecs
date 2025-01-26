import { Status, createAppSlice } from "components"
import { SettlementTableRow } from "./types"
import { settlementService } from "./service"
import moment from "moment"

export interface SettlementState {
  transactions: SettlementTableRow[]
  statusFetchingTransactions: Status
}

const initialState: SettlementState = {
  transactions: [],
  statusFetchingTransactions: "idle",
}

export const settlementSlice = createAppSlice({
  name: "customerTransaction",
  initialState,
  reducers: create => ({
    fetchTransactions: create.asyncThunk(
      async ({ fromDate, toDate }: { fromDate: Date, toDate: Date })  => {
        const fromOnlyDateStr = moment(fromDate).format("YYYY-MM-DD");
        const toOnlyDateStr = moment(toDate).format("YYYY-MM-DD");
        const [transactions, transactionHistories] = await Promise.all([
            settlementService.getTransactions(fromOnlyDateStr, toOnlyDateStr),
            settlementService.getTransactionHistories(fromOnlyDateStr, toOnlyDateStr)
          ]);
        return { transactions, transactionHistories };
      },
      {
        pending: state => {
          state.statusFetchingTransactions = "loading"
        },
        fulfilled: (state, action) => {          
          const allTransactions: SettlementTableRow[] = action.payload.transactionHistories.map((t) => {
           return {
            type: t.TransactionType,
            settlementId: t.TransactionID,
            time: t.Timestamp,
            date: t.Timestamp,
            amount: Number(t.Quantity),
            currency: t.Currency,
            status: action.payload.transactions.find(f => f.TransactionID === t.TransactionID)?.Status,
            reference: "",
            destination: ""
          }});

          const latestEntries = new Map<string | undefined, SettlementTableRow>();
          allTransactions.forEach(entry => {
            if (!latestEntries.has(entry.settlementId) 
              || new Date(latestEntries.get(entry.settlementId)!.date) < new Date(entry.date)) {
              latestEntries.set(entry.settlementId, entry);
            }
          });

          const result = Array.from(latestEntries.values());
          state.statusFetchingTransactions = "idle"
          state.transactions = result;
        },
        rejected: state => {
          state.statusFetchingTransactions = "failed"
        },
      },
    ),
  }),
})

export const { fetchTransactions } = settlementSlice.actions

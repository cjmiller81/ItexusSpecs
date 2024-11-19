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
          state.statusFetchingTransactions = "idle"
          state.transactions = action.payload.transactionHistories.map((t) => {
           return {
            type: t.TransactionType,
            settlementId: t.CustomerAddressID,
            time: t.Timestamp,
            date: t.Timestamp,
            amount: Number(t.Quantity),
            currency: t.Currency,
            status: action.payload.transactions.find(f => f.TransactionID === t.TransactionID)?.Status,
            reference: t.TransactionID,
            destination: ""
          }
        })
        },
        rejected: state => {
          state.statusFetchingTransactions = "failed"
        },
      },
    ),
  }),
})

export const { fetchTransactions } = settlementSlice.actions

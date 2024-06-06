export interface CapitalAllocation {
  id: string
  userId: string
  accountNumber: string
  originalCapitalAllocation: number
  capitalAllocation: number
  dailyPNL: number
  totalPNL: number
  exchangeOrderId: string
  updateType: string
  transactionTime: Date
}

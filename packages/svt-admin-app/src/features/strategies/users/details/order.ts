export interface Order {
    id: string
    userId: string
    accountNumber: string
    tradeSymbol: string
    exchangeOrderId: string
    instruction: string
    isEntryOrder: boolean
    isExitOrder: boolean
    status: string
    exchangeEntryOrderId: string
    transactionTime: string | Date
}

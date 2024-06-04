export interface Order
{
    id: string
    userId: string
    accountNumber: string
    exchangeOrderId: string
    instruction: string,
    isEntryOrder: boolean,
    isExitOrder: boolean,
    status: string,
    exchangeEntryOrderId: string,
    transactionTime: Date
}
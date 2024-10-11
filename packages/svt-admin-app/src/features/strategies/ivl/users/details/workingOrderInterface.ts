export interface IWorkingOrder {
    id: string;
    userId: string;
    accountNumber: string;
    tradeSymbol: string;
    exchangeOrderId: string;
    instruction: string;
    isEntryOrder: boolean;
    isExitOrder: boolean;
    status: string;
    orderId: string;
    entryId: string;
    exchangeEntryOrderId: string;
    transactionTime: string | Date;
}
export interface ICurrentDayFills {
    id: string;
    userId: string;
    accountNumber: string;
    tradeSymbol: string;
    exchangeOrderId: string;
    exchangeEntryOrderId: string;
    instruction: string;
    isEntryOrder: boolean;
    isExitOrder: boolean;
    status: string;
    transactionTime: string | Date;
    orderId: string;
    entryId: string;
}
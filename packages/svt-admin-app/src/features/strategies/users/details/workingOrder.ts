export interface WorkingOrder {
  id: string;
  userId: string;
  accountNumber: string;
  tradeSymbol: string;
  exchangeOrderId: string;
  instruction: string;
  isEntryOrder: boolean;
  isExitOrder: boolean;
  status: string;
  entryId: string;
  orderId: string;
  exchangeEntryOrderId: string;
  transactionTime: string | Date;
}

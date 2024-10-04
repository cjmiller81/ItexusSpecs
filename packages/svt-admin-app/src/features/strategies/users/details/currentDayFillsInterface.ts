export interface ICurrentDayFills {
  tradeSymbol: string;
  instruction: string;
  isEntryOrder: boolean;
  isExitOrder: boolean;
  status: string;
  transactionTime: string | Date;
  orderId: string;
  entryId: string;
}

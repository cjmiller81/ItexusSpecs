import { ITradeQuantity } from "@/features/strategies/dte/users/types";

export interface Bot {
  isStarted: boolean;
  entryOrderId: string;
  entryExchangeOrderId: string;
  entryOrderStatus: number;
  entryOrderSymbol: string;
  exitOrderId: string;
  exitExchangeOrderId: string;
  exitOrderStatus: number;
  exitOrderSymbol: string;
  exchangeUsername: string;
  accountNumber: string;
  riskTolerance: number;
  capitalAllocation: ITradeQuantity | null;
  capitalAllocationStart: ITradeQuantity | null;
  capitalAllocationNext: ITradeQuantity | null;
  closingOnly: boolean;
  contractQty: ITradeQuantity | null;
  userMessage: string;
}

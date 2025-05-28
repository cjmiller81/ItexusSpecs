export interface TradePosition {
  id: string;
  account: number;
  ticker: string;
  optionType: 'CALL' | 'PUT' | 'SHARES';
  qty: number;
  dteMin: number;
  dteMax: number;
  entryStatus: 'Working' | 'Filled';
  entryType: string;
  entryPrice: number;
  exitType?: string;
  tierPercentage?: number;
  targetPrice?: number;
  stopPrice?: number;
}
export interface OpenPosition {
  id: string;
  userId: string;
  accountNumber: string;
  avgPrice: number;
  averagePrice?: number;
  currencySymbol: string;
  instrument: string;
  qty: number;
  pAndL: number;
  marketSymbol: string;
  username?: string;
}

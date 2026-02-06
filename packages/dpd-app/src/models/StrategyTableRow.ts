export interface StrategyTableRow {
  id: string;
  accountNumber: string;
  ticker: string;
  type: string;
  dteRange: string;
  entryOffsetPercent: number;
  entryType: string;
  amount: number;
  errorMsg: string;
  isExpanded?: boolean;
}

export interface PositionOrderRow {
  id: string;
  type: string;
  ticker: string;
  originalQty: number;
  orderType: string;
  orderId: string;
  orderQty: number;
  avgFillPrice: number;
  errorMsg: string;
}

export type OrderType = 
  | 'Filled Entry'
  | 'Filled Exit'
  | 'Filled Long' 
  | 'Filled Short' 
  | 'Working Entry' 
  | 'Working Target' 
  | 'Working Stop' 
  | 'Error';

export type PositionType = 
  | 'Underlying' 
  | 'Call' 
  | 'Call Next' 
  | 'Put' 
  | 'Put Next';

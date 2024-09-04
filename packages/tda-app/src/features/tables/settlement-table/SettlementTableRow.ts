export type SettlementTableRow = {
  type: string;
  settlementId: string;
  time: Date;
  date: Date;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  destination: string
};

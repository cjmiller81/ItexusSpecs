export type BalanceModel = {
  name: string;
  qty: number;
};

export type CustomerBalanceModel = {
  username: string;
  accountNumber: string;
  currency: string;
  isFiat: boolean;
  amount: number;
  message: string;
  timeStamp: Date;
};
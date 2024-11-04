export interface IUserList {
  id: string;
  exchangeUsername: string;
  email: string;
  accountNumber: string;
  botStatus: string;
  lastFill: number;
  fillTime: Date;
  openQty: number;
  connectionStatus: string;
}

export interface IvlUser {
  id: string
  exchangeUsername: string
  email: string,
  connectionStatus: string
  accountNumber: string
  botStatus: string
  lastFill: number
  fillTime: Date
  openQty: number
}

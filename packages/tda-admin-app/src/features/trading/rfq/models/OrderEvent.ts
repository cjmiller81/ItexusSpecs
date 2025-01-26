import { OrderStatus } from "@/features/shared/models/orderStatus"

export interface OrderEvent {
  accountNumber: string
  canceled: boolean
  canceling: boolean
  duration: string
  exchangeCode: string
  fees: number
  instruction: "Buy" | "Sell"
  linkedOrders: any[]
  marketAssetType: string
  marketSymbol: string
  orderActions: any[]
  orderId: string
  orderStatus: OrderStatus
  orderType: string
  parametersUseLaddering: boolean
  qtyPlaced: number
  qtyFilled: number
  submitRemainingAfterPartialFillCancel: boolean
  submittedRemainingAfterPartialFillCancel: boolean
  submitRemainingAfterPartialFillCancelCount: number
  submitting: boolean
  submitted: boolean
  timeConfirmed: string
  timeCreated: string
  timeFirstFill: string
  timeLastFill: string
  timeLastUpdated: string
  timeSubmitted: string
}

export function isOrderEvent(message: any): message is OrderEvent {
  return Boolean(message.orderStatus)
}

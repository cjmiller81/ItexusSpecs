export interface HistoryData {
  accountNumber: string
  canceled: boolean
  canceling: boolean
  duration: string
  exchangeCode: string
  exchangeOrderId: string
  exchangeParentOrderId: any
  exchangeReplacesOrderId: any
  exchangeQuoteId: any
  exchangeRfqId: null
  fees: number
  instruction: string
  legs: any[]
  linkedOrders: any[]
  marketAssetType: string
  marketSymbol: string
  orderActions: any[]
  orderId: string
  orderManagementSettings: {
    useLaddering: false
  }
  orderStatus: string
  orderType: string
  parametersUseLaddering: boolean
  parentOrderId: string | null
  priceSubmitted: number
  qtyPlaced: number
  qtyFilled: number
  replacesOrderId: string | null
  subscriptions: any[]
  submissionSpeed: string
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
  trailType: string
  triggerOrderId: string | null
  triggerType: string
}

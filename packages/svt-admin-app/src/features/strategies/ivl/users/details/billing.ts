export interface Billing {
  id: string
  userId: string
  paymentGateway: string
  stripeCustomerId: string
  stripeChargeId: string
  periodStart: Date
  periodEnd: Date
  description: string
  amount: number
  status: string
  transactionTime: Date
}

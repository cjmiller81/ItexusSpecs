export interface OpenPosition {
    id: string
    userId: string
    instrument: string,
    qty: number,
    avgPrice: number,
    pAndL: number | undefined,
    currencySymbol: string
}
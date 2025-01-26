export interface Market {
    date: Date;
    symbol: string;
    bought: number;
    sold: number;
    percentAvg: number;
    buyRatio: number;
    dpIndex: number;
    total: number;
}

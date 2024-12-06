export interface Market {
    date: Date;
    symbol: string;
    bought: number;
    sold: number;
    avg: number;
    buyRatio: number;
    dpIndex: number;
    total: number;
}

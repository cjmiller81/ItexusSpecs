export interface Market {
    symbol: string;
    date: string;
    bought: number;
    sold: number;
    percentAvg: number;
    buyRatio: number;
    dpIndex: number;
    total: number;
    totalVolume: number;
    averageBuyVolume: number;
    averageSellVolume: number;
    dayBuyAvg: number;
    daySellAvg: number;
}

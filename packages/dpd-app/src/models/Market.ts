export interface Market {
    tradeReportDate: Date;
    SecuritiesInformationProcessorSymbolIdentifier: string;
    bought: number;
    sold: number;
    percentAvg: number;
    buyRatio: number;
    dpIndex: number;
    totalVolume: number;
}

export interface Market {
    tradeReportDate: Date;
    securitiesInformationProcessorSymbolIdentifier: string;
    bought: number;
    sold: number;
    totalVolume: number;
}

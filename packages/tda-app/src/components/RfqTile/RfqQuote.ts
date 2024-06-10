export interface RfqQuote {
    id:string;
    transactTime: Date;
    symbol: string;
    side: "Buy" | "Sell";
    filledQty: number;
    filledPrice: number;
    accountNum : string;
    QuoteID : string;
    RFQID : string;
    status: string;
}
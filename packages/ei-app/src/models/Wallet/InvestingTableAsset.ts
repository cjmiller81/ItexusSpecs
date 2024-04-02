export interface InvestingTableAsset
{
    id: string,
    symbol: string;
    price: number;
    iconUrl?: string;
    marketCap: number;
    weight: number;
    qty: number;
    tokenId: string;
}
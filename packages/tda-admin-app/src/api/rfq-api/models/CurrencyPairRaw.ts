type CurrencyPairRaw = {
  Symbol: string;
  MinSizeIncrement: string;
  MinAmtIncrement: string;
  MinPriceIncrement: string;
  MaximumSize: string;
  MinimumSize: string;
  SizeBuckets: string[];
  Mode: string;
  UpdateAction: string;
  Revision: number;
  UpdateUser: string;
  PriceViaSyntheticCross: string;
};
export default CurrencyPairRaw;

export interface TokenInfo {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
  }
  
  export interface ProtocolStep {
    id: string | null;
    title: string | null;
    img: string | null;
    img_color: string | null;
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }
  
  export interface OneInchQuoteResponse {
    srcToken: TokenInfo;
    dstToken: TokenInfo;
    fromAmount: string | null;
    dstAmount: string;
    protocols: ProtocolStep[][][];
    gas: number;
  }
  
export interface BigNumberLike {
    mantissa: {
      isPowerOfTwo: boolean;
      isZero: boolean;
      isOne: boolean;
      isEven: boolean;
      sign: number;
    };
    exponent: number;
  }
  
  export interface PlatformAddress {
    address: string;
    platformName: string;
    platformShortName: string;
    nativeCoinId: string;
    chain_identifier: number;
  }
  
  export interface TokenResponse {
    id: string;
    addr: string;
    cats: string[];
    categoriesFormatted: string;
    chainId: string;
    chains: string[];
    chainsFormatted: string;
    cirSup: BigNumberLike;
    decs: number;
    erc20: boolean;
    exchanges: string[];
    exchangesFormatted: string;
    fulDilVal: BigNumberLike;
    lURI: string;
    mCap: BigNumberLike;
    mSup: BigNumberLike;
    name: string;
    price: BigNumberLike;
    sym: string;
    tNom: BigNumberLike;
    tSup: BigNumberLike;
    tVol: BigNumberLike;
    platform_addresses: PlatformAddress[];
  }
  
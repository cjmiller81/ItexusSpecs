import { string } from "yup";
import { appAxios } from "../lib/axios/customAxios";
import { OneInchQuoteResponse } from "../models/oneInchQuoteResponse";
import { QuoteParametersResponse } from "../models/QuoteParametersResponse";
import { TokenResponse } from "../models/token/TokenResponse";

export const dexService = {
  get: async ({ tokenPositionSymbol, chainName, qty, swapForSymbol, tokenPositionId, swapForId,}: {
    tokenPositionSymbol: string;
    chainName: string;
    qty: number;
    swapForSymbol: string;
    tokenPositionId: string;
    swapForId: string;
  }): Promise<QuoteParametersResponse> => {
    const response = await appAxios.get<QuoteParametersResponse>(
      `/api/coin-gecko/quote-parameters`,
      {
        params: {
          tokenPositionSymbol,
          chainName,
          qty,
          swapForSymbol,
          tokenPositionId,
          swapForId
        },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getQuote: async ({ chainName, fromTokenAddress, toTokenAddress, amount }: {
    chainName: string;
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: number;
  }): Promise<OneInchQuoteResponse> => {
    const response = await appAxios.get<OneInchQuoteResponse>(
      `/api/1inch/quote/${chainName}`,
      {
        params: {
          fromTokenAddress,
          toTokenAddress,
          amount
        },
        withCredentials: true,
      }
    );

    return {
      ...response.data,
      protocols: response.data.protocols
    };
  },

  getToken: async ({id}: {id:string}): Promise<TokenResponse> => {
    const response = await appAxios.get<TokenResponse>(`/tokens/${id}`,
      {
        params: { id },
        withCredentials: true,
      }
    );
    return response.data;
  }
};

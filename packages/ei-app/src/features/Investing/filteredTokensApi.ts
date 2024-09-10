import axios from "@/libs/axios/axios";
import { ICoin } from "components";

export type FilteredTokensResponse = {
  data: ICoin[];
  totalCount: number;
};
export const filteredTokensApi = {
  fetchFilteredTokens: async (
    sort: string,
    filter: string,
    skip: number,
    take: number,
  ): Promise<FilteredTokensResponse> => {
    const response = await axios.get<FilteredTokensResponse>(`/tokensV2`, {
      params: {
        sort,
        filter,
        skip,
        take,
      },
    });

    return response.data;
  },
  getTopTokens: async (
    take: number
  ): Promise<FilteredTokensResponse> => {
    const response = await axios.get<FilteredTokensResponse>(`/tokensV2`, {
      params: {
        filter: "[]",
        sort: "[{\"selector\":\"mCap\",\"desc\":true}]",
        skip: 0,
        take,
      },
    });

    return response.data;
  },
};

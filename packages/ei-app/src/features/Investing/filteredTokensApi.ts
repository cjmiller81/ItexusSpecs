import axios from "@/libs/axios/axios";
import { ICoin } from "components";

export type FilteredTokensResponse = {
  data: ICoin[];
  totalCount: number;
};

  const transformFilter = (filter: any): any => {
    // Handle null or undefined filters - return empty array
    if (filter === null || filter === undefined) {
      return [];
    }

    if (!Array.isArray(filter)) {
      return filter;
    }

    // Handle empty array
    if (filter.length === 0) {
      return filter;
    }

    if (filter.length === 3 && filter[1] === 'between' && Array.isArray(filter[2])) {
      const [field, , values] = filter;
      const [minValue, maxValue] = values;
      
      return [
        [field, '>=', minValue],
        'and',
        [field, '<=', maxValue]
      ];
    }

    return filter;
  };
export const filteredTokensApi = {
  fetchFilteredTokens: async (
    sort: string,
    filter: string | any,
    skip: number,
    take: number,
  ): Promise<FilteredTokensResponse> => {
    let transformedFilter = "[]"; // Default to empty array
    
    try {
      // Handle null, undefined, or empty string filters
      if (filter === null || filter === undefined || filter === "") {
        transformedFilter = "[]";
      } else {
        const originalFilter = typeof filter === 'string' ? JSON.parse(filter) : filter;
        const transformed = transformFilter(originalFilter);
        transformedFilter = JSON.stringify(transformed);
      }
    } catch (error) {
      console.error('Error transforming filter in fetchFilteredTokens:', error);
      transformedFilter = "[]"; // Fallback to empty array
    }

    const response = await axios.get<FilteredTokensResponse>(`/tokensV2`, {
      params: {
        sort,
        filter: transformedFilter,
        skip,
        take,
      },
    });

    return response.data;
  },
  getTopTokens: async (
    take: number
  ): Promise<FilteredTokensResponse> => {
    let transformedFilter = "[]";
    try {
      const originalFilter = JSON.parse("[]");
      const transformed = transformFilter(originalFilter);
      transformedFilter = JSON.stringify(transformed);
    } catch (error) {
      console.error('Error transforming filter in getTopTokens:', error);
    }

    const response = await axios.get<FilteredTokensResponse>(`/tokensV2`, {
      params: {
        filter: transformedFilter,
        sort: "[{\"selector\":\"mCap\",\"desc\":true}]",
        skip: 0,
        take,
      },
    });

    return response.data;
  },
};

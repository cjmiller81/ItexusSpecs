import axios from "@/libs/axios/axios";
import { ICoin } from "components";

export type FilteredTokensResponse = {
  data: ICoin[];
  totalCount: number;
};

  const hasField = (filter: any, fieldName: string): boolean => {
    if (!Array.isArray(filter)) return false;
    
    for (const item of filter) {
      if (Array.isArray(item) && item.length >= 1 && item[0] === fieldName) {
        return true;
      }
      if (Array.isArray(item)) {
        if (hasField(item, fieldName)) return true;
      }
    }
    return false;
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

    // Handle "anyof" operation - convert to format with "or" and "contains"
    if (filter.length === 3 && filter[1] === 'anyof' && Array.isArray(filter[2])) {
      const [field, , values] = filter;
      if (values.length === 0) return [];
      if (values.length === 1) {
        return [field, 'contains', values[0]];
      }
      const conditions = values.map((value: any) => [field, 'contains', value]);
      return conditions.reduce((acc, curr) => acc ? [...acc, 'or', curr] : [curr]);
    }

    // Handle "between" operation
    if (filter.length === 3 && filter[1] === 'between' && Array.isArray(filter[2])) {
      const [field, , values] = filter;
      const [minValue, maxValue] = values;
      
      return [
        [field, '>=', minValue],
        'and',
        [field, '<=', maxValue]
      ];
    }

    if (filter.length > 1 && (filter.includes('and') || filter.includes('or'))) {
      const transformed = filter.map((item: any) => {
        if (Array.isArray(item)) {
          return transformFilter(item);
        }
        return item;
      });
      
      if (hasField(transformed, 'categoriesFormatted') && !hasField(transformed, 'chainsFormatted')) {
        return [["chainsFormatted", "contains", ""], "and", transformed];
      }
      
      return transformed;
    }

    if (filter.length === 3 && typeof filter[0] === 'string' && filter[0] === 'categoriesFormatted' && typeof filter[1] === 'string' && filter[1] !== 'anyof' && filter[1] !== 'between') {
      return [["chainsFormatted", "contains", ""], "and", filter];
    }

    if (filter.length === 3 && typeof filter[0] === 'string' && typeof filter[1] === 'string' && filter[1] !== 'anyof' && filter[1] !== 'between') {
      return filter;
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

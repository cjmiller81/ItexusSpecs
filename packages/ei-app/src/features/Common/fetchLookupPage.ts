import { iconsApi } from "@/services/iconsService";
import { OnFetchResponse } from "components";

export const LookupPageSize = 200;
const fetchLookupPage = async (pageNumber: number, searchQuery: string, chainId?: number): Promise<OnFetchResponse> => {
  const response = await iconsApi.getIcons(searchQuery, pageNumber, LookupPageSize, chainId);
  return {
    totalCount: response.totalCount,
    items: response.items.map(item => ({
      label: `${item.sym.toUpperCase()} - ${item.name}`,
      iconUrl: item.lURI,
      id: item.id,
      sym: item.sym
    })),
  };
};

export default fetchLookupPage;

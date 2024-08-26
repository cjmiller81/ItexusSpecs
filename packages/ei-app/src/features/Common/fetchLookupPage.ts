import { iconsApi } from "@/services/iconsService";
import { OnFetchResponse } from "components";

export const LookupPageSize = 200;
const fetchLookupPage = async (pageNumber: number, searchQuery: string): Promise<OnFetchResponse> => {
  const response = await iconsApi.getIcons(searchQuery, pageNumber, LookupPageSize);
  return {
    totalCount: response.totalCount,
    items: response.items.map(item => ({
      label: `${item.sym.toUpperCase()} - ${item.name}`,
      iconUrl: item.lURI,
      id: item.id,
    })),
  };
};

export default fetchLookupPage;

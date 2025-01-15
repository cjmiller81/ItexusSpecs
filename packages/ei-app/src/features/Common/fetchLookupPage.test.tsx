import fetchLookupPage, { LookupPageSize } from "./fetchLookupPage";
import { iconsApi } from "@/services/iconsService";
import { OnFetchResponse } from "components";

jest.mock("@/services/iconsService", () => ({
  iconsApi: {
    getIcons: jest.fn(),
  },
}));

describe("fetchLookupPage", () => {
  const searchQuery = "example";
  const pageNumber = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data and return formatted response", async () => {
    const mockResponse = {
      totalCount: 100,
      items: [
        { id: 1, sym: "abc", name: "Example Icon", lURI: "https://example.com/icon1" },
        { id: 2, sym: "def", name: "Another Icon", lURI: "https://example.com/icon2" },
      ],
    };

    (iconsApi.getIcons as jest.Mock).mockResolvedValue(mockResponse);

    const result: OnFetchResponse = await fetchLookupPage(pageNumber, searchQuery);

    expect(iconsApi.getIcons).toHaveBeenCalledWith(searchQuery, pageNumber, LookupPageSize);

    expect(result).toEqual({
      totalCount: 100,
      items: [
        { label: "ABC - Example Icon", iconUrl: "https://example.com/icon1", id: 1 },
        { label: "DEF - Another Icon", iconUrl: "https://example.com/icon2", id: 2 },
      ],
    });
  });

  it("should handle API errors gracefully", async () => {
    (iconsApi.getIcons as jest.Mock).mockRejectedValue(new Error("API error"));

    try {
      await fetchLookupPage(pageNumber, searchQuery);
    } catch (error) {
      expect(error).toEqual(new Error("API error"));
    }
  });

  it("should handle empty response gracefully", async () => {
    const mockResponse = {
      totalCount: 0,
      items: [],
    };

    (iconsApi.getIcons as jest.Mock).mockResolvedValue(mockResponse);

    const result: OnFetchResponse = await fetchLookupPage(pageNumber, searchQuery);

    expect(result).toEqual({
      totalCount: 0,
      items: [],
    });
  });

  it("should use the correct page size constant", async () => {
    const mockResponse = {
      totalCount: 50,
      items: [{ id: 1, sym: "xyz", name: "Icon", lURI: "https://example.com/icon" }],
    };

    (iconsApi.getIcons as jest.Mock).mockResolvedValue(mockResponse);

    await fetchLookupPage(pageNumber, searchQuery);

    expect(iconsApi.getIcons).toHaveBeenCalledWith(searchQuery, pageNumber, LookupPageSize);
  });
});

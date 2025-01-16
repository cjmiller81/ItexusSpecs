import { getTopTokensColumnsDefs } from "./TopTokensColumnsDefs";
import { render } from "@testing-library/react";
import { t } from "i18next";

jest.mock("i18next", () => ({
  t: jest.fn(key => key), // Mock translations for simplicity
  setDefaultNamespace: jest.fn(), // Mock setDefaultNamespace function
}));

describe("getTopTokensColumnsDefs", () => {
  it("should return the correct number of columns", () => {
    const columns = getTopTokensColumnsDefs();
    expect(columns).toHaveLength(4); // Assuming 4 columns
  });

  it("should define the correct fields and headers", () => {
    const columns = getTopTokensColumnsDefs();
    expect(columns[0].field).toBe("symbol");
    expect(columns[0].headerName).toBe("Symbol");
    expect(columns[1].field).toBe("price");
    expect(columns[1].headerName).toBe("Price");
    expect(columns[2].field).toBe("marketCap");
    expect(columns[2].headerName).toBe("MarketCap");
    expect(columns[3].field).toBe("fulDilVal");
    expect(columns[3].headerName).toBe("FullyDilutedValuation");
  });

  it("should correctly format price values", () => {
    const columns = getTopTokensColumnsDefs();
    const priceColumn = columns.find(col => col.field === "price");

    const mockParams = {
      id: "1",
      row: {
        id: "1",
        symbol: "BTC",
        price: 1234.56789,
        marketCap: 0,
        tokenId: "btc",
        fulDilVal: 0,
      },
      rowNode: {} as any,
      field: "price",
      colDef: {} as any,
      cellMode: "view",
      api: {} as any,
      hasFocus: false,
      isEditable: false,
      value: 1234.56789,
    };

    // @ts-ignore
    const formattedPrice = priceColumn?.valueGetter!(mockParams);

    expect(formattedPrice).toBe("$1,234.5679");
  });

  it("should render IconCell in the symbol column", () => {
    const columns = getTopTokensColumnsDefs();
    const symbolColumn = columns.find(col => col.field === "symbol");

    const { container } = render(
      symbolColumn?.renderCell!({
        row: { symbol: "BTC", iconUrl: "url-to-icon" },
      } as any),
    );

    expect(container).toHaveTextContent("BTC");
  });

  it("should handle missing data in valueGetter gracefully", () => {
    const columns = getTopTokensColumnsDefs();
    const priceColumn = columns.find(col => col.field === "price");

    const formattedPrice = priceColumn?.valueGetter!({
      // @ts-ignore
      row: { price: null },
      field: "price",
      api: {} as any,
      rowNode: {} as any,
      colDef: {} as any,
      cellMode: "view",
      hasFocus: false,
      value: null,
    });

    expect(formattedPrice).toBe("--");
  });
});

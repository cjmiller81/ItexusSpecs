import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { TopTokensTile, TopTokenData } from "./TopTokensTile";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const mockTableAssets: TopTokenData[] = [
  {
    id: "1",
    symbol: "BTC",
    price: 20000,
    marketCap: 400000000,
    iconUrl: "https://example.com/btc-icon.png",
    tokenId: "btc-token",
    fulDilVal: 500000000,
  },
  {
    id: "2",
    symbol: "ETH",
    price: 1500,
    marketCap: 200000000,
    iconUrl: "https://example.com/eth-icon.png",
    tokenId: "eth-token",
    fulDilVal: 300000000,
  },
];

describe("TopTokensTile", () => {
  it("should render the DashboardTile with the correct title and icon", () => {
    render(
      <ThemeProvider theme={theme}>
        <TopTokensTile
          title="Top Tokens"
          icon="tokens-icon"
          tableAssets={mockTableAssets}
          loading={false}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Top Tokens")).toBeInTheDocument();
  });

  it("should render the DataGrid with rows", () => {
    render(
      <ThemeProvider theme={theme}>
        <TopTokensTile
          title="Top Tokens"
          icon="tokens-icon"
          tableAssets={mockTableAssets}
          loading={false}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
  });

  it("should show a loading state when loading is true", () => {
    render(
      <ThemeProvider theme={theme}>
        <TopTokensTile
          title="Top Tokens"
          icon="tokens-icon"
          tableAssets={null}
          loading={true}
        />
      </ThemeProvider>,
    );
  });

  it("should render empty rows when tableAssets is null", () => {
    render(
      <ThemeProvider theme={theme}>
        <TopTokensTile
          title="Top Tokens"
          icon="tokens-icon"
          tableAssets={null}
          loading={false}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByText("BTC")).not.toBeInTheDocument();
    expect(screen.queryByText("ETH")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { TradingViewTile } from "./TradingViewTile";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("react-ts-tradingview-widgets", () => ({
  AdvancedRealTimeChart: jest.fn(props => (
    <div
      data-testid="advanced-chart"
      data-theme={props.theme}>
      Advanced RealTime Chart
    </div>
  )),
  TickerTape: jest.fn(props => (
    <div
      data-testid="ticker-tape"
      data-theme={props.colorTheme}>
      Ticker Tape
    </div>
  )),
}));

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

describe("TradingViewTile", () => {
  const title = "Trading View";
  const icon = "chart-icon";

  it("should render the DashboardTile with the correct title and icon", () => {
    render(
      <ThemeProvider theme={theme}>
        <TradingViewTile
          title={title}
          icon={icon}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("should render the dynamic components", () => {
    render(
      <ThemeProvider theme={theme}>
        <TradingViewTile
          title={title}
          icon={icon}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("ticker-tape")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-chart")).toBeInTheDocument();
  });

  it("should pass the correct theme to dynamic components", () => {
    render(
      <ThemeProvider theme={theme}>
        <TradingViewTile
          title={title}
          icon={icon}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("ticker-tape")).toHaveAttribute("data-theme", "light");
    expect(screen.getByTestId("advanced-chart")).toHaveAttribute("data-theme", "light");
  });
});

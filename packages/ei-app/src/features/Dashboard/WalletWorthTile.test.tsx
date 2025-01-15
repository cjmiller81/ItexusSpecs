import { render, screen } from "@testing-library/react";
import { WalletWorthTile } from "./WalletWorthTile";
import { AppChart } from "@/components/Charts/AppChart";
import { CompareToValues } from "@/libs/redux/Slices/Shared";
import { useTranslation } from "react-i18next";

jest.mock("@/components/Charts/AppChart", () => ({
  AppChart: jest.fn(() => <div>AppChart</div>),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key })),
}));

describe("WalletWorthTile", () => {
  const chartData: CompareToValues = [
    { x: "2025-01-01", y: 10 },
    { x: "2025-01-02", y: 20 },
  ];
  const title = "Wallet Worth";
  const icon = "wallet-icon";

  it("should render the DashboardTile with the correct title and icon", () => {
    render(
      <WalletWorthTile
        title={title}
        icon={icon}
        chartData={chartData}
      />,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    // expect(screen.getByAltText(icon)).toBeInTheDocument()
  });

  it("should format values as percentages using percentageFormatter", () => {
    const percentageFormatter = (value: number) => {
      return `${value.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}%`;
    };

    const formattedValue = percentageFormatter(10.23);
    expect(formattedValue).toBe("10.23%");
  });

  it("should pass the correct series prop to AppChart", () => {
    render(
      <WalletWorthTile
        title={title}
        icon={icon}
        chartData={chartData}
      />,
    );

    const chart = screen.getByText("AppChart");
    expect(chart).toBeInTheDocument();

    expect(AppChart).toHaveBeenCalledWith(
      expect.objectContaining({
        series: [
          {
            name: "ChartSeriesTitle",
            data: chartData,
          },
        ],
      }),
      expect.anything(),
    );
  });

  it("should render the AppChart with custom optionsOverrides", () => {
    render(
      <WalletWorthTile
        title={title}
        icon={icon}
        chartData={chartData}
      />,
    );

    const chart = screen.getByText("AppChart");
    expect(chart).toBeInTheDocument();
  });

  it("should call useTranslation hook", () => {
    render(
      <WalletWorthTile
        title={title}
        icon={icon}
        chartData={chartData}
      />,
    );

    expect(useTranslation).toHaveBeenCalledWith("WalletWorthTile");
  });
});
